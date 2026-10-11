const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const app = fs.readFileSync('dist/app.js', 'utf8');

class Control {
  constructor(id, name, required = false) {
    Object.assign(this, { id, name, required, value: '', disabled: false, hidden: false, attrs: {}, handlers: {} });
  }
  setCustomValidity(message) { this.message = message; }
  get validity() { return { valid: this.disabled || (!this.message && (!this.required || !!this.value)), valueMissing: this.required && !this.value }; }
  get validationMessage() { return this.message || ''; }
  setAttribute(key, value) { this.attrs[key] = value; }
  getAttribute(key) { return this.attrs[key] ?? null; }
  removeAttribute(key) { delete this.attrs[key]; }
  addEventListener(type, callback) { (this.handlers[type] ||= []).push(callback); }
  async emit(type, detail = {}) { const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, target: this, ...detail }; for (const callback of this.handlers[type] || []) await callback(event); return event; }
  focus() { this.focused = true; }
  select() { this.selected = true; }
}

async function verifyContact() {
  const fields = [new Control('business-name', 'business', true), new Control('business-state', 'state', true), new Control('business-city', 'city', true), new Control('business-neighborhood', 'neighborhood'), new Control('business-type', 'type'), new Control('solution-choice', 'solution'), new Control('business-link', 'link')];
  const nodes = Object.fromEntries(fields.flatMap(field => [[`#${field.id}`, field], [`#${field.id}-error`, new Control(`${field.id}-error`)]]));
  ['contact-recovery', 'contact-status', 'copy-status', 'briefing-result', 'whatsapp-retry', 'copy-message'].forEach(id => { nodes[`#${id}`] = new Control(id); });
  const form = new Control('contact-form');
  form.checkValidity = () => fields.every(field => field.validity.valid);
  const opened = [];
  let popupThrows = false;
  let clipboardThrows = false;
  let copied = '';
  const context = vm.createContext({
    $, form, fields, recovery: nodes['#contact-recovery'], preparedMessage: '', nativeSubmit: false, whatsapp: '5535991679134',
    errorMessages: { business: 'Informe o nome do estabelecimento.', state: 'Selecione o estado do estabelecimento.', city: 'Informe a cidade do estabelecimento.' },
    FormData: class { get(name) { return fields.find(field => field.name === name)?.value || ''; } },
    navigator: { clipboard: { async writeText(text) { if (clipboardThrows) throw new Error('Clipboard unavailable'); copied = text; } } },
  });
  function $(selector) { assert.ok(nodes[selector], selector); return nodes[selector]; }
  vm.runInContext(app.slice(app.indexOf('function showFieldError('), app.indexOf('const credits =')), context);
  async function submit() {
    const event = await form.emit('submit');
    if (event.defaultPrevented) return;
    const data = new Map(fields.map(field => [field.name, field.value]));
    await form.emit('formdata', { formData: data });
    assert.deepEqual([...data.keys()], ['text'], 'Only the prepared message may leave the page');
    if (!popupThrows) opened.push({ url: form.action + '?' + new URLSearchParams(data).toString() });
  }
  assert.equal(form.target, '_blank');
  assert.equal(form.rel, 'noopener noreferrer');

  await submit();
  assert.equal(opened.length, 0, 'Empty required fields must not open WhatsApp');
  assert.equal(fields[0].focused, true);
  assert.equal(nodes['#business-name-error'].hidden, false);
  fields[0].value = '   ';
  fields[1].value = 'MG'; fields[2].value = 'Poços de Caldas';
  await submit();
  assert.equal(opened.length, 0, 'Whitespace is not a business name');
  const inputs = ['  Salão São João & Cia  ', 'MG', 'Poços de Caldas', 'Centro', 'Espaço de eventos', 'Tour Completo', 'https://exemplo.com/?a=1&b=ação'];
  inputs.forEach((value, index) => { fields[index].value = value; });
  await submit();
  assert.equal(opened.length, 1);
  const url = new URL(opened[0].url);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5535991679134');
  const expected = 'Olá, equipe Visitaê! Conheci o trabalho de vocês e gostaria de conversar sobre a possibilidade de criar um tour virtual 360 para meu espaço.\n\nInformações do meu estabelecimento:\n\nNome: Salão São João & Cia\nLocalização: Poços de Caldas / MG\nBairro: Centro\nTipo de espaço: Espaço de eventos\nTenho interesse em: Tour Completo\nInstagram ou site: https://exemplo.com/?a=1&b=ação\n\nGostaria de entender como funcionaria o projeto e solicitar um orçamento.';
  assert.equal(url.searchParams.get('text'), expected, 'Exact message, accents, ampersands and newlines');
  assert.equal(nodes['#contact-status'].textContent, 'Mensagem preparada. Revise os dados e envie pelo WhatsApp.');
  assert.equal(nodes['#contact-recovery'].hidden, false);
  assert.equal(fields[0].value, inputs[0], 'Keep form data');
  await nodes['#copy-message'].emit('click');
  assert.equal(copied, expected);
  clipboardThrows = true;
  await nodes['#copy-message'].emit('click');
  assert.equal(nodes['#briefing-result'].value, expected);
  assert.equal(nodes['#briefing-result'].selected, true, 'Manual copy fallback');
  fields[0].value = 'Outro espaço';
  await form.emit('input', { target: fields[0] });
  assert.equal(nodes['#contact-recovery'].hidden, true, 'Do not copy a stale briefing after edits');
  assert.equal(nodes['#briefing-result'].value, '');
  fields[3].value = ''; fields[4].value = ''; fields[5].value = 'Ainda quero entender a melhor opção'; fields[6].value = '';
  popupThrows = true;
  await submit();
  const minimal = new URL(nodes['#whatsapp-retry'].href).searchParams.get('text');
  assert.ok(!minimal.includes('Bairro:') && !minimal.includes('Tipo de espaço:') && !minimal.includes('Instagram ou site:'));
  assert.ok(minimal.includes('Tenho interesse em: Ainda quero entender a melhor opção'));
  assert.equal(nodes['#contact-recovery'].hidden, false, 'Popup failure keeps retry and copy available');
  assert.equal(fields[0].value, 'Outro espaço');
  console.log('Contact: exact message, validation, encoding, optional fields, native navigation and copy fallbacks passed.');
}

function verifyTours() {
  const nodes = new Map();
  const timers = new Map();
  let timerId = 0;
  function node() {
    return { hidden: false, disabled: true, handlers: {}, attrs: {}, children: [],
      setAttribute(key, value) { this.attrs[key] = value; },
      addEventListener(type, callback) { this.handlers[type] = callback; },
      append(child) { this.children.push(child); },
      remove() { this.removed = true; },
    };
  }
  const document = { querySelector(selector) { if (!nodes.has(selector)) nodes.set(selector, node()); return nodes.get(selector); }, querySelectorAll() { return []; }, createElement: node };
  const context = vm.createContext({ document, window: {}, setTimeout(callback) { timers.set(++timerId, callback); return timerId; }, clearTimeout(id) { timers.delete(id); } });
  vm.runInContext(app.slice(0, app.indexOf('tabs.forEach((tab, index)')), context);
  assert.equal(nodes.get('#viewer').children.length, 0, 'No initial external iframe');
  vm.runInContext('loadTour(); loadTour();', context);
  const first = nodes.get('#viewer').children[0];
  assert.equal(nodes.get('#viewer').children.length, 1, 'Only one active viewer');
  [...timers.values()][0]();
  assert.match(nodes.get('#viewer-loading').textContent, /demorando/);
  assert.equal(nodes.get('#viewer-loading').hidden, false);
  vm.runInContext("selectDemo('evento', true)", context);
  const second = nodes.get('#viewer').children[1];
  assert.equal(first.removed, true);
  assert.match(second.src, /google\.com\/maps\/embed/);
  assert.equal(nodes.get('#demo-external').href, 'https://maps.app.goo.gl/wMfgnJ47d7WYYSRbA');
  first.handlers.load();
  assert.equal(nodes.get('#viewer-loading').hidden, false, 'Old iframe load must not hide current loading state');
  second.handlers.error();
  assert.equal(second.removed, true);
  assert.equal(nodes.get('#viewer-cover').hidden, false);
  assert.match(nodes.get('#viewer-loading').textContent, /Não foi possível/);
  vm.runInContext("selectDemo('esportes', true)", context);
  assert.equal(nodes.get('#demo-external').href, 'https://maps.app.goo.gl/Z2bWe51JyZyWNWKD6');
  vm.runInContext('resetTour()', context);
  assert.equal(nodes.get('#viewer-reset').disabled, true);
  console.log('Tours: progressive loading, switching, timeout, error, stale load and reset passed.');
}
verifyContact().then(verifyTours).catch(error => { console.error(error); process.exitCode = 1; });
