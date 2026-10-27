// Tabs (the WAI-ARIA tabs pattern): click or arrow keys to switch, Home and End for the ends.
// Without scripts every panel shows in turn (CSS shows the tab list only under html.js), so nothing
// is lost. Panels after the first carry data-later, which CSS hides under html.js until this runs,
// so the page doesn't jump when it does.
//   <div data-tabs> <div role="tablist"> <button role="tab" aria-controls="p1">… </div>
//   <div role="tabpanel" id="p1">… </div> <div role="tabpanel" id="p2" data-later>… </div>

for (const group of document.querySelectorAll<HTMLElement>('[data-tabs]')) {
  const list = group.querySelector<HTMLElement>('[role="tablist"]');
  const tabs = [...group.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  if (!list || !tabs.length) continue;

  const panelOf = (tab: HTMLButtonElement) => document.getElementById(tab.getAttribute('aria-controls') || '');

  const select = (next: HTMLButtonElement, focus: boolean) => {
    for (const tab of tabs) {
      const on = tab === next;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      const panel = panelOf(tab);
      if (panel) {
        panel.hidden = !on;
        delete panel.dataset.later;
      }
    }
    if (focus) next.focus();
  };

  select(tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0], false);

  list.addEventListener('click', (e) => {
    const tab = (e.target as Element).closest<HTMLButtonElement>('[role="tab"]');
    if (tab) select(tab, false);
  });

  list.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    const to: Record<string, number> = {
      ArrowRight: (i + 1) % tabs.length,
      ArrowDown: (i + 1) % tabs.length,
      ArrowLeft: (i - 1 + tabs.length) % tabs.length,
      ArrowUp: (i - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(e.key in to)) return;
    e.preventDefault();
    select(tabs[to[e.key]], true);
  });
}
