'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const config = window.SITE_CONFIG || {};
const demos = {
  hotel: {
    src: 'https://tours.clearpano.com/T2ZhHe0r',
    external: 'https://tours.clearpano.com/T2ZhHe0r',
    cover: 'assets/tour-cover.webp',
    label: 'HOLM HOTEL · TOUR 360',
    kind: 'TOUR PERSONALIZADO',
    name: "Uma hospedagem. Outro jeito de conhecer.",
    description: "Uma foto mostra o quarto por um ângulo. Agora experimente olhar ao redor.",
    question: "\"Como é esse ambiente para além do enquadramento das fotos?\"",
    attribution: 'Holm Hotel · Tour produzido pela Clear Pano.',
    title: 'Holm Hotel em 360 · Clear Pano',
    startLabel: "Começar a visita",
  },
  evento: {
    src: 'https://www.google.com/maps/embed?pb=!4v1791682261391!6m8!1m7!1sCAoSLEFGMVFpcE1kM01xUHNaUGpuRFRMUDAxVzliVm15SU54YjhPcHlITVpTbGxv!2m2!1d-22.93141550741984!2d-43.55552526118038!3f321.75!4f-1.0699999999999932!5f0.4000000000000002',
    external: 'https://maps.app.goo.gl/wMfgnJ47d7WYYSRbA',
    cover: 'assets/palace-hall.webp',
    label: 'PALACE HALL · GOOGLE MAPS',
    kind: 'POR DENTRO NO GOOGLE MAPS',
    name: "Um salão. Muito mais para mostrar.",
    description: "Conheça o salão por dentro e observe como o ambiente está organizado.",
    question: "\"Consigo entender o salão antes de conhecer pessoalmente?\"",
    attribution: 'Palace Hall · Tour produzido pela Tour Brasil360.',
    title: 'Tour no Google Maps: Palace Hall, Tour Brasil360',
    startLabel: "Explorar o salão",
  },
  esportes: {
    src: 'https://www.google.com/maps/embed?pb=!4v1791682224889!6m8!1m7!1sCAoSLEFGMVFpcE1kejZ4NDFDOFBRTGplRlFDd3J1MHNONVppUjhJTEt6TzVuTUF1!2m2!1d-23.54103852537176!2d-46.67898180447695!3f254.57!4f2.019999999999996!5f0.4000000000000002',
    external: 'https://maps.app.goo.gl/Z2bWe51JyZyWNWKD6',
    cover: 'assets/sumare.webp',
    label: 'SUMARÉ ESPORTES · GOOGLE MAPS',
    kind: 'ESTRUTURA PARA EXPLORAR',
    name: "A estrutura que você procura, pronta para explorar.",
    description: "Explore a estrutura e veja o espaço de diferentes perspectivas.",
    question: "\"Como é o lugar onde pretendo treinar?\"",
    attribution: 'Sumaré Esportes · Tour produzido pela Tour Brasil360.',
    title: 'Tour no Google Maps: Sumaré Esportes, Tour Brasil360',
    startLabel: "Explorar a estrutura",
  },
};

let currentDemo = 'hotel';
let iframe = null;
let loadingTimer = null;
let expanded = false;
let previousFocus = null;
let inertNodes = [];
const tabs = $$('[data-demo]');
const viewerWrap = $('#viewer-wrap');
const viewer = $('#viewer');
const cover = $('#viewer-cover');
const loading = $('#viewer-loading');
const resetButton = $('#viewer-reset');

function resetTour() {
  clearTimeout(loadingTimer);
  if (iframe) iframe.remove();
  iframe = null;
  viewer.setAttribute('aria-busy', 'false');
  loading.hidden = true;
  cover.hidden = false;
  resetButton.disabled = true;
}

function loadTour() {
  if (iframe) return;
  cover.hidden = true;
  loading.hidden = false;
  loading.textContent = 'Preparando sua visita…';
  viewer.setAttribute('aria-busy', 'true');
  resetButton.disabled = false;
  const frame = document.createElement('iframe');
  iframe = frame;
  frame.src = demos[currentDemo].src;
  frame.title = demos[currentDemo].title;
  frame.allow = 'fullscreen; gyroscope; accelerometer';
  frame.allowFullscreen = true;
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.addEventListener('load', () => {
    if (iframe !== frame) return;
    clearTimeout(loadingTimer);
    viewer.setAttribute('aria-busy', 'false');
    loading.hidden = true;
  }, { once: true });
  frame.addEventListener('error', () => {
    if (iframe !== frame) return;
    resetTour();
    loading.textContent = 'Não foi possível carregar o tour. Tente novamente ou use “Abrir tour em nova aba”.';
    loading.hidden = false;
  }, { once: true });
  viewer.append(frame);
  loadingTimer = setTimeout(() => {
    if (iframe !== frame || loading.hidden) return;
    viewer.setAttribute('aria-busy', 'false');
    loading.textContent = 'O tour está demorando para carregar. Você pode abrir em nova aba ou voltar à prévia.';
  }, 12000);
}

function selectDemo(key, start = false) {
  if (!demos[key]) return;
  if (key !== currentDemo) {
    resetTour();
    currentDemo = key;
    const demo = demos[key];
    $('#viewer-label').textContent = demo.label;
    $('#viewer-start strong').textContent = demo.startLabel;
    $('#demo-kind').textContent = demo.kind;
    $('#demo-name').textContent = demo.name;
    $('#demo-description').textContent = demo.description;
    $('#demo-question').textContent = demo.question;
    $('#demo-attribution').textContent = demo.attribution;
    $('#demo-external').href = demo.external;
    $('#viewer-image').src = demo.cover;
    $('#viewer-image').alt = `Interior: ${demo.label}`;
    $('#demo-panel').setAttribute('aria-labelledby', `tab-${key}`);
  }
  tabs.forEach(tab => {
    const active = tab.dataset.demo === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  if (start) loadTour();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectDemo(tab.dataset.demo, Boolean(iframe)));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    tabs[next].focus();
    selectDemo(tabs[next].dataset.demo, Boolean(iframe));
  });
});

$('#viewer-start').addEventListener('click', loadTour);
resetButton.addEventListener('click', () => {
  resetTour();
  $('#viewer-start').focus({ preventScroll: true });
});
$$('[data-demo-start]').forEach(button => button.addEventListener('click', event => {
  event.preventDefault();
  selectDemo(button.dataset.demoStart, true);
  navigateTo($('#experimente'));
}));

function closeExpanded() {
  if (!expanded) return;
  expanded = false;
  viewerWrap.classList.remove('is-expanded');
  document.body.classList.remove('tour-open');
  $('#viewer-close').hidden = true;
  viewerWrap.removeAttribute('role');
  viewerWrap.removeAttribute('aria-modal');
  viewerWrap.removeAttribute('aria-label');
  inertNodes.forEach(({ node, wasInert }) => { node.inert = wasInert; });
  inertNodes = [];
  if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
  updateMobileContact();
}
$('.viewer-expand').addEventListener('click', () => {
  if (expanded) return;
  previousFocus = document.activeElement;
  expanded = true;
  loadTour();
  viewerWrap.classList.add('is-expanded');
  document.body.classList.add('tour-open');
  viewerWrap.setAttribute('role', 'dialog');
  viewerWrap.setAttribute('aria-modal', 'true');
  viewerWrap.setAttribute('aria-label', 'Tour ampliado');
  inertNodes = [$('.site-header'), $('.site-footer'), $('#mobile-contact'), ...$$('main > section:not(#experimente)'), $('.channel-strip'), $('.demo-heading'), $('.demo-tabs'), $('.demo-context'), $('.demo-attribution'), $('.demo-bottom')].filter(Boolean).map(node => ({ node, wasInert: node.inert }));
  inertNodes.forEach(({ node }) => { node.inert = true; });
  $('#viewer-close').hidden = false;
  $('#viewer-close').focus();
  updateMobileContact();
});
$('#viewer-close').addEventListener('click', closeExpanded);
viewerWrap.addEventListener('keydown', event => {
  if (!expanded || event.key !== 'Tab') return;
  const controls = $$('a[href], button:not(:disabled), iframe', viewerWrap).filter(node => node.getClientRects().length);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeExpanded(); });

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
$$('[data-solution]').forEach(button => button.addEventListener('click', () => {
  $('#solution-choice').value = button.dataset.solution;
  $('#solution-choice').dispatchEvent(new Event('change', { bubbles: true }));
}));

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

// Only transient page state: no storage, analytics or lead submission.
const whatsapp = String(config.whatsapp || '').replace(/\D/g, '');
const form = $('#contact-form');
const recovery = $('#contact-recovery');
let preparedMessage = '';
let nativeSubmit = false;
const fields = $$('input, select', form);
const errorMessages = {
  business: 'Informe o nome do estabelecimento.',
  state: 'Selecione o estado do estabelecimento.',
  city: 'Informe a cidade do estabelecimento.',
};
fields.forEach(field => {
  const label = field.closest('label');
  const caption = document.createElement('span');
  caption.id = `${field.id}-label`;
  while (label.firstChild !== field) caption.append(label.firstChild);
  label.prepend(caption);
  field.setAttribute('aria-labelledby', caption.id);
  const error = document.createElement('span');
  error.className = 'field-error';
  error.id = `${field.id}-error`;
  error.hidden = true;
  label.append(error);
  field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
});
function showFieldError(field, force = false) {
  if (!force && field.getAttribute('aria-invalid') !== 'true') return;
  const error = $(`#${field.id}-error`);
  const invalid = !field.disabled && !field.validity.valid;
  field.setAttribute('aria-invalid', String(invalid));
  error.hidden = !invalid;
  error.textContent = invalid ? (field.validity.valueMissing ? errorMessages[field.name] : field.validationMessage) : '';
}
function validateBusiness() {
  const business = $('#business-name');
  business.setCustomValidity(business.value.trim() ? '' : errorMessages.business);
}
function clearPrepared() {
  preparedMessage = '';
  recovery.hidden = true;
  $('#briefing-result').hidden = true;
  $('#briefing-result').value = '';
  $('#copy-status').textContent = '';
  $('#contact-status').textContent = '';
  $('#whatsapp-retry').removeAttribute('href');
}
form.addEventListener('input', event => {
  validateBusiness();
  if (fields.includes(event.target)) showFieldError(event.target);
  clearPrepared();
});
form.addEventListener('change', event => {
  if (fields.includes(event.target)) showFieldError(event.target);
  clearPrepared();
});
$('#business-city').addEventListener('cityvalidationchange', () => showFieldError($('#business-city')));
form.addEventListener('invalid', event => { event.preventDefault(); showFieldError(event.target, true); }, true);

function buildBudgetMessage(values) {
  const value = key => String(values.get(key) || '').trim();
  const lines = [
    'Olá, equipe Visitaê! Conheci o trabalho de vocês e gostaria de conversar sobre a possibilidade de criar um tour virtual 360 para meu espaço.',
    '',
    'Informações do meu estabelecimento:',
    '',
    `Nome: ${value('business')}`,
    `Localização: ${value('city')} / ${value('state')}`,
  ];
  if (value('neighborhood')) lines.push(`Bairro: ${value('neighborhood')}`);
  if (value('type')) lines.push(`Tipo de espaço: ${value('type')}`);
  if (value('solution')) lines.push(`Tenho interesse em: ${value('solution')}`);
  if (value('link')) lines.push(`Instagram ou site: ${value('link')}`);
  lines.push('', 'Gostaria de entender como funcionaria o projeto e solicitar um orçamento.');
  return lines.join('\n');
}

form.addEventListener('submit', event => {
  nativeSubmit = false;
  validateBusiness();
  fields.forEach(field => showFieldError(field, true));
  if (!form.checkValidity()) {
    event.preventDefault();
    $('#contact-status').textContent = 'Confira os campos indicados para preparar sua mensagem.';
    fields.find(field => !field.disabled && !field.validity.valid)?.focus();
    return;
  }
  preparedMessage = buildBudgetMessage(new FormData(form));
  const url = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(preparedMessage)}` : '';
  const retry = $('#whatsapp-retry');
  retry.hidden = !url;
  if (url) retry.href = url;
  recovery.hidden = false;
  $('#contact-status').textContent = 'Mensagem preparada. Revise os dados e envie pelo WhatsApp.';
  $('#copy-status').textContent = '';
  $('#briefing-result').hidden = true;
  if (url) nativeSubmit = true;
  else event.preventDefault();
});
// Native form navigation opens a tab directly from the submit action. Only the
// prepared message leaves the page; individual fields are removed from the GET.
form.addEventListener('formdata', event => {
  if (!nativeSubmit) return;
  nativeSubmit = false;
  [...event.formData.keys()].forEach(key => event.formData.delete(key));
  event.formData.set('text', preparedMessage);
});
if (whatsapp) {
  form.action = `https://wa.me/${whatsapp}`;
  form.method = 'get';
  form.target = '_blank';
  form.rel = 'noopener noreferrer';
}
$('#copy-message').addEventListener('click', async () => {
  if (!preparedMessage) return;
  const message = preparedMessage;
  try {
    await navigator.clipboard.writeText(message);
    if (preparedMessage !== message) return;
    $('#copy-status').textContent = 'Mensagem copiada. Cole no WhatsApp e revise antes de enviar.';
  } catch {
    if (preparedMessage !== message) return;
    const result = $('#briefing-result');
    result.value = message;
    result.hidden = false;
    result.focus();
    result.select();
    $('#copy-status').textContent = 'Selecione e copie a mensagem abaixo para colar no WhatsApp.';
  }
});
// Keep native validation if this script fails to initialize.
form.noValidate = true;

const credits = $('#credits-dialog');
$('#credits-open').addEventListener('click', () => { credits.showModal(); updateMobileContact(); });
$('.dialog-close', credits).addEventListener('click', () => credits.close());
credits.addEventListener('click', event => { if (event.target === credits) credits.close(); });
credits.addEventListener('close', updateMobileContact);

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
$('#year').textContent = new Date().getFullYear();
