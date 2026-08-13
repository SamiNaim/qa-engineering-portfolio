<div align="center">

# Web UI Automation

**End-to-end web UI test automation with Playwright and TypeScript.**

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
