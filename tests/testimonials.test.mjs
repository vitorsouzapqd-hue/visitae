import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const recovered = JSON.parse(read('tests/fixtures/recovered-testimonials.json'));

test('large portrait/card CSS comes from the recoverable historical source; narratives and modal remain intact', () => {
  const css = read('dist/testimonials.css');
  assert.equal(hash(css.slice(0, css.indexOf('body.testimonial-opened'))), recovered.cardStylesSha256);
  assert.equal(hash(css.slice(css.indexOf('body.testimonial-opened'), css.indexOf('@media (max-width: 1100px)'))), recovered.modalStylesSha256);
  assert.equal(hash(read('src/data/testimonials.mjs')), recovered.preservedNarrativesSha256);
  const script = read('dist/testimonials.js');
  assert.equal(hash(script.slice(script.indexOf('  const cards ='))), recovered.carouselAndDialogSha256);
  assert.equal(hash(script.slice(script.indexOf('  const safeMedia'), script.indexOf('  section.hidden'))), recovered.mediaEligibilitySha256);
});

// DOM boundary doubles exercise the real renderer and handlers without a browser.
class Element {
  constructor(tag, doc, className = '', id = '') {
    Object.assign(this, { tagName: tag, ownerDocument: doc, className, id, children: [], attrs: {}, style: {}, handlers: {}, hidden: false, scrollLeft: 0, open: false });
    this.classList = {
      add: name => { this.className += ` ${name}`; },
      remove: name => { this.className = this.className.split(' ').filter(value => value !== name).join(' '); },
      toggle: (name, enabled) => { this.classList.remove(name); if (enabled) this.classList.add(name); },
      contains: name => this.className.split(' ').includes(name),
    };
  }
  append(...children) { for (const child of children) { child.parent = this; this.children.push(child); } }
  replaceChildren(...children) { this.children = []; this.append(...children); }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  removeAttribute(name) { delete this.attrs[name]; }
  querySelector(selector) {
    const matches = node => selector.startsWith('#') ? node.id === selector.slice(1) : selector.startsWith('.') ? node.classList.contains(selector.slice(1)) : node.tagName === selector;
    for (const child of this.children) { if (matches(child)) return child; const nested = child.querySelector(selector); if (nested) return nested; }
    return null;
  }
  addEventListener(name, handler) { (this.handlers[name] ||= []).push(handler); }
  emit(name, details = {}) {
    const event = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...details };
    for (const handler of this.handlers[name] || []) handler(event);
    return event;
  }
  get offsetLeft() { return this.parent?.id === 'testimonials-track' ? this.parent.children.indexOf(this) * 354 : 0; }
  get offsetWidth() { return 330; }
  get clientWidth() { return 1038; }
  get scrollWidth() { return this.children.length * 354 - 24; }
  getBoundingClientRect() {
    const left = this.parent?.id === 'testimonials-track' ? this.offsetLeft - this.parent.scrollLeft : 0;
    return { left, right: left + (this.id === 'testimonials-track' ? this.clientWidth : this.offsetWidth), top: 0, bottom: 400 };
  }
  scrollTo(options) { this.lastScroll = options; this.scrollLeft = Math.max(0, Math.min(options.left, this.scrollWidth - this.clientWidth)); }
  scrollBy(options) { this.scrollTo({ ...options, left: this.scrollLeft + options.left }); }
  showModal() { this.open = true; }
  close() { this.open = false; this.emit('close'); }
  focus() { this.ownerDocument.activeElement = this; }
  play() { this.played = true; return Promise.resolve(); }
  pause() { this.paused = true; }
  load() { this.unloaded = true; }
}

function mount(url = 'file:///C:/Site/dist/index.html', configured = {}, reduced = false) {
  const doc = { baseURI: url, resize: [] };
  doc.createElement = tag => new Element(tag, doc);
  doc.createElementNS = (_, tag) => doc.createElement(tag);
  doc.body = doc.createElement('body');
  doc.querySelector = selector => doc.body.querySelector(selector);
  const section = new Element('section', doc, 'testimonials-section', 'depoimentos');
  const add = (parent, tag, className = '', id = '') => { const child = new Element(tag, doc, className, id); parent.append(child); return child; };
  section.hidden = true;
  const preview = add(section, 'div', 'testimonials-preview', 'testimonials-preview');
  preview.hidden = true;
  const track = add(section, 'div', 'testimonials-track', 'testimonials-track');
  const dots = add(section, 'div', 'testimonials-dots');
  const previous = add(section, 'button', 'testimonial-prev');
  const next = add(section, 'button', 'testimonial-next');
  const status = add(section, 'p', 'testimonials-status');
  const dialog = new Element('dialog', doc, 'testimonial-dialog', 'testimonial-dialog');
  for (const id of ['testimonial-player', 'testimonial-video-error', 'testimonial-captions-error', 'testimonial-dialog-label', 'testimonial-dialog-title', 'testimonial-dialog-intro', 'testimonial-client']) add(dialog, 'div', '', id);
  const transcript = add(dialog, 'details', '', 'testimonial-transcript');
  add(transcript, 'summary');
  add(transcript, 'p');
  add(dialog, 'button', 'testimonial-dialog-close');
  doc.body.append(section, dialog);
  const context = vm.createContext({
    document: doc, location: new URL(url), URL, setTimeout, clearTimeout,
    window: { SITE_CONFIG: { demoTestimonials: true }, SITE_TESTIMONIALS: configured, matchMedia: () => ({ matches: reduced }) },
    ResizeObserver: class { constructor(callback) { doc.resize.push(callback); } observe() {} },
  });
  vm.runInContext(read('dist/testimonials.js'), context);
  return { doc, section, preview, track, dots, previous, next, status, dialog, transcript };
}

test('all five photos lead their cards, with fictional badges, names, carousel and full reading', () => {
  const { doc, section, preview, track, dots, previous, next, status, dialog, transcript } = mount();
  assert.equal(section.hidden, false);
  assert.equal(preview.hidden, false);
  assert.equal(track.children.length, 5);
  assert.equal(dots.children.length, 5);
  assert.equal(status.textContent, '1–3 de 5');
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, false);
  for (const [index, name] of ['Marina', 'Rafael', 'André', 'Camila', 'Renata'].entries()) {
    const card = track.children[index];
    assert.equal(card.children[0].className, 'testimonial-cover');
    assert.equal(card.children[1].className, 'testimonial-card-body');
    assert.equal(card.querySelector('.testimonial-video-identity').children[0].textContent, name);
    assert.equal(card.querySelector('.testimonial-video-label').textContent, 'EXEMPLO FICTÍCIO');
    assert.equal(card.querySelector('.testimonial-portrait-sprite').style.backgroundPosition, `${index * 25}% center`);
    const opener = card.querySelector('.testimonial-cover-play');
    opener.emit('click');
    assert.equal(dialog.open, true);
    assert.equal(transcript.open, true);
    assert.ok(transcript.querySelector('p').textContent.length > 300);
    assert.equal(dialog.querySelector('video'), null);
    dialog.querySelector('.testimonial-dialog-close').emit('click');
    assert.equal(dialog.open, false);
    assert.equal(doc.activeElement, opener);
    assert.equal(dialog.querySelector('#testimonial-player').children.length, 0);
  }
  track.emit('keydown', { key: 'End' });
  doc.resize[0]();
  assert.equal(status.textContent, '3–5 de 5');
  assert.equal(next.disabled, true);
  track.emit('keydown', { key: 'Home' });
  assert.equal(track.scrollLeft, 0);
  const quiet = mount('http://localhost:5173/', {}, true);
  quiet.next.emit('click');
  assert.equal(quiet.track.lastScroll.behavior, 'auto');
});

test('public pages hide fictional examples; authorized videos load only on request and unload on close', () => {
  const empty = mount('https://visitae.example/');
  assert.equal(empty.section.hidden, true);
  assert.equal(empty.track.children.length, 0);
  const ready = mount('https://visitae.example/', { ambientes: { authorized: true, client: 'Cliente autorizado', title: 'Título real', summary: 'Resumo real', transcript: 'Transcrição fornecida', videoSrc: '/relato.mp4', poster: '/capa.webp', captionsSrc: '/legendas.vtt' } });
  assert.equal(ready.track.children.length, 1);
  assert.equal(ready.preview.hidden, true);
  assert.equal(ready.dialog.querySelector('video'), null);
  ready.track.children[0].querySelector('.testimonial-cover-play').emit('click');
  const video = ready.dialog.querySelector('video');
  assert.equal(video.src, 'https://visitae.example/relato.mp4');
  assert.equal(video.played, true);
  ready.dialog.emit('click', { clientX: -10, clientY: -10 });
  assert.equal(ready.dialog.open, false);
  assert.equal(video.paused, true);
  assert.equal(video.unloaded, true);
  assert.equal(ready.dialog.querySelector('video'), null);
});
