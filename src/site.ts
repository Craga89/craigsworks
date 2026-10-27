// Facts about the site that several pages and build steps share.

export const SITE = 'https://craigsworks.com';
export const NAME = 'craigsworks';
export const OWNER = 'Craig Thompson';
/** Where enquiries go. Swap for a craigsworks.com address once one is set up. */
export const EMAIL = 'craga89@gmail.com';
export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('craigsworks: free 30-minute call')}`;
export const PERSONAL_SITE = 'https://craigthompson.dev';
export const LINKEDIN = 'https://www.linkedin.com/in/craigmichaelthompson/';
export const SOURCE = 'https://github.com/Craga89/craigsworks';
export const LOCATION = 'Newcastle upon Tyne';

/**
 * A path inside the site, under the base it's served from: '/' on craigsworks.com, '/craigsworks/'
 * on GitHub Pages before the custom domain is set (see astro.config.mjs).
 */
export const url = (path = '') => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path.replace(/^\//, '');

/** Browser chrome colour (the page background). */
export const CHROME = '#F6EFE4';

/** Search engines stay out until the content is finished (ALLOW_INDEXING=true opens it up). */
export const INDEXING = import.meta.env.ALLOW_INDEXING === 'true';

/** On a staging build (staging/<branch>/), the branch it previews; empty on the live site. */
export const STAGING = import.meta.env.STAGING_BRANCH ?? '';

export const HOME_TITLE = "craigsworks · Ship faster and calmer, with help from someone who's done it";
export const HOME_DESC =
  'Engineering consultancy for startups and SMEs: release acceleration, AI-assisted development and technical health checks, from a hands-on Head of Engineering in Newcastle upon Tyne.';
