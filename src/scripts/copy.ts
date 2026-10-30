// Copy buttons: <button data-copy="text" hidden>. Shown only where scripts (and the clipboard) can
// work; the text beside each is a link or selectable either way. A status message says it worked.

const status = document.createElement('p');
status.className = 'visually-hidden';
status.setAttribute('role', 'status');

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
  if (!navigator.clipboard) continue;
  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  const text = label?.textContent || '';
  button.hidden = false;
  if (!status.isConnected) document.body.append(status);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy || '');
    } catch {
      status.textContent = 'Copying failed: select the text instead.';
      return;
    }
    status.textContent = 'Copied to the clipboard.';
    if (label) {
      label.textContent = 'Copied';
      window.setTimeout(() => (label.textContent = text), 1800);
    }
  });
}
