// Copy buttons: <button data-copy="text" hidden>. Shown only where scripts (and the clipboard) can
// work; the text beside each is a link or selectable either way. A status message says it worked.

const copyStatus = document.createElement('p');
copyStatus.className = 'visually-hidden';
copyStatus.setAttribute('role', 'status');

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-copy]')) {
  if (!navigator.clipboard) continue;
  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  const text = label?.textContent || '';
  button.hidden = false;
  if (!copyStatus.isConnected) document.body.append(copyStatus);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy || '');
    } catch {
      copyStatus.textContent = 'Copying failed: select the text instead.';
      return;
    }
    copyStatus.textContent = 'Copied to the clipboard.';
    if (label) {
      label.textContent = 'Copied';
      window.setTimeout(() => (label.textContent = text), 1800);
    }
  });
}
