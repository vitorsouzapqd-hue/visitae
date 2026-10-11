// Documentation only: the landing page does not load this module.
import { Dialog, Navigation } from '../dist/ui/index.mjs';

if (!document.body.dataset.componentExample) {
  // Accept size reports only from the isolated examples belonging to this page.
  window.addEventListener('message', event => {
    if (event.data?.type !== 'visitae-example-size' || !Number.isFinite(event.data.height)) return;
    const frame = [...document.querySelectorAll('iframe[data-component-example]')]
      .find(node => node.contentWindow === event.source);
    if (!frame) return;
    const height = Math.max(Number(frame.dataset.minHeight), Math.min(1200, Math.ceil(event.data.height)));
    frame.style.height = `${height}px`;
  });
} else if (document.body.dataset.componentExample) {
  const header = document.querySelector('.site-header');
  if (header) Navigation({ trigger: header.querySelector('.menu-toggle'), panel: header.querySelector('#mobile-nav') });

  const credits = document.querySelector('#credits-dialog');
  if (credits) {
    const dialog = Dialog({ element: credits, closeButton: credits.querySelector('.dialog-close') });
    document.querySelector('#credits-open').addEventListener('click', event => dialog.open(event.currentTarget));
  }

  // This isolated form demonstrates fields and native validation without navigation.
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('#contact-status').textContent = 'Exemplo documental: campos válidos. Nenhum dado foi enviado.';
  });

  // Original CTAs point to the full original preview, retaining their destination.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    const href = link?.getAttribute('href');
    if (!href?.startsWith('#')) return;
    event.preventDefault();
    const reference = window.parent.document.querySelector('iframe[name="visitae-reference"]');
    if (!reference) return;
    reference.src = `dist/index.html${href}`;
    window.parent.document.querySelector('#referencia').scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  });

  const reportSize = () => {
    const origin = new URL(document.baseURI).origin;
    window.parent.postMessage({ type: 'visitae-example-size', height: document.body.offsetHeight }, origin === 'null' ? '*' : origin);
  };
  new ResizeObserver(reportSize).observe(document.body);
  document.fonts.ready.then(reportSize);
  reportSize();
}
