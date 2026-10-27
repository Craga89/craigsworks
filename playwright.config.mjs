// End-to-end and accessibility tests for the built site (site/).
//   npx playwright test                       everything, against a local server for site/
//   npx playwright test --project=desktop     one project
//   BASE_URL=https://craigsworks.com/ npx playwright test --project=a11y-desktop
// Tests navigate relative to BASE_URL ('./', 'privacy/'), so the site can live under a path, as it
// does on GitHub Pages without a custom domain: SITE_BASE=/craigsworks/ serves site/ there.
import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;
const PORT = 4173;
const SITE_BASE = ('/' + (process.env.SITE_BASE || '/') + '/').replace(/\/+/g, '/');
const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${PORT}${SITE_BASE}`;

const desktop = { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } };
// Pixel 7 is a Chromium phone: 412×915 CSS px, touch, a mobile user agent.
const mobile = { ...devices['Pixel 7'] };

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 2 : 0,
  workers: CI ? 2 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: CI
    ? [
        ['github'],
        ['list'],
        ['html', { open: 'never' }],
        ['./tests/reporters/a11y-report.mjs', { outputFile: 'a11y.json' }],
      ]
    : [['list'], ['./tests/reporters/a11y-report.mjs', { outputFile: 'test-results/a11y.json' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'en-GB',
    timezoneId: 'Europe/London',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `node tools/lib/serve.mjs site ${PORT} ${SITE_BASE}`, url: BASE_URL, reuseExistingServer: !CI },
  projects: [
    // Behaviour on a desktop and a phone. Tests tagged @desktop or @mobile run on that one only.
    { name: 'desktop', testDir: 'tests/e2e', use: desktop, grepInvert: /@mobile/ },
    { name: 'mobile', testDir: 'tests/e2e', use: mobile, grepInvert: /@desktop/ },
    // WCAG 2.2 AA: axe across page states, plus keyboard, reflow, text spacing and motion.
    { name: 'a11y-desktop', testDir: 'tests/a11y', use: desktop, grepInvert: /@mobile/ },
    { name: 'a11y-mobile', testDir: 'tests/a11y', use: mobile, grepInvert: /@desktop/ },
  ],
});
