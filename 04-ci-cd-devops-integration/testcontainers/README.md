## What is here

Applied from [testcontainers.com/getting-started](https://testcontainers.com/getting-started/):
a Maven project whose tests start their own PostgreSQL, use it, and throw it away.

| File | Purpose |
|---|---|
| [GenericContainerTest.java](./src/test/java/com/example/GenericContainerTest.java) | The low-level API: any image, ports, environment and wait strategy spelled out by hand |
| [PostgresModuleTest.java](./src/test/java/com/example/PostgresModuleTest.java) | The same thing through `PostgreSQLContainer` and `@Container` |
| [DataIntegrityTest.java](./src/test/java/com/example/DataIntegrityTest.java) | Assertions that only a real engine can answer: foreign keys, `CHECK`, `NUMERIC` sums |
| [src/test/resources/init.sql](./src/test/resources/init.sql) | Schema and seed data, loaded by `withInitScript` |

## Run it

```bash
mvn test          # Docker must be running; images are pulled on the first run
```

Verified locally: 7 tests, 0 failures, roughly 4 seconds after the images are cached.

## What each piece demonstrates

**GenericContainer vs. a module.** The generic version has to name the port, the credentials
and the log line that means "ready" — and `withTimes(2)`, because Postgres prints that line
once for the temporary server `initdb` uses and once for the real one. Waiting for the first
connects too early. `PostgreSQLContainer` knows all of that already and hands back
`getJdbcUrl()`.

**Random host ports.** `getMappedPort(5432)`, never a hard-coded 5432. The host port is
assigned at start, so two runs, or a run next to a local Postgres, cannot collide.

**Lifecycle.** `@Container` on a `static` field starts one container per class; on an instance
field it would start one per test — stronger isolation, several seconds slower. Anything
missed is reaped by the Ryuk sidecar, so a killed JVM does not leave containers behind.

**Why a real database.** The failing inserts in `DataIntegrityTest` assert SQLState `23503`
and `23514` — PostgreSQL's own foreign-key and check-violation codes. A mock returns whatever
it was told to; an in-memory substitute rejects them for different reasons than production
would, if it rejects them at all.

**One local wrinkle worth recording.** Docker Engine 29 refuses API versions below 1.40, and
docker-java still asks for 1.32, which surfaces as the unhelpful *"Could not find a valid
Docker environment"*. [pom.xml](./pom.xml) pins `api.version=1.43` for the Surefire JVM, so
`mvn test` works without any environment setup.

## How this differs from the neighbouring folders

This folder uses containers as **test fixtures**. They are created by the test run, live for
one class, and are deleted before the JVM exits. Nothing is deployed and nothing is built;
the point is a real dependency instead of a mock, on a laptop or on a CI runner.

[../docker/](../docker/) builds the image and runs the application by hand — long-running
processes I start and stop myself.

[../kubernetes/](../kubernetes/) hands a finished image to a cluster that keeps it running
and updates it in place.

Also compare [../../03-database/testcontainers/](../../03-database/testcontainers/), which is
the same tool in Python driving pytest fixtures. The concepts carry over one for one; the
API does not.
