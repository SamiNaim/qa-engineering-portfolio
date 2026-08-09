<div align="center">

# Web UI Automation

**End-to-end web UI test automation with Playwright and TypeScript.**

[![Web UI Automation](https://github.com/SamiNaim/qa-engineering-portfolio/actions/workflows/playwright.yml/badge.svg)](https://github.com/SamiNaim/qa-engineering-portfolio/actions/workflows/playwright.yml)

</div>

---

## What this covers

A Page Object Model suite running against four public demo sites, on four
browser projects (Chromium, Firefox, WebKit, Pixel 5).

| Site                                                  | Scenarios                                                            |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| [The Internet](https://the-internet.herokuapp.com/)   | Valid and invalid login, flash-message assertions                    |
| [Sauce Demo](https://www.saucedemo.com/)              | Login, locked-out user, full checkout, accessibility scan            |
| [Automation Exercise](https://automationexercise.com) | New-user signup with generated data                                  |
| [DemoQA](https://demoqa.com)                          | Practice form submission, confirmation verified with soft assertions |

## Getting started

```bash
npm ci
npx playwright install
npm run test:dev
```

Environment values live in `config/.env.dev` and `config/.env.staging`, selected
by the `ENV` variable and loaded through `config/env.ts`. `config/.env.example`
documents every required key. The committed values are the **public demo
credentials published by the sites under test** — real secrets belong in a
`config/.env.*.local` file, which is gitignored.

## Commands

| Task                  | Command                             |
| --------------------- | ----------------------------------- |
| Install               | `npm ci && npx playwright install`  |
| Run all tests (dev)   | `npm run test:dev`                  |
| Run against staging   | `npm run test:staging`              |
| Smoke tests only      | `npm run test:smoke`                |
| Regression tests only | `npm run test:regression`           |
| Run headed            | `npm run test:headed`               |
| Open UI mode          | `npm run test:ui`                   |
| Step through a test   | `npm run test:debug`                |
| Single browser        | `npm run test:chromium`             |
| Single site           | `npx playwright test tests/demoqa`  |
| Open last HTML report | `npm run report`                    |
| Open a trace          | `npm run trace <path-to-trace.zip>` |
| Typecheck             | `npm run typecheck`                 |
| Lint / format         | `npm run lint` · `npm run format`   |

## Layout

```
config/          env loading, storage-state paths, .env files
src/pages/       page objects, one per site, extending BasePage
src/fixtures/    custom test fixtures (page objects + ad blocking)
src/data/        faker-backed test data builders
tests/           specs, plus auth.setup.ts
```

## Practices applied

**Locators** — user-facing only: `getByRole`, `getByLabel`, `getByPlaceholder`,
`getByTestId`. `testIdAttribute` is set to `data-test` to match Sauce Demo's
markup. The two places a raw selector survives are commented with why (no ARIA
role and no test id exists on the target).

**Fixtures** — page objects are injected via `test.extend`, so no spec
instantiates them by hand. An auto-use fixture aborts ad and analytics requests,
which removes the biggest flake source on the ad-heavy sites.

**Auth reuse** — `tests/auth.setup.ts` runs as a `setup` project dependency,
signs into Sauce Demo once, and caches the session to `playwright/.auth/`.
Specs opt in with `test.use({ storageState })`; the login specs deliberately
opt out so they exercise the real form.

**Assertions** — web-first and auto-retrying throughout, including `toHaveURL`
on every navigation and `expect.soft` where several fields are checked at once.
No hard waits anywhere in the suite.

**Test data** — generated per-run with faker. Nothing derives uniqueness from
`Date.now()`, which collides across parallel workers and browser projects.

**Reporting** — `test.step` breaks the checkout flow into named phases in the
HTML report and trace viewer. Traces on first retry, screenshots and video on
failure.

**Accessibility** — `@axe-core/playwright` scans the inventory page against
WCAG 2.1 A/AA. Known third-party violations are listed in an explicit,
documented baseline, so the test fails on new regressions rather than sitting
permanently red.

**Tags** — `@smoke`, `@regression`, `@a11y`, `@flaky-site`, filterable with
`--grep`.

**CI** — GitHub Actions runs typecheck, lint, and format checks, then the suite
across three shards, merging blob reports into a single HTML artifact.

## Dependencies

| Tool       | Version |
| ---------- | ------- |
| Node       | 20+     |
| Playwright | ^1.62.1 |
| TypeScript | ^5.9.3  |

## Sources

**Playwright**

- https://playwright.dev/docs/best-practices
- https://testautomationu.applitools.com/playwright-intro/
- https://automationstepbystep.com
