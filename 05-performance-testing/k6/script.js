import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = __ENV.BASE_URL || 'https://jsonplaceholder.typicode.com';

// SharedArray loads the CSV once and shares it (read-only) across all VUs,
// instead of every VU parsing its own copy in memory.
const users = new SharedArray('users', function () {
  return papaparse
    .parse(open('./data/users.csv'), { header: true })
    .data.filter((row) => row.id);
});

function pickUser() {
  return users[Math.floor(Math.random() * users.length)];
}

export const options = {
  scenarios: {
    // CLOSED MODEL
    // A fixed pool of 20 virtual users. Each one waits for a response
    // before sending its next request. 
    closed_model: {
      executor: 'constant-vus',
      vus: 20,
      duration: '30s',
      exec: 'closedModel',
    },

    // OPEN MODEL
    // Requests arrive at a fixed rate no matter how the server responds.
    //
    // Little's Law (L = λ × W) sizes the VU pool here:
    //   λ (rate)      = 50 requests/sec (target throughput)
    //   W (latency)   = ~0.5s expected response time (a guess to validate)
    //   L (concurrency) = 50 × 0.5 = 25 VUs needed in flight
    // preAllocatedVUs/maxVUs below give headroom above that estimate so
    // the executor never has to scramble to spin up new VUs mid-test.
    open_model: {
      executor: 'constant-arrival-rate',
      rate: 50,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 25,
      maxVUs: 100,
      exec: 'openModel',
      startTime: '35s', // run after closed_model finishes
    },
  },

  thresholds: {
    // Percentiles, not averages: p95/p99 catch the tail latency that an
    // average would hide.
    http_req_duration: ['p(50)<300', 'p(95)<800', 'p(99)<1500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

// Status alone is a weak assertion: a 200 carrying the wrong user (or an error
// page) would still pass. These checks also verify the response BODY.
function checkUserResponse(res, user) {
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body returns the requested user id': (r) => {
      try {
        return r.json('id') === Number(user.id);
      } catch (e) {
        return false; // body was not valid JSON at all
      }
    },
    'body is shaped like a user': (r) => {
      try {
        const body = r.json();
        return (
          typeof body.name === 'string' &&
          body.name.length > 0 &&
          typeof body.email === 'string' &&
          body.email.includes('@')
        );
      } catch (e) {
        return false;
      }
    },
  });
}

export function closedModel() {
  const user = pickUser();
  const res = http.get(`${BASE_URL}/users/${user.id}`);
  checkUserResponse(res, user);
  sleep(1); // think time between a VU's requests
}

export function openModel() {
  const user = pickUser();
  const res = http.get(`${BASE_URL}/users/${user.id}`);
  checkUserResponse(res, user);
  // No sleep here: the arrival-rate executor controls pacing, not the script.
}