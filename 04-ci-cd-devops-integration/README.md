<div align="center">

# CI/CD DevOps Integration

**CI/CD DevOps Integration with Docker, Kubernetes, Testcontainers.**

</div>

---

## What is here

| Folder | Content |
|---|---|
| [docker/](./docker/) | Building an image and running a two-container Compose stack |
| [kubernetes/](./kubernetes/) | Running an existing image on a cluster: replicas, Services, rolling updates |
| [testcontainers/](./testcontainers/) | Containers started and discarded by a JUnit test run |
| [jenkins/](./jenkins/) | Build → Test → Deliver pipeline as a Jenkinsfile |
| [github-actions/](./github-actions/) | Workflows that run the portfolio's test suites on push |

The first three all run containers, for three different reasons: `docker/` builds and runs
them, `kubernetes/` keeps them running, `testcontainers/` uses them as test fixtures.

## Dependencies

| Tool | Version |
|---|---|
| Docker | Latest |
| Kubernetes | Latest |
| Testcontainers | Latest |

## Courses

- https://learn.github.com/courses/helloGitHubActions
- https://learn.github.com/courses/testwithActions
- https://www.jenkins.io/doc/tutorials/build-a-java-app-with-maven/
- https://www.youtube.com/@TechWorldwithNana/courses
- https://docker-curriculum.com
- https://kubernetes.io/docs/tutorials/kubernetes-basics/