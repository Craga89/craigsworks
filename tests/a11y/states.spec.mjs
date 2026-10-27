// axe across every page, and every page state that shows different content.
import { test, expect, settle } from './axe.mjs';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await settle(page);
  });

  test('the whole page', async ({ axe }) => {
    await axe('home');
  });

  test('every service tab', async ({ page, axe }) => {
    const tabs = page.locator('#services').getByRole('tab');
    const n = await tabs.count();
    expect(n).toBeGreaterThan(1);
    for (let i = 0; i < n; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveAttribute('aria-selected', 'true');
      await axe(`service tab ${i + 1}`, '#services');
    }
  });

  test('the qTip2 tooltip, open', async ({ page, axe }) => {
    await page.locator('.tip-btn').focus();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await axe('tooltip open', '#record');
  });

  test('with animations paused', async ({ page, axe }) => {
    await page.locator('[data-motion-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
    await axe('animations paused');
  });
});

// axe runs as a script in the page, so this state is checked by hand: nothing is lost or left
// half-working without scripts.
test.describe('without scripts', () => {
  test.use({ javaScriptEnabled: false });
  test('the home page shows every service, and no controls that need scripts', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('tabpanel')).toHaveCount(3);
    for (const panel of await page.getByRole('tabpanel').all()) await expect(panel).toBeVisible();
    await expect(page.getByRole('tablist'), 'tabs that could not switch').toBeHidden();
    await expect(page.locator('[data-motion-toggle]'), 'a pause switch that could not work').toBeHidden();
  });
});

test.describe('other pages', () => {
  test('privacy', async ({ page, axe }) => {
    await page.goto('privacy/');
    await settle(page);
    await axe('privacy');
  });

  test.describe('the 404 page', () => {
    test.use({ expectedErrors: [/status of 404/] });
    test('the 404 page', async ({ page, axe }) => {
      await page.goto('this-page-does-not-exist');
      await settle(page);
      await axe('404 page');
    });
  });
});
