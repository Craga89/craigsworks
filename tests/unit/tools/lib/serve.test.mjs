// The static server used for prerendering and the end-to-end tests.
import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serve } from '../../../../tools/lib/serve.mjs';

describe('serve', () => {
  const dir = mkdtempSync(join(tmpdir(), 'serve-'));
  /** @type {Awaited<ReturnType<typeof serve>>} */
  let server;
  before(async () => {
    mkdirSync(join(dir, 'cv'));
    writeFileSync(join(dir, 'index.html'), '<h1>home</h1>');
    writeFileSync(join(dir, 'cv', 'index.html'), '<h1>cv</h1>');
    writeFileSync(join(dir, '404.html'), '<h1>missing</h1>');
    writeFileSync(join(dir, 'app.js'), 'export {}');
    server = await serve(dir);
  });
  after(() => server.close());

  it('serves files with their types, and index.html for directories', async () => {
    const home = await fetch(server.url);
    assert.equal(home.status, 200);
    assert.match(home.headers.get('content-type') || '', /^text\/html/);
    assert.equal(await (await fetch(server.url + 'cv/')).text(), '<h1>cv</h1>');
    assert.equal(await (await fetch(server.url + 'cv')).text(), '<h1>cv</h1>');
    assert.match((await fetch(server.url + 'app.js')).headers.get('content-type') || '', /^text\/javascript/);
  });

  it("answers anything missing with the site's 404 page", async () => {
    const r = await fetch(server.url + 'nope');
    assert.equal(r.status, 404);
    assert.equal(await r.text(), '<h1>missing</h1>');
  });

  it('never serves files outside the directory', async () => {
    const r = await fetch(server.url + '..%2f..%2fetc%2fpasswd');
    assert.ok(r.status === 403 || r.status === 404, String(r.status));
  });

  it('refuses an address it cannot decode', async () => {
    const r = await fetch(server.url + '%E0%A4%A');
    assert.equal(r.status, 400);
  });
});

describe('serve, without a 404 page', () => {
  const dir = mkdtempSync(join(tmpdir(), 'serve-bare-'));
  /** @type {Awaited<ReturnType<typeof serve>>} */
  let server;
  before(async () => {
    writeFileSync(join(dir, 'index.html'), '<h1>home</h1>');
    server = await serve(dir);
  });
  after(() => server.close());

  it('answers anything missing with a plain not found', async () => {
    const r = await fetch(server.url + 'nope');
    assert.equal(r.status, 404);
    assert.equal(await r.text(), 'Not found');
  });
});

describe('serve, under a base path', () => {
  const dir = mkdtempSync(join(tmpdir(), 'serve-base-'));
  /** @type {Awaited<ReturnType<typeof serve>>} */
  let server;
  before(async () => {
    mkdirSync(join(dir, 'privacy'));
    writeFileSync(join(dir, 'index.html'), '<h1>home</h1>');
    writeFileSync(join(dir, 'privacy', 'index.html'), '<h1>privacy</h1>');
    writeFileSync(join(dir, '404.html'), '<h1>missing</h1>');
    server = await serve(dir, 0, 'craigsworks');
  });
  after(() => server.close());

  it('serves the site at the base path, like a GitHub Pages project site', async () => {
    assert.match(server.url, /\/craigsworks\/$/);
    assert.equal(await (await fetch(server.url)).text(), '<h1>home</h1>');
    assert.equal(await (await fetch(server.url.replace(/\/$/, ''))).text(), '<h1>home</h1>');
    assert.equal(await (await fetch(server.url + 'privacy/')).text(), '<h1>privacy</h1>');
  });

  it('serves nothing outside it', async () => {
    const root = new URL('/', server.url).href;
    const r = await fetch(root + 'privacy/');
    assert.equal(r.status, 404);
    assert.equal(await r.text(), '<h1>missing</h1>');
    assert.equal((await fetch(root)).status, 404);
  });
});
