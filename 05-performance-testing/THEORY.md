# Performance Testing Concepts

## Percentiles vs. Averages
Averages hide the pain. If 99 requests take 10ms and 1 takes 5000ms, the average (~60ms) looks fine, but that one user had a terrible experience. Percentiles (p50, p95, p99, p99.9) show the actual distribution:

- **p50 (median):** typical experience
- **p95/p99:** tail latency, what your worst-affected users see
- **p99.9:** rare but often systemic issues (GC pauses, lock contention, cold caches)

For SLAs and capacity planning, always report percentiles alongside (or instead of) averages. Averages can look healthy while a meaningful chunk of users suffer.

## Little's Law
A queuing theory formula relating concurrency, throughput, and latency:

```
L = λ × W
```
- **L** = average number of requests in the system (concurrency)
- **λ** = arrival rate (throughput, requests/sec)
- **W** = average time each request spends in the system (latency)

Practical use: if you know your target throughput and expected latency, you can calculate the concurrency (threads/connections) needed to sustain it, or conversely, diagnose whether rising latency under fixed concurrency means your system is saturating.

## Open vs. Closed Workload Models
Describes how a load-testing tool generates requests:

- **Closed model:** a fixed number of virtual users, each waiting for a response before sending the next request. Throughput naturally self-limits. If the server slows down, so does the arrival rate. This can mask problems because load "backs off" automatically.
- **Open model:** requests arrive at a fixed rate (e.g., 500 req/sec) regardless of how fast the server responds. This mimics real-world traffic (users don't coordinate with each other) and will expose queueing and instability that closed models hide.

Most real production traffic is closer to open; many load-testing tools default to closed, which can give overly optimistic results.

## Brendan Gregg's USE Method
A systematic checklist for diagnosing performance bottlenecks in system resources (CPU, memory, disk, network, etc.). For every resource, check:

- **Utilization:** % of time the resource is busy servicing work
- **Saturation:** degree of queued/waiting work the resource can't service immediately
- **Errors:** count of error events (retries, drops, failures)

Applying U-S-E across all resources quickly narrows down where a bottleneck actually is, rather than guessing or chasing symptoms. It complements (rather than replaces) application-level tracing.