# craigsworks.com

The website of Craig's Works, Craig Thompson's engineering consultancy, served by GitHub Pages at <https://craigsworks.com>. Craig's personal site and CV are at <https://craigthompson.dev> ([Craga89/portfolio](https://github.com/Craga89/portfolio)), and this repo follows the same setup.

## Layout

- `src/` is an [Astro](https://astro.build) site, built to static HTML:
  - `pages/`: the home page, the privacy notice, the 404 page and `robots.txt`.
  - `components/`: the header, footer and logo, and `home/`, the home page's sections (hero, services, track record, how it works, contact).
  - `data/services.ts`: the words for the services, track record and process. `site.ts`: facts several pages share (the email address, links, titles).
  - `layouts/Base.astro` (the document: meta, structured data, fonts), `scripts/` (one module per behaviour: the service tabs, the tooltip, "pause animations"; `inline.mjs` is the one inline script, hashed into the CSP) and `styles/` (tokens, base styles and motion; each component has its own scoped styles).
  - There are no inline styles: every page has a Content-Security-Policy without `unsafe-inline`.
- `tools/` holds the scripts CI runs (fonts, the Lighthouse summary); `tools/lib/serve.mjs` is the static server the tests use.
- `tests/`: `unit/` (Node's test runner), `e2e/` and `a11y/` (Playwright).
- `site/` is build output. CI builds it; it isn't committed.

## Development

Node 22 (see `.node-version`).

```sh
npm ci
npx playwright install chromium
npm run dev            # Astro's dev server, with live reload
npm run build          # src/ → site/
npm run serve          # site/ at http://127.0.0.1:4173/
npm run verify         # lint, format check, type check and unit tests
npm run test:e2e       # end-to-end tests on a desktop and a phone
npm run test:a11y      # the WCAG 2.2 AA suite
```

- **Lint and format:** [oxlint](https://oxc.rs/docs/guide/usage/linter) (`.oxlintrc.json`) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) (`.oxfmtrc.json`); `npm run format` rewrites files.
- **Types:** the page's scripts are TypeScript, and the tools and tests are JavaScript type-checked from their JSDoc: `tsconfig.json` (the site, strict, checked by `astro check`) and `tsconfig.node.json` (tools and tests).
- **Unit tests** (`tests/unit/`, mirroring the source tree) run with coverage and fail under 95% of lines, 80% of branches or 90% of functions in `tools/lib/`.
- **Playwright** (`playwright.config.mjs`) serves `site/` itself. Projects: `desktop` and `mobile` (a Pixel 7) for behaviour, where a test tagged `@desktop` or `@mobile` runs on that one only, and `a11y-desktop` and `a11y-mobile`. Shared fixtures (`tests/fixtures.mjs`) keep every test off the network and fail a test on any page error. Set `BASE_URL` to test a deployed site.

## Accessibility

The site targets WCAG 2.2 AA, and `tests/a11y/` checks it on every change:

- **axe** (every WCAG 2.0–2.2 A and AA rule) on every page and state: each service tab, the tooltip open, animations paused, scripts off, the privacy and 404 pages.
- **Keyboard:** a full lap with Tab, where every stop must show a visible focus indicator and not be hidden (2.1.1, 2.4.3, 2.4.7, 2.4.11), and the service tabs follow the WAI-ARIA tabs pattern.
- **Reflow and text spacing** at 320px (1.4.10, 1.4.12).
- **Motion:** with reduced motion nothing loops; otherwise "Pause animations" in the footer stops every loop and is remembered (2.2.2, 2.3.3). The qTip2 tooltip shows on hover and focus, stays while hovered and Escape dismisses it (1.4.13).

## CI and deploys

`.github/workflows/ci.yml` runs on every push to the default branch and every pull request:

- **lint** (oxlint, oxfmt) and **build** (`build.yml`, reusable, uploads `site/` as the `build` artifact), side by side;
- on that build: **types and unit tests**, **end-to-end** tests on each project, and the **WCAG suite** in two shards, merged into one report (saved to the `accessibility` branch from the default branch);
- on the default branch, once lint, unit, end-to-end and WCAG pass: **deploy** to GitHub Pages, with the commit stamped into the pages.

After each deploy, `.github/workflows/lighthouse.yml` runs Lighthouse (3 runs each, mobile and desktop) against the live site, saves a summary to the `lighthouse` branch, and fails if performance drops under 95, or accessibility or best practices under 100 (SEO under 100 too, once the site is open to search engines). `.github/workflows/accessibility.yml` runs the WCAG suite against the live site weekly, and `links.yml` checks for dead links weekly.

Report branches (`accessibility`, `lighthouse`) are written by `.github/actions/publish-branch`. Node and Chromium are set up by `.github/actions/setup-node` and `.github/actions/setup-playwright` (cached). Actions are pinned to commit SHAs, and Dependabot proposes updates weekly. `bootstrap.yml` writes `package-lock.json`, fetches the fonts and applies the formatter (push a `bootstrap/…` branch, or run it by hand to upgrade everything).

### Where it's served from

Until the custom domain is set, GitHub Pages serves the site under a path: <https://craga89.github.io/craigsworks/>. `build.yml` reads where Pages serves from (`actions/configure-pages`) and builds for it (`SITE_BASE`, `SITE_ORIGIN` in `astro.config.mjs`), so links in pages go through `url()` in `src/site.ts`, never a bare `/`. The tests serve the build at that same path (`SITE_BASE` in `playwright.config.mjs`), and an end-to-end test fails if any link or asset points outside it. Once the custom domain is set, the next build moves to the root by itself.

### Going live

1. **Pages:** Settings → Pages → Source: **GitHub Actions**, custom domain `craigsworks.com`, enforce HTTPS.
2. **DNS:** point `craigsworks.com` at GitHub Pages (apex `A`/`AAAA` records and a `www` `CNAME` to `craga89.github.io`).
3. **Search engines:** the site sends `noindex` until the build's `ALLOW_INDEXING` (in `build.yml`) is `'true'`.

## Performance

- Fonts are self-hosted from `src/assets/fonts/` (fetched once from Google Fonts by `tools/fetch-fonts.mjs`), variable, latin and latin-ext only, with size-matched system fallbacks so text doesn't move when they arrive. The body font is preloaded.
- Every page is static HTML with all its content; the one script is a small module. The service tabs collapse before first paint (`html.js`), so the page doesn't shift when the script runs.
