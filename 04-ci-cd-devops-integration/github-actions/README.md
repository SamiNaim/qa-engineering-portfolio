## Workflows

| File | Trigger | What it does |
|---|---|---|
| [hello-github-actions.yml](../../.github/workflows/hello-github-actions.yml) | push to `main`, PR opened, manual | Prints a greeting and the event context; comments a welcome message on new pull requests |
| [test-with-actions.yml](../../.github/workflows/test-with-actions.yml) | push to `main`, PR, manual | Runs the Playwright API tests from `01-api-testing/` and uploads the HTML report |

## hello-github-actions.yml

- `say-hello` echoes a greeting, then prints `github.event_name`, the repository,
  the ref, the actor and the runner OS. Useful for seeing what context a workflow
  actually receives.
- `welcome-comment` runs only when the event is a pull request. It uses the
  pre-installed `gh` CLI with the automatic `GITHUB_TOKEN`, so no third-party
  action and no secret of my own is involved. It needs `pull-requests: write`,
  granted per job rather than repository-wide.

## test-with-actions.yml

The same idea applied to something that matters, a test suite that gates the
merge instead of being run by hand afterwards.

| Step | Why |
|---|---|
| `actions/checkout` | The runner starts empty; the code has to be fetched |
| `actions/setup-node` | Pins Node 22 and caches `~/.npm` against the lockfile |
| `npm ci` | Installs exactly what `package-lock.json` says, unlike `npm install` |
| `npx playwright install --with-deps chromium` | Browser binaries and system libraries are not on the runner image |
| `npx playwright test` | Runs `tests/api_tests.spec.ts` on the `chromium` project |
| `actions/upload-artifact` | Keeps the HTML report for 7 days, including on failure |

Details worth noting:

- `defaults.run.working-directory` points every step at
  `01-api-testing/playwright-tests`, so the steps stay free of `cd`. Paths passed
  *to actions* (the npm cache path, the artifact path) are not covered by that
  default and stay repository-relative.
- `paths` filters keep the workflow from running on changes to unrelated folders.
- `if: ${{ !cancelled() }}` uploads the report on a failed run too, which is the
  run where the report is actually worth reading.
- The existing `playwright.config.ts` already reacts to CI: `forbidOnly` fails the
  build on a stray `test.only`, and it retries twice with a single worker.
- The tests hit the public `restful-booker.herokuapp.com` instance, so a red run
  is not always a real regression. The retries absorb some of it. A hermetic
  version of this suite belongs behind Testcontainers, which is the next folder
  over.
