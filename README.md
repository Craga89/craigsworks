# craigsworks.com

The website of craigsworks, Craig Thompson's engineering consultancy, served by Cloudflare at <https://craigsworks.craga89.workers.dev/> until <https://craigsworks.com> moves to it. Craig's personal site and CV are at <https://craigthompson.dev> ([Craga89/portfolio](https://github.com/Craga89/portfolio)), and this repo follows the same setup.

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

- **Lint and format:** [oxlint](https://oxc.rs/docs/guide/usage/linter) (`.oxlintrc.json`) and [oxfmt](https://oxc.rs/docs/guide/usage/formatter) (`oxfmt.config.ts`), both extending the shared presets in [`@craga89/standards`](https://github.com/Craga89/standards), a pnpm config dependency (`pnpm-workspace.yaml`) installed into `node_modules/.pnpm-config/`; `tsconfig.node.json` extends its TypeScript base. `pnpm format` rewrites files; `pnpm add --config -E @craga89/standards@<version>`, then the integrity copied back from `pnpm-lock.yaml`, moves to a new release ([details](https://github.com/Craga89/standards/blob/main/guidelines/linting-and-formatting.md#setup)).
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
- on the default branch, once lint, unit, end-to-end and WCAG pass: **deploy** the build, with its commit stamped into the pages, to the `craigsworks` Cloudflare Worker (`cloudflare-deploy` from [Craga89/standards](https://github.com/Craga89/standards)), then check the live site serves it (`tools/cloudflare-check.sh`).

After each deploy, `.github/workflows/lighthouse.yml` runs Lighthouse (3 runs each, mobile and desktop) against the live site, saves a summary to the `lighthouse` branch, and fails if performance drops under 95, or accessibility or best practices under 100 (SEO under 100 too, once the site is open to search engines). `.github/workflows/accessibility.yml` runs the WCAG suite against the live site weekly, and `links.yml` checks for dead links weekly.

The actions and the preview and deploy workflows come from [Craga89/standards](https://github.com/Craga89/standards): report branches (`accessibility`, `lighthouse`) are written by its `publish-branch` and `report-meta`, and pnpm, Node and Chromium are set up by its `setup-node` and `setup-playwright` (cached). Actions, Craga89/standards included, are pinned to commit SHAs, and Dependabot proposes updates weekly. `bootstrap.yml` writes `pnpm-lock.yaml`, fetches the fonts and applies the formatter (push a `bootstrap/…` branch, or run it by hand to upgrade everything).

### Themes

The site has a light and a dark theme (`:root[data-theme='dark']` in `styles/base.css`). A first visit follows the system setting; the switch in the header saves a choice, which the inline boot script applies before the page paints, so there's no flash of the other theme. Without scripts the system setting still applies, through `prefers-color-scheme`. Colours that should flip go through tokens (`--solid` for solid buttons and the tooltip, `--crate-*` for the logo's crate), and both themes are held to WCAG 2.2 AA by the axe runs.

### Hosting

The site is a Cloudflare Worker with no code, serving the build (Workers static assets; see Craga89/standards [guidelines/hosting.md](https://github.com/Craga89/standards/blob/main/guidelines/hosting.md)). `cloudflare/wrangler.jsonc` is its config: unknown paths get `404.html` with a 404, and `/path` redirects to `/path/`. `cloudflare/_headers` sets its response headers, copied into the build at deploy. The Content-Security-Policy stays in each page's `<meta>`, where Astro writes its hashes. Deploys need two repository secrets: `CLOUDFLARE_API_TOKEN` (an account API token with **Workers Scripts: Edit**) and `CLOUDFLARE_ACCOUNT_ID`. They only reach the `wrangler` steps, never a job that builds or tests a branch.

The site is served from the root, so the base path is always `/`. Links still go through `url()` in `src/site.ts`, and `SITE_BASE` (in `astro.config.mjs` and `playwright.config.mjs`) still builds and tests it under another path.

### Branch previews

Every push to a branch is built straight away, without waiting for the checks, and served as a Cloudflare Worker Preview of its own (`preview.yml`, calling Craga89/standards' `cloudflare-preview.yml`):

- the address is `https://<branch>-<hash>-craigsworks.craga89.workers.dev/`: the branch name lowercased, with `/` and other symbols as `-`, then six characters of a hash of the exact name, so branches that read alike never share a Preview;
- each Preview has a dark bar across the top saying which branch it is, linking to the live site;
- the commit gets a **Preview** status, linking to the Preview once it's up and checked (`tools/cloudflare-check.sh`), and the pull request gets one comment with the link;
- Previews are behind Cloudflare Access: only signed-in people can see them, and CI's check signs in with a service token (`CLOUDFLARE_ACCESS_CLIENT_ID`, `CLOUDFLARE_ACCESS_CLIENT_SECRET`);
- deleting the branch deletes its Preview. Previews are never indexed (`X-Robots-Tag: noindex`, and the `noindex` meta tag while `ALLOW_INDEXING` is off).

The branch is built in a job without the Cloudflare token. `wrangler` then uploads the built files from a checkout of `master`, so a branch's own code never sees the token. `master` (the live site), bootstrap, Dependabot and report branches don't get Previews.

### Going live

1. **The domain:** attach `craigsworks.com` to the Worker and redirect `www`, then list the domain in `cloudflare/wrangler.jsonc` (`routes`, `"workers_dev": false`) and point `LIVE` in `src/site.ts` at it. Follow the hosting guideline's "Moving the domain". `craigsworks.com` currently redirects to craigthompson.dev (Craga89/portfolio's `redirects/old-domains.json`), so that redirect goes too.
2. **Search engines:** the site sends `noindex` until the build's `ALLOW_INDEXING` (in `build.yml`) is `'true'`.

## Performance

- Fonts are self-hosted from `src/assets/fonts/` (fetched once from Google Fonts by `tools/fetch-fonts.mjs`), variable, latin and latin-ext only, with size-matched system fallbacks so text doesn't move when they arrive. The body font is preloaded.
- Every page is static HTML with all its content; the one script is a small module. The questions are native `<details>`, so they work without it.
