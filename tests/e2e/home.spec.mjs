// The home page and the site's other pages, as a visitor uses them.
import { test, expect } from '../fixtures.mjs';
import { readFileSync } from 'node:fs';

test('the home page says what it is and how to get in touch', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Craig's Works/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ship faster.');
  const cta = page.getByRole('link', { name: 'Book a free 30-minute call' });
  await expect(cta).toHaveAttribute('href', /^mailto:/);
  await expect(page.locator('#contact').getByRole('link', { name: /Book a free call/ })).toHaveAttribute(
    'href',
    /^mailto:/,
  );
});

test('the service tabs switch panels', async ({ page }) => {
  await page.goto('/');
  const services = page.locator('#services');
  await expect(services.getByRole('tabpanel')).toHaveCount(1);
  await expect(services.getByRole('tabpanel')).toContainText('Release Acceleration');
  await services.getByRole('tab', { name: 'AI adoption' }).click();
  await expect(services.getByRole('tabpanel')).toContainText('AI Development Adoption');
  await services.getByRole('tab', { name: 'Health check' }).click();
  await expect(services.getByRole('tabpanel')).toContainText('Technical Health Check');
});

test('the main links jump to their sections', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'How it works' }).click();
  await expect(page).toHaveURL(/#how$/);
  await expect(page.locator('#how')).toBeInViewport();
});

test('the skip link moves to the content', { tag: '@desktop' }, async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await skip.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('the privacy page', async ({ page }) => {
  await page.goto('privacy/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy');
  await expect(page.getByRole('link', { name: "Information Commissioner's Office" })).toBeVisible();
});

test.describe('missing pages', () => {
  test.use({ expectedErrors: [/status of 404/] });
  test('get the 404 page, with a way home', async ({ page }) => {
    const res = await page.goto('projects/qtip2/');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("That page isn't here.");
    await page.getByRole('link', { name: 'Go to the home page' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test('search engines are kept out until indexing is switched on', async ({ request }) => {
  const robots = await (await request.get('robots.txt')).text();
  const html = readFileSync('site/index.html', 'utf8');
  if (process.env.ALLOW_INDEXING === 'true') {
    expect(robots).toContain('Sitemap:');
    expect(html).not.toContain('noindex');
  } else {
    expect(robots).toContain('Disallow: /');
    expect(html).toContain('noindex');
  }
});

test('every page has a Content-Security-Policy and no inline styles', async ({ page }) => {
  for (const path of ['', 'privacy/']) {
    await page.goto(path);
    await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);
    expect(await page.locator('[style]').count(), `inline style attributes on /${path}`).toBe(0);
  }
});
