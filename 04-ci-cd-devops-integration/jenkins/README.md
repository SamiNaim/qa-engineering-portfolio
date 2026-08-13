## What is here

| File | Purpose |
|---|---|
| [Jenkinsfile](./Jenkinsfile) | Build → Test → Deliver pipeline |
| [scripts/deliver.sh](./scripts/deliver.sh) | Deliver stage, kept out of the Jenkinsfile |

Applied from the Jenkins tutorial [Build a Java app with Maven](https://www.jenkins.io/doc/tutorials/build-a-java-app-with-maven/).
That tutorial matches the Rest Assured half of `01-api-testing/`.

## How Jenkins works

Jenkins is an automation server. It watches a source of change, and on each change runs
a defined sequence of steps on a machine it controls.

```
                  ┌──────────────────────────────────────────┐
   git push  ───► │  Controller  (localhost:8080)            │
                  │  schedules work, stores config + results │
                  └───────────────────┬──────────────────────┘
                                      │ dispatches the build
                                      ▼
                  ┌──────────────────────────────────────────┐
                  │  Agent  (has JDK 21 + Maven installed)   │
                  │  clones repo into a workspace, runs sh   │
                  └───────────────────┬──────────────────────┘
                                      │ reports back
                                      ▼
                        console log · JUnit trends · artifacts
```

**Controller** — the web UI on port 8080. Holds job definitions, credentials, plugins,
and build history. It decides *what* runs and *when*; it should not run builds itself.

**Agent** — a separate machine or container that actually executes the build. It needs
the toolchain your pipeline calls: this pipeline runs `mvn`, so the agent needs Maven
and a JDK. `agent any` in the Jenkinsfile means "any available agent".

**Workspace** — a directory on the agent where Jenkins clones the repo. All paths in the
Jenkinsfile are relative to it. It persists between builds, which is why `clean` is in
the Build stage.

**Job** — here, a *Pipeline* job configured as **Pipeline script from SCM**. Jenkins
clones the repo and reads the Jenkinsfile *from that clone*, so the pipeline is versioned
with the code it builds. This is Pipeline-as-Code.

**Stages and steps** — a `stage` is a named phase shown as a column in the UI. A `step`
is one action: `sh` runs a shell command, `junit` ingests test XML, `dir` changes
directory. Stages run in order and the first failing one stops the run.

**Build result** — `SUCCESS`, `UNSTABLE` (built fine, tests failed), or `FAILURE` (the
build itself broke). The distinction is what drives `skipStagesAfterUnstable()`.

### What this pipeline does per run

| Stage | Command | Outcome |
|---|---|---|
| Build | `mvn -B -DskipTests clean package` | Compiles and jars, no tests. Fails fast on a compile error. |
| Test | `mvn -B -Dmaven.test.failure.ignore=true test` | Runs JUnit 5 + Rest Assured. `junit` then publishes `target/surefire-reports/*.xml` in a `post { always }` block, so results are archived even on failure. |
| Deliver | `scripts/deliver.sh` | Installs the jar to the local Maven repo and verifies it. Skipped if Test went UNSTABLE. |