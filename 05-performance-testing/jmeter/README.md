# JMeter Lab

## `BasicTestPlan.jmx`

File → Open → select `BasicTestPlan.jmx` in this folder. You'll see the tree structure on the left:

```
Basic Test Plan
├─ CSV Data Set Config          <- reads data/users.csv
└─ Thread Group (closed model)  <- 20 virtual users, 10 loops each
   ├─ GET user (HTTP Request)   <- uses ${id} from the CSV row
   ├─ Think Time (Constant Timer) <- 1s pause, like k6's sleep()
   ├─ Aggregate Report          <- percentiles: 50/90/95/99
   └─ Summary Report            <- quick throughput/error overview
```

This mirrors JMeter's core building blocks (from the User Manual's "Elements of a Test Plan"):
**Thread Group** (defines the virtual users) → **Sampler** (the request) → **Listener** (where results go), plus a **Config Element** (CSV Data Set) and a **Timer** for think time.

## Run

**From the GUI** (fine for building/debugging, not for real load — the GUI itself consumes resources):
- Click the green ▶ Start button.
- Click "Aggregate Report" or "Summary Report" in the tree to watch results arrive live, including the **percentile columns (90%, 95%, 99% Line)** — this is where percentiles vs. averages becomes visible directly in the UI.

**From the command line** (the recommended way to actually generate load):
```bash
mkdir -p results
jmeter -n -t BasicTestPlan.jmx -l results/results.jtl -e -o results/dashboard
```
- `-n` non-GUI mode
- `-t` the test plan
- `-l` raw results file
- `-e -o` generate an HTML dashboard report (includes percentile graphs) into `results/dashboard`

Open `results/dashboard/index.html` afterward to see response-time percentile charts.

## Concepts in this test plan

- **Percentiles vs. averages** — the Aggregate Report's 90/95/99% Line columns, and the HTML dashboard's percentile graphs, surface tail latency the average would hide.
- **Little's Law** — see the comment above `ThreadGroup.num_threads`; it explains how the 20-thread count relates to a target throughput and expected response time.
- **Open vs. closed workload models** — a standard Thread Group is a **closed model** (fixed virtual users, self-limiting). The README notes what plugin to add (Concurrency/Arrivals Thread Group from jmeter-plugins.org) to get an **open model** that mimics uncoordinated real users.
- **USE method** — JMeter reports the client-side/application view. Pair a JMeter run with `top`/`vmstat`/`iostat` (or your APM tool) on the server under test to check Utilization, Saturation, and Errors on CPU, memory, disk, and network while the test runs.
