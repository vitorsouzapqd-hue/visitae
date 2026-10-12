
const pageDemo = $('#page-demo-dialog');
const pageDemoFrame = $('#page-demo-frame');
let pageDemoOpener = null;
let pageDemoScroll = 0;
$$('[data-page-demo]').forEach(link => link.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || typeof pageDemo.showModal !== 'function') return;
  event.preventDefault();
  if (pageDemo.open) return;
  pageDemoOpener = link;
  pageDemoScroll = window.scrollY;
  pageDemo.showModal();
  document.body.classList.add('page-demo-open');
  const frame = document.createElement('iframe');
  frame.title = 'Página demonstrativa Vila Terroir';
  frame.src = link.href;
  frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.allow = 'fullscreen';
  pageDemoFrame.append(frame);
  updateMobileContact();
}));
$('#page-demo-close').addEventListener('click', () => pageDemo.close());
pageDemo.addEventListener('click', event => {
  if (event.target !== pageDemo) return;
  const bounds = pageDemo.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) pageDemo.close();
});
pageDemo.addEventListener('close', () => {
  pageDemoFrame.replaceChildren();
  document.body.classList.remove('page-demo-open');
  window.scrollTo({ top: pageDemoScroll, behavior: 'instant' });
  pageDemoOpener?.focus({ preventScroll: true });
  updateMobileContact();
});
