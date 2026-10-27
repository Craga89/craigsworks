// Staging previews: folder names and the index page.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readPreviews, renderIndex, slug } from '../../../../tools/lib/staging.mjs';

describe('slug', () => {
  it('turns a branch name into a folder name', () => {
    assert.equal(slug('master'), 'master');
    assert.equal(slug('brand/craigsworks'), 'brand-craigsworks');
    assert.equal(slug('Feature/Some_Thing--Big!'), 'feature-some-thing-big');
    assert.equal(slug('/leading/and/trailing/'), 'leading-and-trailing');
  });

  it('keeps names short and never empty', () => {
    const long = slug('x'.repeat(59) + '/abc');
    assert.equal(long, 'x'.repeat(59));
    assert.ok(slug('a'.repeat(100)).length <= 60);
    assert.equal(slug('///'), 'branch');
    assert.equal(slug(''), 'branch');
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
