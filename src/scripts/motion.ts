// "Pause animations" (WCAG 2.2.2): one switch that stops every moving thing, saved for next time.
// The saved choice is applied before the page paints by the inline BOOT script (inline.mjs).

const root = document.documentElement;
const off = () => root.dataset.motion === 'off';

function sync(button: HTMLButtonElement) {
  button.setAttribute('aria-pressed', String(off()));
}

function save(value: 'on' | 'off') {
  try {
    localStorage.setItem('motion', value);
  } catch {
    // Storage can be unavailable (private windows, blocked site data); the switch still works for this page.
  }
}

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-motion-toggle]')) {
  button.hidden = false;
  sync(button);
  button.addEventListener('click', () => {
    if (off()) delete root.dataset.motion;
    else root.dataset.motion = 'off';
    save(off() ? 'off' : 'on');
    sync(button);
  });
}

// A module, so its names stay its own.
export {};
