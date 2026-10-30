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

test('"Book a call" reaches a contact section from every page', async ({ page }) => {
  for (const path of PATHS) {
    await page.goto(path);
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Book a call' }).click();
    await expect(page, path).toHaveURL(/#contact$/);
    await expect(page.locator('#contact'), path).toBeInViewport();
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
    await expect(
      page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Book a call' }),
    ).toHaveAttribute('href', /\/#contact$/);
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

test.describe('themes', () => {
  test('the switch changes the theme, and the choice is remembered', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('./');
    const html = page.locator('html');
    const toggle = page.getByRole('button', { name: 'Dark theme' });
    await expect(html).toHaveAttribute('data-theme', 'light');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);

    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe(lightBg);
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', '#17140F');

    await page.goto('about/');
    await expect(html, 'remembered on the next page').toHaveAttribute('data-theme', 'dark');
    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(html).toHaveAttribute('data-theme', 'light');
  });

  test('a choice sticks for the page even when it cannot be saved', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new Error('storage blocked');
        },
      });
    });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('./');
    await page.getByRole('button', { name: 'Dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html'), 'not overridden by the system').toHaveAttribute('data-theme', 'dark');
  });

  test('focus rings stay light on the terminals, which are dark on both themes', async ({ page }) => {
    for (const colorScheme of /** @type {const} */ (['light', 'dark'])) {
      await page.emulateMedia({ colorScheme });
      await page.goto('./');
      const replay = page.getByRole('button', { name: 'Replay the health check' });
      await replay.focus();
      expect(await replay.evaluate((el) => getComputedStyle(el).outlineColor), colorScheme).toBe('rgb(243, 235, 221)');
    }
  });

  test('with no choice made, the page follows the system', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});

test('the console says hello, once, with the overview and working links', async ({ page }) => {
  /** @type {string[]} */
  const logs = [];
  page.on('console', (m) => {
    if (m.type() === 'log') logs.push(m.text());
  });
  await page.goto('services/ai-adoption/');
  await expect.poll(() => logs.length).toBeGreaterThan(0);
  const hello = logs.filter((l) => l.includes('craigsworks'));
  expect(hello).toHaveLength(1);
  for (const text of ['$ whoami', 'Release acceleration', '$ cat track-record.txt', 'craigthompson.dev']) {
    expect(hello[0]).toContain(text);
  }
  // The site's own links are full addresses on wherever it's being served from.
  expect(hello[0]).toContain(new URL('work/', page.url().replace(/services\/ai-adoption\/$/, '')).href);
});

test.describe('the terminals', () => {
  test('type their run out, and Replay runs it again', async ({ page }) => {
    await page.goto('./');
    const hero = page.locator('.hero [data-term]');
    const lines = hero.locator('[data-term-line]');
    await expect(lines).toHaveCount(8);
    await expect(hero.locator('[data-term-line][data-pending]'), 'finished typing').toHaveCount(0, { timeout: 15_000 });
    await expect(lines.last()).toBeVisible();
    await page.getByRole('button', { name: 'Replay the health check' }).click();
    await expect(hero, 'typing again').toHaveClass(/typing/);
    await expect(hero.locator('[data-term-line][data-pending]')).toHaveCount(0, { timeout: 15_000 });
    await expect(hero).not.toHaveClass(/typing/);
  });

  test('show the whole run at once when animations are paused', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('motion', 'off'));
    await page.goto('./');
    await expect(page.locator('.hero [data-term]')).not.toHaveClass(/typing/);
    await expect(page.locator('[data-term-line][data-pending]')).toHaveCount(0);
    await expect(page.locator('[data-term-cmd]').first()).toHaveText('craigsworks health-check');
  });
});

test('the copy buttons copy the email address', async ({ page }) => {
  // A stand-in clipboard: headless browsers' real one depends on focus and permissions.
  await page.addInitScript(() => {
    /** @type {string[]} */
    const copied = [];
    Object.defineProperty(window, '__copied', { value: copied });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: async (/** @type {string} */ t) => copied.push(t) },
    });
  });
  await page.goto('./');
  const copy = page.locator('.hero').getByRole('button', { name: 'Copy the email address' });
  await copy.click();
  await expect(copy).toContainText('Copied');
  expect(await page.evaluate(() => /** @type {any} */ (window).__copied)).toEqual([
    expect.stringMatching(/^[^@\s]+@[^@\s]+$/),
  ]);
  await expect(page.getByRole('status')).toHaveText('Copied to the clipboard.');
});

test('the monorepo graph merges another change every few seconds, unless animations are paused', async ({ page }) => {
  await page.goto('./');
  const name = page.locator('[data-graph-name]');
  await expect(name).toHaveText('packages/reports');
  await expect(name).not.toHaveText('packages/reports', { timeout: 8_000 });
  await page.locator('[data-motion-toggle]').click();
  const now = await name.textContent();
  await page.waitForTimeout(3_000);
  await expect(name).toHaveText(now || '');
});
