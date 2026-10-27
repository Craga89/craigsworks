// Light and dark: the visitor's choice, saved, or else their system's. The boot script in the head
// (inline.mjs) sets it before the page paints; this switches it, and keeps following the system
// until the visitor picks one.

const root = document.documentElement;
type Theme = 'light' | 'dark';
/** The theme the page is in now. (Exported, which also makes this a module with its own names.) */
export const current = (): Theme => (root.dataset.theme === 'dark' ? 'dark' : 'light');

function saved(): string | null {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null; // storage can be unavailable (private windows, blocked site data)
  }
}

function sync() {
  const dark = current() === 'dark';
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
    button.setAttribute('aria-pressed', String(dark));
  }
  // The browser's own bar follows the page, whichever theme it's in.
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.content = (dark ? meta.dataset.dark : meta.dataset.light) ?? meta.content;
  }
}

function set(theme: Theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // The switch still works for this page.
  }
  sync();
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  button.hidden = false;
  button.addEventListener('click', () => set(current() === 'dark' ? 'light' : 'dark'));
}
sync();

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (saved()) return;
  root.dataset.theme = e.matches ? 'dark' : 'light';
  sync();
});
