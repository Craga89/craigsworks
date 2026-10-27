// The site's pages, as a visitor uses them.
import { test, expect } from '../fixtures.mjs';
import { readFileSync } from 'node:fs';
import { PAGES, PATHS } from '../pages.mjs';

test('the home page says what it is and how to get in touch', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/craigsworks/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Ship faster and calmer');
  const cta = page.getByRole('link', { name: 'Book a free 30-minute call' });
  await expect(cta).toHaveAttribute('href', /^mailto:/);
  await expect(page.locator('#contact').getByRole('link', { name: /Book a free call/ })).toHaveAttribute(
    'href',
    /^mailto:/,
  );
});

test('every page has its heading, a way to get in touch, and the main links', async ({ page }) => {
  for (const { path, h1 } of PAGES) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 }), path).toHaveText(h1);
    await expect(page.getByRole('navigation', { name: 'Main' }).getByRole('link')).toHaveCount(4);
    if (path !== 'privacy/') {
      await expect(page.locator('#contact').getByRole('link', { name: /Book a free call/ }), path).toHaveAttribute(
        'href',
        /^mailto:/,
      );
    }
  }
});

test('each service on the home page leads to its own page', async ({ page }) => {
  const services = [
    { link: 'How release acceleration works', h1: /without a release day/ },
    { link: 'How AI adoption works', h1: /keep the quality/ },
    { link: 'What the health check covers', h1: /what to do next/ },
  ];
  for (const s of services) {
    await page.goto('./');
    await page.locator('#services').getByRole('link', { name: s.link }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(s.h1);
    await expect(
      page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Services' }),
    ).toHaveAttribute('aria-current', 'page');
  }
});

test('the main links go to their pages, and Services to the list on the home page', async ({ page }) => {
  await page.goto('about/');
  const nav = page.getByRole('navigation', { name: 'Main' });
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  await nav.getByRole('link', { name: 'Case notes' }).click();
  await expect(page).toHaveURL(/\/work\/$/);
  await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Services' }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.locator('#services')).toBeInViewport();
});

test('a service page links back to the services, and to its case notes', async ({ page }) => {
  await page.goto('services/release-acceleration/');
  const related = page.locator('#related');
  await expect(related.getByRole('article')).toHaveCount(3);
  for (const link of await related.getByRole('link', { name: /full case study/i }).all()) {
    await expect(link).toHaveAttribute(
      'href',
      /^https:\/\/craigthompson\.dev\/(case-studies|responsibilities)\/[a-z-]+\/$/,
    );
  }
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'services' }).click();
  await expect(page).toHaveURL(/#services$/);
});

test('the case notes: every one links to its full write-up, and the areas jump to their groups', async ({ page }) => {
  await page.goto('work/');
  const notes = page.getByRole('article');
  expect(await notes.count()).toBeGreaterThanOrEqual(12);
  for (const link of await page.getByRole('link', { name: /full case study/i }).all()) {
    await expect(link).toHaveAttribute('href', /^https:\/\/craigthompson\.dev\//);
  }
  await page.getByRole('navigation', { name: 'Case note areas' }).getByRole('link', { name: 'AI' }).click();
  await expect(page).toHaveURL(/#ai$/);
  await expect(page.locator('#ai-title')).toBeInViewport();
});

test('questions open and close', async ({ page }) => {
  await page.goto('./');
  const faq = page.locator('#faq');
  const second = faq.locator('details').nth(1);
  await expect(second).not.toHaveAttribute('open');
  await second.locator('summary').click();
  await expect(second).toHaveAttribute('open');
  await expect(second.locator('p')).toBeVisible();
});

test('the skip link moves to the content', { tag: '@desktop' }, async ({ page }) => {
  await page.goto('./');
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
  for (const path of PATHS) {
    await page.goto(path);
    await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveCount(1);
    expect(await page.locator('[style]').count(), `inline style attributes on /${path}`).toBe(0);
  }
});

// GitHub Pages serves the site under /craigsworks/ until the custom domain is set: nothing may
// point at the domain root, or the styles, fonts and scripts 404 there.
test('every link and asset stays inside the site, wherever it is served from', async ({ page, baseURL }) => {
  const base = new URL(baseURL || 'http://127.0.0.1/');
  for (const path of PATHS) {
    await page.goto(path);
    const refs = await page
      .locator('[href], [src]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href') || el.getAttribute('src') || ''));
    const outside = refs.filter((ref) => {
      const to = new URL(ref, page.url());
      return to.origin === base.origin && !to.pathname.startsWith(base.pathname);
    });
    expect(outside, `links and assets outside ${base.pathname} on ${path}`).toEqual([]);
  }
});

test('every internal link leads to a page that exists', async ({ page, request, baseURL }) => {
  const base = new URL(baseURL || 'http://127.0.0.1/');
  /** @type {Set<string>} */
  const seen = new Set();
  for (const path of PATHS) {
    await page.goto(path);
    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((els) => els.map((el) => /** @type {HTMLAnchorElement} */ (el).href));
    for (const href of hrefs) {
      const to = new URL(href);
      if (to.origin !== base.origin) continue;
      to.hash = '';
      seen.add(to.href);
    }
  }
  for (const href of seen) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});
