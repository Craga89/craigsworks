// The site: static HTML from src/pages, written to site/ (what CI tests and deploys).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { createHash } from 'node:crypto';
import { INLINE_SCRIPTS } from './src/scripts/inline.mjs';

/** @param {string} s @returns {`sha256-${string}`} */
const sha256 = (s) => `sha256-${createHash('sha256').update(s).digest('base64')}`;

// Where the site is served from. GitHub Pages serves it at craga89.github.io/craigsworks/ until the
// custom domain is set, then at craigsworks.com/. build.yml reads both from the Pages settings.
const base = process.env.SITE_BASE || '/';
const origin = process.env.SITE_ORIGIN || 'https://craigsworks.com';

export default defineConfig({
  site: origin,
  base,
  outDir: './site',
  trailingSlash: 'always',
  build: { format: 'directory', assets: 'assets' },
  // Every page gets a Content-Security-Policy with hashes for its own scripts and styles.
  security: {
    csp: {
      directives: ["default-src 'self'", "img-src 'self' data:", "object-src 'none'", "base-uri 'self'"],
      scriptDirective: {
        resources: ["'self'"],
        hashes: INLINE_SCRIPTS.map(sha256),
      },
    },
  },
  compressHTML: true,
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
