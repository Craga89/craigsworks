// Every page on the site, for the tests that check them all.
export const PAGES = [
  { path: './', h1: /Ship faster and calmer/ },
  { path: 'services/release-acceleration/', h1: /without a release day/ },
  { path: 'services/ai-adoption/', h1: /keep the quality/ },
  { path: 'services/health-check/', h1: /what to do next/ },
  { path: 'work/', h1: /Real work, written up plainly/ },
  { path: 'about/', h1: /Hi, I'm Craig/ },
  { path: 'privacy/', h1: /Privacy/ },
];
export const PATHS = PAGES.map((p) => p.path);
