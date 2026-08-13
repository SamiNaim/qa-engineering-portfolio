#!/usr/bin/env bash
# The six modules of https://kubernetes.io/docs/tutorials/kubernetes-basics/
# run in order against a local minikube cluster. Read it top to bottom; it is
# the tutorial's own commands, not an abstraction over them.
#
#   ./basics.sh            run every module
#   ./basics.sh clean      delete the deployment, the service and the cluster
set -euo pipefail

DEPLOYMENT=kubernetes-bootcamp
MANIFESTS="$(cd "$(dirname "$0")" && pwd)/manifests"

step() { printf '\n\033[1m== %s\033[0m\n' "$*"; }

if [[ "${1:-}" == "clean" ]]; then
  kubectl delete -f "$MANIFESTS" --ignore-not-found
  minikube delete
  exit 0
fi

step "Module 1: create a cluster"
minikube start
kubectl cluster-info
kubectl get nodes

step "Module 2: deploy an app"
kubectl apply -f "$MANIFESTS/deployment.yaml"
kubectl rollout status "deployment/$DEPLOYMENT" --timeout=180s
kubectl get deployments

step "Module 3: explore your app"
kubectl get pods -o wide
POD=$(kubectl get pods -l app=$DEPLOYMENT -o jsonpath='{.items[0].metadata.name}')
kubectl describe pod "$POD" | head -25
kubectl logs "$POD"
kubectl exec "$POD" -- env | sort | head -10

step "Module 4: expose your app publicly"
kubectl apply -f "$MANIFESTS/service.yaml"
kubectl get services
kubectl describe service $DEPLOYMENT | grep -E 'Selector|NodePort|Endpoints'
URL=$(minikube service $DEPLOYMENT --url)
echo "Service URL: $URL"
curl -s "$URL"

step "Module 5: scale your app"
kubectl scale "deployment/$DEPLOYMENT" --replicas=4
kubectl rollout status "deployment/$DEPLOYMENT" --timeout=180s
kubectl get pods -l app=$DEPLOYMENT
echo "Four requests, and the pod name in the response should not always be the same:"
for _ in 1 2 3 4; do curl -s "$URL" | grep -o 'kubernetes-bootcamp-[a-z0-9-]*'; done

step "Module 6: update your app"
kubectl set image "deployments/$DEPLOYMENT" $DEPLOYMENT=docker.io/jocatalin/kubernetes-bootcamp:v2
kubectl rollout status "deployment/$DEPLOYMENT" --timeout=180s
curl -s "$URL"          # expect: v=2
kubectl rollout history "deployment/$DEPLOYMENT"

step "Module 6: a broken update, and the rollback"
kubectl set image "deployments/$DEPLOYMENT" $DEPLOYMENT=gcr.io/google-samples/kubernetes-bootcamp:v10
kubectl rollout status "deployment/$DEPLOYMENT" --timeout=45s || echo "rollout stalled, as expected: the tag does not exist"
kubectl get pods   # some pods in ErrImagePull, the old ones still serving
kubectl rollout undo "deployments/$DEPLOYMENT"
kubectl rollout status "deployment/$DEPLOYMENT" --timeout=180s
curl -s "$URL"          # back to v=2, and no request ever failed

printf '\nDone. Run "%s clean" to tear the cluster down.\n' "$0"
