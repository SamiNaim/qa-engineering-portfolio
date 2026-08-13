# k6

## `script.js`

This is a JavaScript file with three parts, matching k6's standard test structure:

1. **Imports** — `http`, `sleep`/`check`, `SharedArray` (efficient CSV loading), and `papaparse` (CSV parsing jslib).
2. **`options`** — defines *two scenarios* in the same file:
   - `closed_model`: a fixed 20 virtual users looping continuously (**closed workload model**).
   - `open_model`: a fixed arrival rate of 50 req/s regardless of server speed (**open workload model**), sized using **Little's Law** (see the comment in the script).
   - `thresholds` — pass/fail conditions based on **percentiles** (p50/p95/p99), not the average.
3. **Default-style functions** (`closedModel`, `openModel`) — the actual request logic, each pulling a random row from `data/users.csv`.

k6 prints a summary at the end, including per-percentile breakdowns of `http_req_duration`. Watch how the closed-model block and the open-model block produce different-shaped latency distributions even against the same target.

### Optional: live web dashboard
```bash
K6_WEB_DASHBOARD=true k6 run script.js
```
Then open the URL k6 prints to watch live percentiles.

## USE method

Swap `constant-arrival-rate` for `ramping-arrival-rate` to build a stress test that increases load over time. While the test runs, watch your server's CPU/queue/errors.
