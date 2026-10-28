# Working on this repo

See `README.md` for how the site is built, tested and deployed, and `brand/README.md` for the logo, colours and type.

## Package manager

pnpm, pinned in `package.json` (`packageManager`). Use `pnpm install`, `pnpm <script>` and `pnpm exec <bin>`,
never npm or npx, and commit `pnpm-lock.yaml` with any dependency change.

## Commits and pull requests

Commit messages and pull request titles follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): summary in the imperative, lowercase, no full stop
```

- **Types:** `feat` (something new on the site), `fix` (a bug), `docs`, `style` (formatting only), `refactor`, `perf`,
  `test`, `build` (dependencies, Astro config, fonts), `ci` (workflows and actions), `chore` (anything else).
- **Scopes** (optional, but use one when it fits): `pages`, `home`, `services`, `brand`, `styles`, `a11y`, `e2e`,
  `preview`, `deploy`, `lighthouse`, `deps`.
- **Breaking changes:** add `!` after the type or scope (`feat(pages)!: …`) and a `BREAKING CHANGE:` footer that says
  what breaks.
- The body, when there is one, explains what changed and why, wrapped at about 100 characters.
- Pull request titles take the same form: a squash merge uses the title as the commit on `master`, and it's what the
  history and release notes show either way.

Examples:

```
feat(services): add a page per service
fix(a11y): keep focus visible behind the sticky header
ci(preview): publish a preview of every branch under preview/
build(deps): bump astro to 7.5.0
```
