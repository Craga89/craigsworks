# Reviewing changes to this repo

For whoever reviews a pull request here, person or model. This is the public website of a
consultancy: what matters is that every page is true, works for everyone and loads anywhere it's
served from. Style is the formatter's and linter's job, not review's. See
[code-review.md](https://github.com/Craga89/standards/blob/main/guidelines/code-review.md).

## What failure looks like here

- **A link or asset that ignores the base path.** Cloudflare serves the site and its Previews from
  `/`, but the tests can build it under another path (`SITE_BASE`), where a hard-coded `/…`
  breaks. Every internal URL goes through `url()` in `site.ts`.
- **Breaking the Content-Security-Policy.** There's no `unsafe-inline`: an inline `style=` or
  `<script>`, or a new third-party origin, is blocked in production. The one inline script is
  `scripts/inline.mjs`, hashed into the CSP.
- **Something on the site that isn't true.** Every claim comes from real work; examples that
  aren't are labelled "illustrative". A fact several pages show (the email address, links,
  titles) comes from `site.ts`, not a copy.
- **An accessibility regression** (WCAG 2.2 AA): focus hidden behind the sticky header, contrast
  that fails in one of the themes, motion that ignores "pause animations" or
  `prefers-reduced-motion`, a control with no accessible name.
- **A preview open to search engines.** Previews build with `ALLOW_INDEXING=false` and robots
  disallows `/preview/`; anything that changes `robots.txt`, the meta robots tag or the sitemap
  keeps that.
- **A test that passes for the wrong reason**: one that reaches the network (the fixtures keep
  tests off it), is skipped, or is loosened to pass. Coverage thresholds don't come down.
- **Brand drift.** Colours, logos and type come from `brand/` and the tokens in
  `styles/base.css`, not new hex values.

## Skip

- `pnpm-lock.yaml` (review the `package.json` change instead)
- `site/`, `test-results/` and other build output
- The PNG and favicon exports in `brand/` and `public/` (review the SVG they're made from)

## How to report

- Every finding has `file:line` and the evidence: the page and viewport where it breaks, the
  check that fails. No evidence, no finding.
- Tag each one **Important** (fix before merging), **Nit** (at most three in a review) or
  **Pre-existing** (true, but not this change's doing).
- One comment for a class of bug, listing every place it occurs.
- After the first round, review only what changed since, and don't repeat a finding that's been
  answered.
- Start the summary with the number of Important findings. When there are none, say "Nothing to
  fix."
