
const menuButton = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu(restoreFocus = false) {
  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
  if (wasOpen && restoreFocus) menuButton.focus({ preventScroll: true });
  updateMobileContact();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileNav.hidden = !open;
  updateMobileContact();
});
$$('a', mobileNav).forEach(link => link.addEventListener('click', () => closeMenu()));
mobileNav.addEventListener('focusout', event => {
  if (!mobileNav.contains(event.relatedTarget) && event.relatedTarget !== menuButton) closeMenu();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });
