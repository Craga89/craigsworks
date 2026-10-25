// Downloads the Google Fonts the site uses as woff2 files into src/assets/fonts/, keeping the
// latin and latin-ext subsets. src/styles/fonts.css has the @font-face rules for them.
// Run by the bootstrap and fetch-fonts workflows (the fonts are committed, not fetched at build).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'assets', 'fonts');
// Variable fonts: one file per subset covers the whole weight range.
const CSS =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500..800&family=JetBrains+Mono:wght@400..700&display=swap';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

mkdirSync(OUT, { recursive: true });
const css = await (await fetch(CSS, { headers: { 'user-agent': UA } })).text();
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]*)}/g)].filter(
  (m) => m[1] === 'latin' || m[1] === 'latin-ext',
);
if (!blocks.length) throw new Error('no font-face blocks found:\n' + css.slice(0, 500));
/** The first group of `re` in `s`; throws if Google's CSS has changed shape. */
const must = (/** @type {string} */ s, /** @type {RegExp} */ re) => {
  const m = s.match(re);
  if (!m) throw new Error(`${re} not found in:\n${s}`);
  return m[1];
};
const files = new Map();
for (const [, subset, body] of blocks) {
  const fam = must(body, /font-family:\s*'([^']+)'/);
  const url = must(body, /url\(([^)]+)\)/);
  if (files.has(url)) continue;
  // e.g. plus-jakarta-sans-latin.woff2, the name src/styles/fonts.css and the layout expect.
  const name = `${fam.toLowerCase().replace(/\s+/g, '-')}-${subset}.woff2`;
  const buf = Buffer.from(await (await fetch(url, { headers: { 'user-agent': UA } })).arrayBuffer());
  writeFileSync(join(OUT, name), buf);
  files.set(url, name);
  console.log(name, buf.length);
}
const expected = ['plus-jakarta-sans', 'jetbrains-mono'].flatMap((f) => [`${f}-latin.woff2`, `${f}-latin-ext.woff2`]);
const missing = expected.filter((n) => ![...files.values()].includes(n));
if (missing.length) throw new Error('missing fonts: ' + missing.join(', '));
console.log('wrote', files.size, 'files');
