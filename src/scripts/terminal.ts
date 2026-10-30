// Terminals (components/ui/Terminal.astro) type themselves out when they come into view, and the
// Replay button runs them again. With reduced motion or animations paused they show the finished
// run, which is what's in the page without scripts too.
import { still } from './motion';

const TYPE_MS = 45;
const PAUSE_MS = 320;
const LINE_MS = 380;

for (const wrap of document.querySelectorAll<HTMLElement>('[data-term]')) {
  const cmd = wrap.querySelector<HTMLElement>('[data-term-cmd]');
  const replay = wrap.querySelector<HTMLButtonElement>('[data-term-replay]');
  const lines = [...wrap.querySelectorAll<HTMLElement>('[data-term-line]')];
  if (!cmd) continue;
  const full = cmd.textContent || '';
  let timer = 0;

  const finish = () => {
    clearTimeout(timer);
    cmd.textContent = full;
    for (const line of lines) delete line.dataset.pending;
    wrap.classList.remove('typing');
  };

  const run = () => {
    finish();
    if (still()) return;
    wrap.classList.add('typing');
    cmd.textContent = '';
    for (const line of lines) line.dataset.pending = '';
    let typed = 0;
    let shown = 0;
    const step = () => {
      if (still()) return finish();
      if (typed < full.length) {
        cmd.textContent = full.slice(0, ++typed);
        timer = window.setTimeout(step, typed === full.length ? PAUSE_MS : TYPE_MS);
      } else if (shown < lines.length) {
        delete lines[shown++].dataset.pending;
        timer = window.setTimeout(step, LINE_MS);
      } else {
        finish();
      }
    };
    step();
  };

  if (replay) {
    replay.hidden = false;
    replay.addEventListener('click', run);
  }
  if (still() || typeof IntersectionObserver !== 'function') continue;
  const seen = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      seen.disconnect();
      run();
    },
    { threshold: 0.4 },
  );
  seen.observe(wrap);
}
