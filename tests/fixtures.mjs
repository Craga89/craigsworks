// Shared Playwright fixtures for the end-to-end and accessibility tests.
//
// Every test gets a page that:
//   - never reaches the network beyond the site under test (anything else gets an empty 204);
//   - fails the test on any uncaught error or console error (bar `expectedErrors`).
import { test as base, expect } from '@playwright/test';

/**
 * @type {import('@playwright/test').TestType<
 *   import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions & { expectedErrors: RegExp[] },
 *   import('@playwright/test').PlaywrightWorkerArgs & import('@playwright/test').PlaywrightWorkerOptions
 * >}
 */
export const test = base.extend({
  expectedErrors: [[], { option: true }],

  context: async ({ context, baseURL }, use) => {
    const site = new URL(baseURL || 'http://127.0.0.1/').host;
    await context.route(
      (url) => url.host !== site,
      (route) => route.fulfill({ status: 204 }),
    );
    await use(context);
  },

  page: async ({ page, baseURL, expectedErrors }, use) => {
    const site = new URL(baseURL || 'http://127.0.0.1/').host;
    /** @type {string[]} */
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      // The browser logs every failed response; stubbed third-party requests aren't the site's.
      if (m.text().startsWith('Failed to load resource') && new URL(m.location().url || baseURL || '').host !== site)
        return;
      errors.push('console: ' + m.text());
    });
    await use(page);
    expect(
      errors.filter((e) => !expectedErrors.some((re) => re.test(e))),
      'errors on the page',
    ).toEqual([]);
  },
});

export { expect };

/**
 * Add a stylesheet to the page. A constructed one, since the site's Content-Security-Policy
 * (rightly) refuses inline <style> elements.
 * @param {import('@playwright/test').Page} page
 * @param {string} css
 */
export const addStyle = (page, css) =>
  page.evaluate((text) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(text);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }, css);

/**
 * Turn off animations, transitions and smooth scrolling, so states can be checked straight away.
 * @param {import('@playwright/test').Page} page
 */
export const settle = (page) =>
  addStyle(
    page,
    'html{scroll-behavior:auto!important}*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;transition-delay:0s!important}',
  );
