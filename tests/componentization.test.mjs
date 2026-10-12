import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { pageComponents } from '../src/page.mjs';
import { packages } from '../src/data/packages.mjs';
import { tours } from '../src/data/tours.mjs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const hash = value => createHash('sha256').update(value).digest('hex');
const baseline = JSON.parse(read('tests/fixtures/original-files.json'));

test('assembled page preserves the original outside the restored testimonial section and requested location title', () => {
  const withoutTestimonials = html => html
    .replace(/<section class="testimonials-section[\s\S]*?<\/section>/, '<!-- testimonial section -->')
    .replace(/^[ \t]*<dialog class="testimonial-dialog"[\s\S]*?<\/dialog>\n?/m, '');
  const expected = read('tests/fixtures/original-index.html')
    .replace('<fieldset class="location-group">', '<fieldset class="location-group"><legend>Localização do estabelecimento</legend>')
    .replace('testimonials.js?v=visitae-relatos-visiveis', 'testimonials.js?v=visitae-relatos-sem-aviso')
    .replace('testimonials.css?v=visitae-3', 'testimonials.css?v=visitae-relatos-sem-aviso')
    .replace('config.js?v=visitae-relatos-visiveis', 'config.js?v=visitae-relatos-sem-aviso');
  assert.equal(withoutTestimonials(read('dist/index.html')), withoutTestimonials(expected));
  assert.equal(Object.keys(pageComponents).length, 17);
});

test('unrelated styles, fonts, portraits, illustrations, municipal data and prepared UI modules are byte identical', () => {
  for (const [path, expected] of Object.entries(baseline)) {
    if (['app.js', 'config.js', 'testimonials.js', 'testimonials.css'].includes(path)) continue;
    assert.equal(hash(readFileSync(new URL(`dist/${path}`, root))), expected, path);
  }
});

test('existing tour and contact behavior is preserved after extracting tour data', () => {
  const app = read('dist/app.js');
  const start = app.indexOf('const demos = ') + 'const demos = '.length;
  const end = app.indexOf(';\n', start);
  const dataSource = read('src/data/tours.mjs');
  const originalExpression = dataSource.slice(dataSource.indexOf('export const tours = ') + 'export const tours = '.length).trim().slice(0, -1);
  assert.equal(hash(app.slice(0, start) + originalExpression + app.slice(end)), baseline['app.js']);
});

test('illustrative cards are available in every environment; real media still requires authorization and complete data', () => {
  const source = read('dist/testimonials.js');
  // Execute the real configuration/eligibility path before the DOM rendering boundary.
  const prefix = source.slice(source.indexOf('  const configured'), source.indexOf('  section.hidden'));
  function eligible(url, flag = true, configured = {}, locationURL = url) {
    const context = vm.createContext({ URL, document: { baseURI: url }, location: new URL(locationURL), window: { SITE_CONFIG: flag === null ? undefined : { demoTestimonials: flag }, SITE_TESTIMONIALS: configured } });
    return vm.runInContext(`${prefix}\nitems`, context);
  }
  for (const url of ['https://visitae.example/', 'https://localhost.example/', 'https://visitae.example/?demoTestimonials=false', 'http://localhost:5173/', 'http://127.0.0.1:5173/', 'http://[::1]:5173/', 'file:///C:/Site/index.html']) {
    assert.deepEqual(Array.from(eligible(url), item => item.client), ['Marina', 'Rafael', 'André', 'Camila', 'Renata']);
    assert.equal(eligible(url, false).length, 5);
    assert.equal(eligible(url, null).length, 5);
  }
  assert.equal(eligible('file:///C:/Site/dist/index.html', true, {}, 'about:srcdoc').length, 5);
  assert.equal(eligible('https://visitae.example/', true, {}, 'about:srcdoc').length, 5);
  const authorized = { ambientes: { authorized: true, client: 'Cliente autorizado', title: 'Título fornecido', summary: 'Resumo fornecido', transcript: 'Transcrição fornecida', videoSrc: '/relato.mp4', poster: '/capa.webp', captionsSrc: '/legendas.vtt' } };
  const real = eligible('https://visitae.example/', true, authorized);
  assert.equal(real.length, 5);
  assert.equal(real[0].ready, true);
  assert.equal(real[0].client, authorized.ambientes.client);
  for (const patch of [{ authorized: false }, { captionsSrc: 'https://other.example/captions.vtt' }, { title: '' }, { videoSrc: 'javascript:alert(1)' }]) {
    const fallback = eligible('https://visitae.example/', true, { ambientes: { ...authorized.ambientes, ...patch } });
    assert.equal(fallback.length, 5);
    assert.equal(fallback[0].ready, false);
    assert.equal(fallback[0].client, 'Marina');
  }
});

test('package CTA values match the form; tours and all local references remain available', () => {
  const html = read('dist/index.html');
  for (const item of packages) {
    assert.ok(html.includes(`data-solution="${item.solution}"`));
    assert.ok(html.includes(`<option>${item.solution}</option>`));
  }
  assert.deepEqual(Object.keys(tours), ['hotel', 'evento', 'esportes']);
  for (const match of html.matchAll(/<(?:script|link|img)\b[^>]*?\b(?:src|href)="([^"]+)"/g)) {
    const path = match[1].split('?')[0];
    if (/^https?:/.test(path)) continue;
    assert.ok(existsSync(new URL(`dist/${path}`, root)), path);
  }
  assert.ok(!html.includes('id="mobile-contact"'));
  assert.equal((html.match(/class="page-disclosure"/g) || []).length, 1);
});
