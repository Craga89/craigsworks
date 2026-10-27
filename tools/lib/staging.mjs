// Staging previews: every pushed branch is built into staging/<slug>/ on the Pages site, next to the
// live site. These helpers name the folders and write the staging/ index page that lists them.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * @typedef {object} Preview
 * @property {string} slug The folder under staging/
 * @property {string} branch
 * @property {string} sha The commit it was built from
 * @property {string} at When it was built (ISO 8601)
 * @property {string} [message] The commit message's first line
 */

/**
 * The folder name for a branch: a readable part (lowercase letters, digits and dashes, at most 50
 * characters) and six characters of a hash of the exact name, so branches that read the same
 * (`feature/foo` and `feature-foo`, `Foo` and `foo`, long names that share a start) never share a
 * folder, and one can't overwrite or delete the other's preview.
 */
export const slug = (/** @type {string} */ branch) => {
  const name = String(branch);
  const readable =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 50)
      .replace(/^-+|-+$/g, '') || 'branch';
  return `${readable}-${createHash('sha256').update(name).digest('hex').slice(0, 6)}`;
};

/** The previews in `dir`/staging/, newest first. Folders without a readable _staging.json are left out. */
export function readPreviews(/** @type {string} */ dir) {
  const root = join(dir, 'staging');
  if (!existsSync(root)) return [];
  /** @type {Preview[]} */
  const out = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    try {
      const meta = JSON.parse(readFileSync(join(root, entry.name, '_staging.json'), 'utf8'));
      if (typeof meta.branch !== 'string' || typeof meta.sha !== 'string') continue;
      out.push({
        slug: entry.name,
        branch: meta.branch,
        sha: meta.sha,
        at: String(meta.at ?? ''),
        message: meta.message,
      });
    } catch {
      continue; // not a preview (or a half-written one); it doesn't get listed
    }
  }
  return out.sort((a, b) => b.at.localeCompare(a.at) || a.slug.localeCompare(b.slug));
}

/** Folders in `dir`/staging/ whose name isn't (or is no longer) their branch's slug, such as ones named
 * before the hash was added. Their branch gets a fresh folder on its next push. */
export const stale = (/** @type {string} */ dir) =>
  readPreviews(dir)
    .filter((p) => p.slug !== slug(p.branch))
    .map((p) => p.slug);

const esc = (/** @type {unknown} */ s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => `&${{ '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": '#39' }[c]};`);

/**
 * The staging/ index page.
 * @param {Preview[]} previews
 * @param {string} repo The repository's web address, for links to commits
 */
export function renderIndex(previews, repo) {
  const rows = previews.map((p) => {
    const when = p.at
      ? `<time datetime="${esc(p.at)}">${esc(p.at.replace('T', ' ').replace(/(:\d\d)(\.\d+)?Z$/, '$1 UTC'))}</time>`
      : '';
    return `<li>
  <a class="name" href="./${esc(p.slug)}/">${esc(p.branch)}</a>
  <span class="meta"><a href="${esc(repo)}/commit/${esc(p.sha)}"><code>${esc(p.sha.slice(0, 7))}</code></a> ${when}</span>
  ${p.message ? `<span class="msg">${esc(p.message)}</span>` : ''}
</li>`;
  });
  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Staging previews · craigsworks</title>
<style>
  body { margin: 0; background: #f6efe4; color: #1e1a16; font: 1rem/1.5 system-ui, sans-serif; }
  main { max-width: 760px; margin: 0 auto; padding: 48px 24px; }
  h1 { margin: 0 0 4px; font-size: 1.75rem; letter-spacing: -0.02em; }
  p { margin: 0 0 24px; color: #685c4f; }
  ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 10px; }
  li { display: grid; gap: 2px; padding: 14px 18px; background: #fffdf9; border: 1px solid #e7dccb; border-radius: 14px; }
  a { color: #1e1a16; }
  .name { font-weight: 700; font-size: 1.0625rem; }
  .meta, .msg { font-size: 0.875rem; color: #685c4f; }
  .meta a { color: #8a5a22; }
  :focus-visible { outline: 3px solid #1e1a16; outline-offset: 3px; }
</style>
</head>
<body>
<main>
<h1>Staging previews</h1>
<p>Every pushed branch, built as soon as it's pushed (before the checks run). <a href="../">The live site</a>.</p>
${rows.length ? `<ul>\n${rows.join('\n')}\n</ul>` : '<p>No previews yet.</p>'}
</main>
</body>
</html>
`;
}
