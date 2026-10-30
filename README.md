# craigsworks.com

The website of craigsworks, Craig Thompson's engineering consultancy, served by GitHub Pages at <https://craigsworks.com>. Craig's personal site and CV are at <https://craigthompson.dev> ([Craga89/portfolio](https://github.com/Craga89/portfolio)), and this repo follows the same setup.

## Layout

- `src/` is an [Astro](https://astro.build) site, built to static HTML:
  - `pages/`: the home page, a page per service (`services/`), the case notes (`work`), `about`, the privacy notice, the 404 page and `robots.txt`.
  - `components/`: the header, footer, logo and the contact section every page ends with; `home/`, the home page's sections; `services/`, pieces the service pages share; and `ui/`, the building blocks (section headings, flows, steps, questions, case note cards, the inner-page intro).
  - `data/`: the words. `home.ts` (problems, outcomes, track record, questions), `services.ts` (each service's page, the health check's areas, how an engagement runs), `notes.ts` (the case notes, each linking to its full case study on craigthompson.dev) and `about.ts`. `site.ts`: facts several pages share (the email address, links, titles).
  - Everything on the site comes from real work; the full detail is on craigthompson.dev. The two "illustrative" examples (a health check plan, an AI-rated pull request) are labelled as such.
  - `layouts/Base.astro` (the document: meta, structured data, fonts), `scripts/` (one module per behaviour: the tooltip, "pause animations", the light and dark themes, and the hello in the browser console; `inline.mjs` is the one inline script, hashed into the CSP) and `styles/` (tokens, base styles and motion in `base.css`, the shared building blocks in `blocks.css`; each component has its own scoped styles).
  - There are no inline styles: every page has a Content-Security-Policy without `unsafe-inline`.
- `brand/` is the logo kit: outlined SVG and PNG logos, favicons, the colours and how to use them (see `brand/README.md`). The header's wordmark and `public/` favicons are copied from it.
- `tools/` holds the scripts CI runs (fonts, the Lighthouse summary); `tools/lib/serve.mjs` is the static server the tests use.
- `tests/`: `unit/` (Node's test runner), `e2e/` and `a11y/` (Playwright).
- `site/` is build output. CI builds it; it isn't committed.

## Development

Node 26 (see `.node-version`) and [pnpm](https://pnpm.io), the version pinned in `package.json`'s `packageManager` (`corepack enable` picks it up). Dependencies' install scripts only run if `pnpm-workspace.yaml` allows them (`allowBuilds`; none needs one today).

```sh
pnpm install
pnpm exec playwright install chromium
pnpm dev               # Astro's dev server, with live reload
pnpm build             # src/ → site/
pnpm serve             # site/ at http://127.0.0.1:4173/
pnpm verify            # lint, format check, type check and unit tests
pnpm test:e2e          # end-to-end tests on a desktop and a phone
pnpm test:a11y         # the WCAG 2.2 AA suite
```

- **Lint and format:** [oxlint](https://oxc.rs/docs/guide/usage/linter) (`.oxlintrc.json`) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) (`.oxfmtrc.json`); `pnpm format` rewrites files.
- **Types:** the page's scripts are TypeScript, and the tools and tests are JavaScript type-checked from their JSDoc: `tsconfig.json` (the site, strict, checked by `astro check`) and `tsconfig.node.json` (tools and tests).
- **Unit tests** (`tests/unit/`, mirroring the source tree) run with coverage and fail under 95% of lines, 80% of branches or 90% of functions in `tools/lib/`.
- **Playwright** (`playwright.config.mjs`) serves `site/` itself. Projects: `desktop` and `mobile` (a Pixel 7) for behaviour, where a test tagged `@desktop` or `@mobile` runs on that one only, and `a11y-desktop` and `a11y-mobile`. Shared fixtures (`tests/fixtures.mjs`) keep every test off the network and fail a test on any page error. Set `BASE_URL` to test a deployed site.

## Accessibility

The site targets WCAG 2.2 AA, and `tests/a11y/` checks it on every change:

- **axe** (every WCAG 2.0–2.2 A and AA rule) on every page and state: all the questions open, the tooltip open, animations paused, scripts off, every other page including the 404, and every page again on the dark theme.
- **Keyboard:** a full lap with Tab on every page, where every stop must show a visible focus indicator and not be hidden (2.1.1, 2.4.3, 2.4.7, 2.4.11).
- **Reflow and text spacing** at 320px (1.4.10, 1.4.12).
- **Motion:** with reduced motion nothing loops; otherwise "Pause animations" in the footer stops every loop and is remembered (2.2.2, 2.3.3). The qTip2 tooltip shows on hover and focus, stays while hovered and Escape dismisses it (1.4.13).

## CI and deploys

`.github/workflows/ci.yml` runs on every push to the default branch and every pull request:

- **lint** (oxlint, oxfmt) and **build** (`build.yml`, reusable, uploads `site/` as the `build` artifact), side by side;
- on that build: **types and unit tests**, **end-to-end** tests on each project, and the **WCAG suite** in two shards, merged into one report (saved to the `accessibility` branch from the default branch);
- on the default branch, once lint, unit, end-to-end and WCAG pass: **publish** the build as the live site (the root of the `pages` branch, with the commit stamped into the pages) and **deploy** that branch to GitHub Pages (`pages-deploy.yml` from [Craga89/standards](https://github.com/Craga89/standards)).

After each deploy, `.github/workflows/lighthouse.yml` runs Lighthouse (3 runs each, mobile and desktop) against the live site, saves a summary to the `lighthouse` branch, and fails if performance drops under 95, or accessibility or best practices under 100 (SEO under 100 too, once the site is open to search engines). `.github/workflows/accessibility.yml` runs the WCAG suite against the live site weekly, and `links.yml` checks for dead links weekly.

The actions and the preview and deploy workflows come from [Craga89/standards](https://github.com/Craga89/standards): report branches (`accessibility`, `lighthouse`) are written by its `publish-branch` and `report-meta`, and pnpm, Node and Chromium are set up by its `setup-node` and `setup-playwright` (cached). Actions, Craga89/standards included, are pinned to commit SHAs, and Dependabot proposes updates weekly. `bootstrap.yml` writes `pnpm-lock.yaml`, fetches the fonts and applies the formatter (push a `bootstrap/…` branch, or run it by hand to upgrade everything).

### Themes

The site has a light and a dark theme (`:root[data-theme='dark']` in `styles/base.css`). A first visit follows the system setting; the switch in the header saves a choice, which the inline boot script applies before the page paints, so there's no flash of the other theme. Without scripts the system setting still applies, through `prefers-color-scheme`. Colours that should flip go through tokens (`--solid` for solid buttons and the tooltip, `--crate-*` for the logo's crate), and both themes are held to WCAG 2.2 AA by the axe runs.

### Branch previews

Every push to a branch is built straight away and published under `preview/<branch>-<hash>/` (the branch name lowercased, with `/` and other symbols as `-`, then six characters of a hash of the exact name, so branches that read alike never share a folder), without waiting for the checks, so a change can be looked at within a couple of minutes:

- <https://craga89.github.io/craigsworks/preview/> (or `https://craigsworks.com/preview/` once the domain is live) lists every preview, newest first, with its commit;
- each preview has a dark bar across the top saying which branch it is, linking back to the list and to the live site;
- the commit gets a **Preview** status in the pull request's checks (pending while it builds, then the address in its description and behind its **Details** link once it's live), and the pull request gets one comment with the link (posted once, by `preview.yml`, or by `preview-comment.yml` when the pull request is opened after the branch was pushed; the address never changes, so it isn't posted again);
- deleting the branch removes its preview. Previews are never indexed (`noindex`, and `robots.txt` disallows `/preview/` once the site is open to search engines).

How: GitHub Pages serves one artifact per site, so everything it serves lives on the `pages` branch, the live site at the root and the previews under `preview/` (one commit, no history; don't edit it by hand). `preview.yml` builds a branch for its folder and stores it there (Craga89/standards' `preview.yml` and `pages-store`, which also prune previews whose branch is gone); `preview-deploy.yml`, started when that finishes, deploys the branch (it runs from the default branch, the only one the `github-pages` environment lets deploy). CI stores the live site at the root the same way, but only after every check passes. Deploys queue one at a time and each publishes whatever the `pages` branch holds by then, so a waiting deploy can be replaced by a newer one; if that happens to CI's, its run shows the deploy as cancelled although the newer deploy published the live site too. Lighthouse runs after either workflow and audits whenever the live site's commit has changed since its last audit, so the live site is audited either way. A run cancelled by a newer push or a deleted branch stores nothing. `master` (the live site), bootstrap, Dependabot and report branches don't get previews.

### Where it's served from

Until the custom domain is set, GitHub Pages serves the site under a path: <https://craga89.github.io/craigsworks/>. `build.yml` reads where Pages serves from (`actions/configure-pages`) and builds for it (`SITE_BASE`, `SITE_ORIGIN` in `astro.config.mjs`), so links in pages go through `url()` in `src/site.ts`, never a bare `/`. The tests serve the build at that same path (`SITE_BASE` in `playwright.config.mjs`), and an end-to-end test fails if any link or asset points outside it. Once the custom domain is set, the next build moves to the root by itself.

### Going live

1. **Pages:** Settings → Pages → Source: **GitHub Actions**, custom domain `craigsworks.com`, enforce HTTPS.
2. **DNS:** point `craigsworks.com` at GitHub Pages (apex `A`/`AAAA` records and a `www` `CNAME` to `craga89.github.io`).
3. **Search engines:** the site sends `noindex` until the build's `ALLOW_INDEXING` (in `build.yml`) is `'true'`.

## Performance

- Fonts are self-hosted from `src/assets/fonts/` (fetched once from Google Fonts by `tools/fetch-fonts.mjs`), variable, latin and latin-ext only, with size-matched system fallbacks so text doesn't move when they arrive. The body font is preloaded.
- Every page is static HTML with all its content; the one script is a small module. The questions are native `<details>`, so they work without it.
