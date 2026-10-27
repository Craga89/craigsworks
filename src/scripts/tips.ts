// Tooltips that show on hover and focus (CSS), and that Escape dismisses without moving
// focus or the pointer (WCAG 1.4.13). Markup: <span data-tip> <button aria-describedby="t"> <span role="tooltip" id="t">.

for (const wrap of document.querySelectorAll<HTMLElement>('[data-tip]')) {
  const reset = () => delete wrap.dataset.dismissed;
  wrap.addEventListener('pointerleave', reset);
  wrap.addEventListener('focusout', reset);
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  for (const wrap of document.querySelectorAll<HTMLElement>('[data-tip]')) {
    if (wrap.matches(':hover, :focus-within')) wrap.dataset.dismissed = '';
  }
});
