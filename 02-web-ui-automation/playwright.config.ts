import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
// Loads config/.env.<ENV> as a side effect. Imported here so env resolution
// happens explicitly at config load, not implicitly via a page-object import.
import { env } from './config/env';

const isCI = !!process.env.CI;

const reporters: ReporterDescription[] = [
  ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ['list'],
  ['junit', { outputFile: 'test-results/junit.xml' }],
];

if (isCI) {
  // Blob reports are what `merge-reports` consumes when CI shards the run;
  // the github reporter surfaces failures as inline PR annotations.
  reporters.push(['blob'], ['github']);
}

export default defineConfig({
  testDir: './tests',

  timeout: 30_000,
  expect: { timeout: 5_000 },
  globalTimeout: 30 * 60_000,

  fullyParallel: true,

  /* Fail the build on CI if a `test.only` was left in the source. */
  forbidOnly: isCI,

  /* Retries absorb third-party flake on CI; locally a failure should just fail. */
  retries: isCI ? 2 : 0,

  /* Scale with the runner rather than hardcoding a worker count. */
  workers: isCI ? '50%' : undefined,

  /* Stop a broken CI run early instead of burning the full matrix. */
  maxFailures: isCI ? 10 : undefined,

  reporter: reporters,

  use: {
    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    /* Sauce Demo annotates its markup with data-test. */
    testIdAttribute: 'data-test',

    /* Pin locale and timezone so date/currency rendering is deterministic. */
    locale: 'en-US',
    timezoneId: 'UTC',

    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  metadata: {
    environment: env.name,
  },

  projects: [
    /* Signs into Sauce Demo once and caches the session for the specs that
       opt in via `test.use({ storageState })`. */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['setup'] },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, dependencies: ['setup'] },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] }, dependencies: ['setup'] },
  ],

  /* No webServer: every target is a public site, not a locally hosted app. */
});
