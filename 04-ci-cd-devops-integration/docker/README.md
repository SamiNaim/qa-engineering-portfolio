## What is here

Applied from [docker-curriculum.com](https://docker-curriculum.com/): one image I build myself,
then the same image wired to a second container with Compose.

| File | Purpose |
|---|---|
| [flask-app/app.py](./flask-app/app.py) | Catnip, the tutorial's Flask app, plus `/health` and an Elasticsearch-backed `/search` |
| [flask-app/Dockerfile](./flask-app/Dockerfile) | Multi-stage build, non-root user, `HEALTHCHECK` |
| [flask-app/.dockerignore](./flask-app/.dockerignore) | Keeps caches and `.git` out of the build context |
| [docker-compose.yml](./docker-compose.yml) | `web` + `es` on one network, with a named volume and Compose Watch |

## Run it

```bash
# One container, no Elasticsearch. "/" works, "/search" answers 503.
docker build -t catnip ./flask-app
docker run --rm -p 8888:5000 catnip

# Both containers.
docker compose up -d --build
curl localhost:8888/health
curl "localhost:8888/search?q=tacos"
docker compose down -v          # -v also drops the esdata volume
```

Port 8888 rather than 5000, because AirPlay Receiver holds 5000 on macOS.

## What each piece demonstrates

**Image layers.** `requirements.txt` is copied and installed before the source is copied, so
editing `app.py` reuses the dependency layer instead of reinstalling Flask.

**Multi-stage.** Stage 1 has pip and the wheel toolchain; stage 2 receives only `/install`.
The build tooling never reaches the runtime image, which is smaller and has less to attack.

**Not root.** The app runs as uid 10001. A container process that never needs root should not
be handed it.

**Service discovery.** `web` reaches Elasticsearch at `http://es:9200`. `es` is the service
name, resolved by Docker's DNS on the network Compose creates. No IP addresses anywhere.

**Readiness, not existence.** `depends_on: condition: service_healthy` waits for the ES
healthcheck to pass. Plain `depends_on` only waits for the container to be created, which is
how "connection refused on first boot" gets into a stack.

**Compose Watch.** `docker compose up --watch` syncs edited `.py` files into the running
container, and rebuilds the image when `requirements.txt` changes.

Verified locally: both containers reach `healthy`, `/search?q=tacos` returns the seeded
document, `/health` reports the cluster status. A single-node cluster reports `yellow` once
the index exists, since its replica shards have nowhere to go. That is expected, not a fault.

## How this differs from the neighbouring folders

This folder is about **building and running** an application's containers by hand, on one
machine. I control the lifecycle: I build, I start, I stop.

[../kubernetes/](../kubernetes/) takes an image that already exists and hands it to a cluster
that keeps it running — replicas, self-healing, rolling updates. Nothing is built there.

[../testcontainers/](../testcontainers/) starts containers from inside a test run and throws
them away when the test method ends. No image is built and no service is deployed; the
container is a fixture.
