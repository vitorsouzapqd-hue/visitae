
function navigateTo(target) {
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
  target.focus({ preventScroll: true });
  history.replaceState(null, '', `#${target.id}`);
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.getAttribute('href').slice(1));
  if (!target) return;
  event.preventDefault();
  closeMenu();
  navigateTo(target);
});
