// axe across every page, and every page state that shows different content.
import { test, expect, settle } from './axe.mjs';
import { PATHS } from '../pages.mjs';

test.describe('home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await settle(page);
  });

  test('the whole page', async ({ axe }) => {
    await axe('home');
  });

  test('every question open', async ({ page, axe }) => {
    for (const d of await page.locator('#faq details').all()) await d.evaluate((el) => el.setAttribute('open', ''));
    await axe('questions open', '#faq');
  });

  test('the qTip2 tooltip, open', async ({ page, axe }) => {
    await page.locator('.tip-btn').focus();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await axe('tooltip open', '#used-by');
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
  test('the home page works: questions still open, the terminals show their runs, and no controls that need scripts', async ({ page }) => {
    await page.goto('./');
    const second = page.locator('#faq details').nth(1);
    await second.locator('summary').click();
    await expect(second.locator('p')).toBeVisible();
    await expect(page.locator('[data-motion-toggle]'), 'a pause switch that could not work').toBeHidden();
    await expect(page.locator('[data-theme-toggle]'), 'a theme switch that could not work').toBeHidden();
    await expect(page.locator('#services').getByRole('link')).toHaveCount(3);
    await expect(page.locator('[data-term-line]:visible'), 'every line of both terminal runs').toHaveCount(14);
    await expect(page.locator('[data-term-replay]'), 'both terminals in the page').toHaveCount(2);
    for (const b of await page.locator('[data-term-replay], [data-copy]').all()) await expect(b).toBeHidden();
  });
});

// Every page again on the dark theme (here from the system setting, as a first visit would be).
test.describe('dark theme', () => {
  test.use({ colorScheme: 'dark' });
  for (const path of PATHS) {
    test(path, async ({ page, axe }) => {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
      await settle(page);
      await axe(`${path} (dark)`);
    });
  }
});

test.describe('other pages', () => {
  for (const path of PATHS.filter((p) => p !== './')) {
    test(path, async ({ page, axe }) => {
      await page.goto(path);
      await settle(page);
      await axe(path);
    });
  }

  test.describe('the 404 page', () => {
    test.use({ expectedErrors: [/status of 404/] });
    test('the 404 page', async ({ page, axe }) => {
      await page.goto('this-page-does-not-exist');
      await settle(page);
      await axe('404 page');
    });
  });
});
