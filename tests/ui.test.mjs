import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Button, Input, Select, Label, Accordion, Dialog, Navigation, Carousel, BrandIcon } from '../dist/ui/index.mjs';

// Small DOM boundary doubles: tests exercise controllers, not browser rendering.
class Node {
  constructor(tag, doc) {
    Object.assign(this, { tagName: tag, ownerDocument: doc, children: [], attrs: {}, events: new Map(), style: {}, isConnected: true, textContent: '', open: false });
    this.classList = { toggle: (name, active) => { this.attrs[`class:${name}`] = active; } };
  }
  append(...nodes) { this.children.push(...nodes); }
  setAttribute(name, value) { this.attrs[name] = String(value); }
  getAttribute(name) { return this.attrs[name] ?? null; }
  addEventListener(name, callback) { if (!this.events.has(name)) this.events.set(name, new Set()); this.events.get(name).add(callback); }
  removeEventListener(name, callback) { this.events.get(name)?.delete(callback); }
  emit(name, props = {}) {
    const event = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...props };
    for (const callback of this.events.get(name) || []) callback(event);
    return event;
  }
  contains(node) { return node === this || this.children.some(child => child.contains(node)); }
  querySelectorAll(tag) { return this.children.flatMap(child => [...(child.tagName === tag ? [child] : []), ...child.querySelectorAll(tag)]); }
  focus() { this.ownerDocument.activeElement = this; }
  showModal() { this.open = true; }
  close() { this.open = false; queueMicrotask(() => this.emit('close')); }
  getBoundingClientRect() { return { left: 0, top: 0, right: 100, bottom: 100 }; }
}
function document() {
  const doc = new Node('#document');
  doc.createElement = tag => new Node(tag, doc);
  doc.createElementNS = (namespace, tag) => Object.assign(doc.createElement(tag), { namespaceURI: namespace });
  doc.body = doc.createElement('body');
  doc.body.style.overflow = 'scroll';
  doc.defaultView = {
    media: { matches: false },
    matchMedia() { return this.media; },
    setTimeout, clearTimeout,
    ResizeObserver: class { observe() {} disconnect() { this.disconnected = true; } },
  };
  return doc;
}

test('native controls preserve semantics, labels, options and plain text', () => {
  const doc = document();
  const button = Button({ text: '<strong>Texto</strong>', variant: 'lime', small: true, document: doc });
  assert.equal(button.type, 'button');
  assert.equal(button.textContent, '<strong>Texto</strong>');
  assert.equal(button.className, 'button button-lime button-small');
  assert.throws(() => Button({ variant: 'generic', document: doc }), TypeError);
  const input = Input({ id: 'name', name: 'business', required: true, describedBy: 'help', document: doc });
  const label = Label({ text: 'Nome', htmlFor: input.id, document: doc });
  assert.equal(label.htmlFor, input.id);
  assert.equal(input.required, true);
  assert.equal(input.getAttribute('aria-describedby'), 'help');
  const select = Select({ id: 'state', name: 'state', value: 'AM', options: [{ label: 'Selecione', value: '', disabled: true }, { label: 'Amazonas', value: 'AM' }], document: doc });
  assert.equal(select.value, 'AM');
  assert.equal(select.children[0].disabled, true);
  assert.equal(select.children[1].textContent, 'Amazonas');
  const accordion = Accordion({ items: [{ title: 'Pergunta', content: 'Resposta', open: true }], document: doc });
  const details = accordion.children[0];
  assert.equal(details.tagName, 'details');
  assert.equal(details.open, true);
  assert.equal(details.children[0].tagName, 'summary');
  assert.equal(details.children[0].children[0].getAttribute('aria-hidden'), 'true');
  assert.equal(details.children[1].children[0].textContent, 'Resposta');
});

test('brand icons preserve original geometry and distinguish named/decorative images', () => {
  const doc = document();
  const original = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const path = original.match(/<symbol[^>]*id="whatsapp"[^>]*>[\s\S]*?<path[^>]*\bd="([^"]+)"/)[1];
  const icon = BrandIcon('whatsapp', { label: 'WhatsApp', document: doc });
  assert.equal(icon.getAttribute('viewBox'), '0 0 24 24');
  assert.equal(icon.getAttribute('preserveAspectRatio'), 'xMidYMid meet');
  assert.equal(icon.children[0].getAttribute('d'), path);
  assert.equal(icon.children[0].getAttribute('stroke'), 'none');
  assert.equal(icon.getAttribute('role'), 'img');
  assert.equal(icon.getAttribute('aria-label'), 'WhatsApp');
  assert.equal(BrandIcon('whatsapp', { document: doc }).getAttribute('aria-hidden'), 'true');
  assert.throws(() => BrandIcon('unknown', { document: doc }), TypeError);
  assert.throws(() => BrandIcon('whatsapp', { size: 0, document: doc }), TypeError);
});

test('dialog preserves scroll locks across nesting, reopen and cleanup', async () => {
  const doc = document();
  const opener = doc.createElement('button');
  const element = doc.createElement('dialog');
  const closeButton = doc.createElement('button');
  const dialog = Dialog({ element, closeButton });
  const other = Dialog({ element: doc.createElement('dialog'), closeButton: doc.createElement('button') });
  dialog.open(opener);
  assert.equal(doc.body.style.overflow, 'hidden');
  other.open(closeButton);
  dialog.close();
  assert.equal(doc.body.style.overflow, 'hidden');
  other.close();
  assert.equal(doc.body.style.overflow, 'scroll');
  dialog.open(opener);
  await Promise.resolve(); // A previous close event must not unlock a reopened dialog.
  assert.equal(doc.body.style.overflow, 'hidden');
  element.emit('click', { clientX: 50, clientY: 50 });
  assert.equal(element.open, true, 'Content/padding clicks do not dismiss');
  element.emit('click', { clientX: 150, clientY: 50 });
  assert.equal(element.open, false);
  assert.equal(doc.activeElement, opener);
  dialog.open(opener);
  closeButton.emit('click');
  assert.equal(element.open, false);
  dialog.destroy();
  other.destroy();
  assert.equal(doc.body.style.overflow, 'scroll');
  assert.equal(element.events.get('click').size, 0);
});

test('navigation synchronizes disclosure, Escape focus and link/outside dismissal', () => {
  const doc = document();
  const trigger = doc.createElement('button');
  const panel = doc.createElement('nav');
  panel.id = 'mobile-nav';
  const link = doc.createElement('a');
  panel.append(link);
  const nav = Navigation({ trigger, panel });
  trigger.emit('click');
  assert.equal(panel.hidden, false);
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');
  assert.equal(trigger.getAttribute('aria-controls'), panel.id);
  doc.emit('keydown', { key: 'Escape' });
  assert.equal(panel.hidden, true);
  assert.equal(doc.activeElement, trigger);
  nav.open();
  link.emit('click');
  assert.equal(panel.hidden, true);
  nav.open();
  doc.emit('click', { target: link });
  assert.equal(panel.hidden, false);
  doc.emit('click', { target: doc.body });
  assert.equal(panel.hidden, true);
  nav.destroy();
  trigger.emit('click');
  assert.equal(panel.hidden, true, 'Destroyed navigation has no active handlers');
});

test('carousel handles bounds, keyboard, reduced motion, empty tracks and cleanup', () => {
  const doc = document();
  const track = doc.createElement('div');
  Object.assign(track, { scrollLeft: 0, clientWidth: 224, scrollWidth: 596 });
  track.getBoundingClientRect = () => ({ left: 0, right: track.clientWidth });
  track.scrollTo = options => { track.lastScroll = options; track.scrollLeft = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, options.left)); };
  track.scrollBy = options => track.scrollTo({ ...options, left: track.scrollLeft + options.left });
  for (let index = 0; index < 5; index++) {
    const card = doc.createElement('article');
    Object.assign(card, { offsetLeft: index * 124, offsetWidth: 100 });
    card.getBoundingClientRect = () => ({ left: card.offsetLeft - track.scrollLeft, right: card.offsetLeft - track.scrollLeft + 100 });
    track.append(card);
  }
  const previous = doc.createElement('button');
  const next = doc.createElement('button');
  const status = doc.createElement('span');
  const carousel = Carousel({ track, previous, next, status });
  assert.equal(status.textContent, '1–2 de 5');
  assert.equal(previous.disabled, true);
  next.emit('click');
  carousel.update();
  assert.equal(status.textContent, '2–3 de 5');
  assert.equal(track.lastScroll.behavior, 'smooth');
  doc.defaultView.media.matches = true;
  assert.equal(track.emit('keydown', { key: 'End' }).defaultPrevented, true);
  carousel.update();
  assert.equal(next.disabled, true);
  assert.equal(status.textContent, '4–5 de 5');
  assert.equal(track.lastScroll.behavior, 'auto');
  assert.equal(track.emit('keydown', { key: 'Home', target: next }).defaultPrevented, false);
  track.emit('keydown', { key: 'Home' });
  assert.equal(track.scrollLeft, 0);
  track.children = [];
  carousel.update();
  carousel.goTo(99);
  assert.equal(previous.disabled, true);
  assert.equal(next.disabled, true);
  assert.equal(status.textContent, '');
  carousel.destroy();
  assert.equal(track.events.get('keydown').size, 0);
});
