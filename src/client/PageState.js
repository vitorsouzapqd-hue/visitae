
const mobileContact = $('#mobile-contact');
let heroVisible = true;
let contactVisible = false;
let tourVisible = false;
function updateMobileContact() {
  const visible = !heroVisible && !contactVisible && !tourVisible && !expanded && mobileNav.hidden && !document.querySelector('dialog[open]');
  mobileContact?.classList.toggle('is-visible', visible);
}
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.target === $('#inicio')) heroVisible = entry.isIntersecting;
    if (entry.target === $('#contact-form')) contactVisible = entry.isIntersecting;
    if (entry.target === viewerWrap) tourVisible = entry.isIntersecting;
  });
  updateMobileContact();
}, { threshold: 0 });
observer.observe($('#inicio'));
observer.observe($('#contact-form'));
observer.observe(viewerWrap);
window.addEventListener('scroll', () => $('.site-header').classList.toggle('scrolled', window.scrollY > 24), { passive: true });
