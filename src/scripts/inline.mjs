// What has to be inline in every page's HTML. A plain string, so astro.config.mjs can put its hash
// in the Content-Security-Policy (Astro hashes the scripts and styles it bundles, not inline ones).

/**
 * Before anything paints: mark that scripts run (so the service tabs can collapse to one panel
 * without the page jumping), and apply a saved "pause animations" choice.
 */
export const BOOT = `(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('motion')==='off')d.dataset.motion='off'}catch(e){}})()`;

export const INLINE_SCRIPTS = [BOOT];
