// Native scrolling and the geometry of the original testimonials carousel.
// Call after cards are mounted; caller keeps its markup, content and classes.
export function Carousel({ track, previous, next, status, dots = [] }) {
  const win = track.ownerDocument.defaultView;
  const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  const cards = () => [...track.children];
  const behavior = () => reducedMotion.matches ? 'auto' : 'smooth';
  const stride = () => {
    const nodes = cards();
    return nodes.length > 1 ? nodes[1].offsetLeft - nodes[0].offsetLeft : nodes[0]?.offsetWidth || 0;
  };
  function goTo(index) {
    const nodes = cards();
    if (!nodes.length) return;
    const bounded = Math.max(0, Math.min(nodes.length - 1, index));
    track.scrollTo({ left: nodes[bounded].offsetLeft - nodes[0].offsetLeft, behavior: behavior() });
  }
  function step(direction) { track.scrollBy({ left: direction * stride(), behavior: behavior() }); }
  function update() {
    const nodes = cards();
    const bounds = track.getBoundingClientRect();
    const visible = nodes.map((node, index) => ({ index, rect: node.getBoundingClientRect() }))
      .filter(({ rect }) => rect.left >= bounds.left - 6 && rect.right <= bounds.right + 6);
    const first = visible.length ? visible[0].index : Math.max(0, Math.min(nodes.length - 1, Math.round(track.scrollLeft / (stride() || 1))));
    const last = visible.length ? visible.at(-1).index : first;
    previous.disabled = !nodes.length || track.scrollLeft <= 4;
    next.disabled = !nodes.length || track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    if (status) status.textContent = !nodes.length ? '' : `${first === last ? first + 1 : `${first + 1}–${last + 1}`} de ${nodes.length}`;
    dots.forEach((dot, index) => dot.classList.toggle('is-visible', nodes.length > 0 && index >= first && index <= last));
  }
  function keyboard(event) {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') goTo(0);
    else if (event.key === 'End') goTo(cards().length - 1);
    else step(event.key === 'ArrowLeft' ? -1 : 1);
  }
  function scroll() { win.clearTimeout(timer); timer = win.setTimeout(update, 120); }
  const back = () => step(-1);
  const forward = () => step(1);
  const jumps = dots.map((dot, index) => () => goTo(index));
  previous.addEventListener('click', back);
  next.addEventListener('click', forward);
  track.addEventListener('keydown', keyboard);
  track.addEventListener('scroll', scroll, { passive: true });
  dots.forEach((dot, index) => dot.addEventListener('click', jumps[index]));
  const observer = new win.ResizeObserver(update);
  observer.observe(track);
  update();
  return {
    goTo, update,
    destroy() {
      win.clearTimeout(timer);
      observer.disconnect();
      previous.removeEventListener('click', back);
      next.removeEventListener('click', forward);
      track.removeEventListener('keydown', keyboard);
      track.removeEventListener('scroll', scroll);
      dots.forEach((dot, index) => dot.removeEventListener('click', jumps[index]));
    },
  };
}
