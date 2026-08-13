## What is here

Applied from [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/),
the six-module minikube tutorial, kept as files instead of a shell history.

| File | Purpose |
|---|---|
| [basics.sh](./basics.sh) | The six modules in order: cluster → deploy → explore → expose → scale → update → rollback |
| [manifests/deployment.yaml](./manifests/deployment.yaml) | What `kubectl create deployment` produces, written out and annotated |
| [manifests/service.yaml](./manifests/service.yaml) | What `kubectl expose --type=NodePort` produces |

## Run it

```bash
brew install minikube     # kubectl alone is not enough; there has to be a cluster
./basics.sh               # all six modules
./basics.sh clean         # delete deployment, service and cluster
```

The tutorial's `gcr.io/google-samples/kubernetes-bootcamp:v1` image is amd64 only. On Apple
Silicon, start minikube with a driver that emulates amd64 (the Docker Desktop driver does).

**Not verified end to end on this machine** — minikube is not installed here, so no cluster
was created. The manifests parse and carry the fields the tutorial's imperative commands
generate; `basics.sh` passes `bash -n`. The run itself is still untested.

## The six modules

| Module | Command | Idea |
|---|---|---|
| 1 Cluster | `minikube start` | A control plane plus one node. `kubectl` talks to the API server, never to the node. |
| 2 Deploy | `kubectl apply -f manifests/deployment.yaml` | I declare *what should be running*; the scheduler decides where. |
| 3 Explore | `kubectl get/describe/logs/exec` | A Pod is the unit of scheduling: one or more containers sharing an IP and a lifetime. |
| 4 Expose | `kubectl apply -f manifests/service.yaml` | Pods get new IPs whenever they are replaced. A Service is the stable address in front of them, matched by **label**, not by name. |
| 5 Scale | `kubectl scale --replicas=4` | Change the desired count; the Deployment converges on it and the Service load-balances across the new Pods. |
| 6 Update | `kubectl set image` / `rollout undo` | Pods are replaced a few at a time, and the readiness probe gates traffic, so the update takes no downtime. `rollout undo` returns to the previous revision. |

The last step of `basics.sh` is deliberately a *failed* update to a tag that does not exist.
The new Pods stay in `ErrImagePull`, the old ones keep serving, and `rollout undo` restores
the previous revision. The behaviour worth seeing, because it is the one that matters at
three in the morning.

## How this differs from the neighbouring folders

This folder is about **keeping already-built images running**. Nothing here builds anything:
the image is a given, and what is being learned is desired state, self-healing and rollout.
It is a shared, long-lived environment.

[../docker/](../docker/) is the other end — building the image, and running a couple of
containers on one machine whose lifecycle I drive by hand.

[../testcontainers/](../testcontainers/) is throwaway rather than long-lived: containers that
exist for the duration of a test method, on my laptop or on a CI runner.
