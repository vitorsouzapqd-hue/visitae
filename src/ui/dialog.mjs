// Native showModal supplies focus containment, Escape and background inertness.
const locks = new WeakMap();

export function Dialog({ element, closeButton }) {
  const doc = element.ownerDocument;
  const body = doc.body;
  let opener;
  let locked = false;

  function open(trigger = doc.activeElement) {
    if (element.open) return;
    // Opening can throw for a disconnected/non-modal dialog; lock only on success.
    element.showModal();
    opener = trigger;
    const lock = locks.get(body) || { count: 0, overflow: body.style.overflow };
    lock.count += 1;
    locks.set(body, lock);
    body.style.overflow = 'hidden';
    locked = true;
  }

  function release() {
    if (element.open || !locked) return;
    locked = false;
    const lock = locks.get(body);
    lock.count -= 1;
    if (!lock.count) {
      body.style.overflow = lock.overflow;
      locks.delete(body);
    }
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  }

  function close() {
    if (element.open) element.close();
    release();
  }
  function backdrop(event) {
    if (event.target !== element) return;
    const box = element.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
  }
  closeButton.addEventListener('click', close);
  element.addEventListener('click', backdrop);
  element.addEventListener('close', release);
  return {
    element, open, close,
    destroy() {
      close();
      release();
      closeButton.removeEventListener('click', close);
      element.removeEventListener('click', backdrop);
      element.removeEventListener('close', release);
    },
  };
}
