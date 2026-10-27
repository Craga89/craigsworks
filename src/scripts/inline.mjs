// What has to be inline in every page's HTML. A plain string, so astro.config.mjs can put its hash
// in the Content-Security-Policy (Astro hashes the scripts and styles it bundles, not inline ones).

/**
 * Before anything paints: mark that scripts run (a `js` class, for styles that depend on them),
 * apply a saved "pause animations" choice, and set the theme: the visitor's saved choice, or else
 * their system's (scripts/theme.ts switches it).
 */
export const BOOT = `(function(){var d=document.documentElement,t;d.classList.add('js');try{if(localStorage.getItem('motion')==='off')d.dataset.motion='off';t=localStorage.getItem('theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';d.dataset.theme=t})()`;

export const INLINE_SCRIPTS = [BOOT];
