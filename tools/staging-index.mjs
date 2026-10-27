// Staging previews, for the workflows (see tools/lib/staging.mjs).
//   node tools/staging-index.mjs slug <branch>          prints the staging/ folder name for a branch
//   node tools/staging-index.mjs index <dir> <repo-url>  removes stale folders, writes <dir>/staging/index.html
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { readPreviews, renderIndex, slug, stale } from './lib/staging.mjs';

const [cmd, a, b] = process.argv.slice(2);
if (cmd === 'slug' && a) {
  console.log(slug(a));
} else if (cmd === 'index' && a && b) {
  for (const name of stale(a)) {
    rmSync(join(a, 'staging', name), { recursive: true, force: true });
    console.log(`removed staging/${name}/ (an old folder name)`);
  }
  const previews = readPreviews(a);
  mkdirSync(join(a, 'staging'), { recursive: true });
  writeFileSync(join(a, 'staging', 'index.html'), renderIndex(previews, b));
  console.log(`staging/index.html lists ${previews.length} preview(s)`);
} else {
  console.error('usage: staging-index.mjs slug <branch> | index <dir> <repo-url>');
  process.exit(2);
}
