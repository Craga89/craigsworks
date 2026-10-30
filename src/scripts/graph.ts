// The monorepo graph on the home page: every few seconds another (illustrative) change is merged,
// lighting the package it touched and the ones that depend on it. Stays on the first change with
// reduced motion or animations paused. Markup: components/home/Monorepo.astro.
import { GRAPH } from '../data/home';
import { still } from './motion';

const graph = document.querySelector<HTMLElement>('[data-graph]');
if (graph) {
  const cells = [...graph.querySelectorAll<HTMLElement>('[data-pkg]')];
  const name = graph.querySelector<HTMLElement>('[data-graph-name]');
  const built = graph.querySelector<HTMLElement>('[data-graph-built]');
  let at = 0;

  const show = (i: number) => {
    const change = GRAPH.changes[i];
    cells.forEach((cell, n) => {
      cell.dataset.pkg = n === change.hit ? 'hit' : change.deps.includes(n) ? 'dep' : '';
    });
    if (name) name.textContent = change.name;
    if (built) built.textContent = String(change.deps.length + 1);
  };

  window.setInterval(() => {
    if (still() || document.hidden) return;
    at = (at + 1) % GRAPH.changes.length;
    show(at);
  }, 2600);
}
