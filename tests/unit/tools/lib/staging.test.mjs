// Staging previews: folder names and the index page.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readPreviews, renderIndex, slug, stale } from '../../../../tools/lib/staging.mjs';

describe('slug', () => {
  const tail = (/** @type {string} */ s) => s.slice(-7);
  const head = (/** @type {string} */ s) => s.slice(0, -7);

  it('reads like the branch name, with a short hash of it on the end', () => {
    assert.equal(head(slug('master')), 'master');
    assert.equal(head(slug('brand/craigsworks')), 'brand-craigsworks');
    assert.equal(head(slug('Feature/Some_Thing--Big!')), 'feature-some-thing-big');
    assert.equal(head(slug('/leading/and/trailing/')), 'leading-and-trailing');
    assert.match(tail(slug('master')), /^-[0-9a-f]{6}$/);
    assert.equal(slug('brand/craigsworks'), slug('brand/craigsworks'), 'the same every time');
  });

  it('gives branches that read the same their own folders', () => {
    const names = ['feature/foo', 'feature-foo', 'Feature/Foo', 'feature_foo'];
    assert.equal(new Set(names.map((n) => head(slug(n)))).size, 1, 'they read the same');
    assert.equal(new Set(names.map(slug)).size, names.length, 'but never share a folder');
    const long = 'x'.repeat(80);
    assert.notEqual(slug(long + '/a'), slug(long + '/b'));
  });

  it('keeps names short and never empty', () => {
    assert.equal(head(slug('x'.repeat(49) + '/abc')), 'x'.repeat(49));
    assert.ok(slug('a'.repeat(100)).length <= 57);
    assert.equal(head(slug('///')), 'branch');
    assert.equal(head(slug('')), 'branch');
  });
});

describe('readPreviews', () => {
  it('lists folders with a _staging.json, newest first', () => {
    const dir = mkdtempSync(join(tmpdir(), 'staging-'));
    const add = (/** @type {string} */ name, /** @type {string | null} */ meta) => {
      mkdirSync(join(dir, 'staging', name), { recursive: true });
      if (meta !== null) writeFileSync(join(dir, 'staging', name, '_staging.json'), meta);
    };
    add('old', JSON.stringify({ branch: 'old', sha: 'a'.repeat(40), at: '2026-10-01T10:00:00Z' }));
    add('new', JSON.stringify({ branch: 'feat/new', sha: 'b'.repeat(40), at: '2026-10-27T10:00:00Z', message: 'Hi' }));
    add('no-time', JSON.stringify({ branch: 'x', sha: 'c'.repeat(40) }));
    add('broken', '{nope');
    add('not-a-preview', JSON.stringify({ hello: 1 }));
    add('empty', null);
    writeFileSync(join(dir, 'staging', 'index.html'), '');

    const previews = readPreviews(dir);
    assert.deepEqual(
      previews.map((p) => p.slug),
      ['new', 'old', 'no-time'],
    );
    assert.equal(previews[0].branch, 'feat/new');
    assert.equal(previews[0].message, 'Hi');
    assert.equal(previews[2].at, '');
  });

  it('finds folders that are not named for their branch', () => {
    const dir = mkdtempSync(join(tmpdir(), 'staging-'));
    const add = (/** @type {string} */ name, /** @type {string} */ branch) => {
      mkdirSync(join(dir, 'staging', name), { recursive: true });
      writeFileSync(join(dir, 'staging', name, '_staging.json'), JSON.stringify({ branch, sha: 'a', at: '' }));
    };
    add(slug('feature/new'), 'feature/new');
    add('feature-old', 'feature/old');
    assert.deepEqual(stale(dir), ['feature-old']);
  });

  it('is empty when there is no staging folder', () => {
    assert.deepEqual(readPreviews(mkdtempSync(join(tmpdir(), 'staging-'))), []);
  });
});

describe('renderIndex', () => {
  const repo = 'https://github.com/Craga89/craigsworks';

  it('links each preview, its commit and the live site, and stays out of search engines', () => {
    const html = renderIndex(
      [
        {
          slug: 'brand-x',
          branch: 'brand/x',
          sha: '0123456789abcdef',
          at: '2026-10-27T12:34:56.789Z',
          message: 'Rebrand',
        },
      ],
      repo,
    );
    assert.match(html, /<a class="name" href="\.\/brand-x\/">brand\/x<\/a>/);
    assert.match(
      html,
      /href="https:\/\/github.com\/Craga89\/craigsworks\/commit\/0123456789abcdef"><code>0123456<\/code>/,
    );
    assert.match(html, /<time datetime="2026-10-27T12:34:56.789Z">2026-10-27 12:34:56 UTC<\/time>/);
    assert.match(html, /<span class="msg">Rebrand<\/span>/);
    assert.match(html, /href="\.\.\/">The live site/);
    assert.match(html, /<meta name="robots" content="noindex/);
  });

  it('escapes what comes from git', () => {
    const html = renderIndex([{ slug: 's', branch: '<b>"x"</b>', sha: 'abc', at: '', message: "it's & <i>" }], repo);
    assert.match(html, /&lt;b&gt;&quot;x&quot;&lt;\/b&gt;/);
    assert.match(html, /it&#39;s &amp; &lt;i&gt;/);
    assert.doesNotMatch(html, /<time/);
  });

  it('says when there is nothing to preview', () => {
    assert.match(renderIndex([], repo), /No previews yet/);
  });
});
