// Disclosure menu, matching the existing mobile navigation; no Sheet needed.
export function Navigation({ trigger, panel, openLabel = 'Fechar menu', closedLabel = 'Abrir menu' }) {
  if (!panel.id) throw new TypeError('Navigation panel needs an id');
  const doc = trigger.ownerDocument;
  const links = [...panel.querySelectorAll('a')];
  trigger.setAttribute('aria-controls', panel.id);

  function setOpen(open, restoreFocus = false) {
    const wasOpen = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? openLabel : closedLabel);
    panel.hidden = !open;
    if (!open && wasOpen && restoreFocus) trigger.focus({ preventScroll: true });
  }
  function close() { setOpen(false); }
  function toggle() { setOpen(trigger.getAttribute('aria-expanded') !== 'true'); }
  function escape(event) { if (event.key === 'Escape') setOpen(false, true); }
  function outside(event) { if (!panel.contains(event.target) && !trigger.contains(event.target)) close(); }
  function focusout(event) { if (!panel.contains(event.relatedTarget) && event.relatedTarget !== trigger) close(); }
  setOpen(trigger.getAttribute('aria-expanded') === 'true');
  trigger.addEventListener('click', toggle);
  panel.addEventListener('focusout', focusout);
  doc.addEventListener('keydown', escape);
  doc.addEventListener('click', outside);
  links.forEach(link => link.addEventListener('click', close));
  return {
    open: () => setOpen(true), close,
    destroy() {
      close();
      trigger.removeEventListener('click', toggle);
      panel.removeEventListener('focusout', focusout);
      doc.removeEventListener('keydown', escape);
      doc.removeEventListener('click', outside);
      links.forEach(link => link.removeEventListener('click', close));
    },
  };
}
