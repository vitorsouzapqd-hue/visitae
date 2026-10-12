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

test('assembled page preserves the complete original HTML, except the two requested changes', () => {
  const expected = read('tests/fixtures/original-index.html')
    .replace('<fieldset class="location-group">', '<fieldset class="location-group"><legend>Localização do estabelecimento</legend>')
    .replace('testimonials.js?v=visitae-relatos-visiveis', 'testimonials.js?v=visitae-relatos-internos');
  assert.equal(read('dist/index.html'), expected);
  assert.equal(Object.keys(pageComponents).length, 18);
});

test('styles, fonts, portraits, illustrations, municipal data and prepared UI modules are byte identical', () => {
  for (const [path, expected] of Object.entries(baseline)) {
    if (['app.js', 'config.js', 'testimonials.js'].includes(path)) continue;
    assert.equal(hash(readFileSync(new URL(`dist/${path}`, root))), expected, path);
  }
});

test('existing client behavior is preserved after extracting tour data and internal-demo gating', () => {
  const app = read('dist/app.js');
  const start = app.indexOf('const demos = ') + 'const demos = '.length;
  const end = app.indexOf(';\n', start);
  const dataSource = read('src/data/tours.mjs');
  const originalExpression = dataSource.slice(dataSource.indexOf('export const tours = ') + 'export const tours = '.length).trim().slice(0, -1);
  assert.equal(hash(app.slice(0, start) + originalExpression + app.slice(end)), baseline['app.js']);
  const originalTestimonials = read('dist/testimonials.js').replace(
    /\/\/ Internal demonstrations require both the flag and a loopback address\.[\s\S]*?const demoEnabled = [^;]+;/,
    '// Illustrative prototype stories are explicitly enabled by configuration.\n  const demoEnabled = window.SITE_CONFIG?.demoTestimonials === true;');
  assert.equal(hash(originalTestimonials), baseline['testimonials.js']);
});

test('public demos are blocked even with the flag; authorized real media remains eligible', () => {
  const source = read('dist/testimonials.js');
  // Execute the real configuration/eligibility path before the DOM rendering boundary.
  const prefix = source.slice(source.indexOf('  const configured'), source.indexOf('  section.hidden'));
  function eligible(url, flag = true, configured = {}) {
    const context = vm.createContext({ URL, document: { baseURI: url }, location: new URL(url), window: { SITE_CONFIG: { demoTestimonials: flag }, SITE_TESTIMONIALS: configured } });
    return vm.runInContext(`${prefix}\nitems`, context);
  }
  for (const url of ['https://visitae.example/', 'https://localhost.example/', 'https://visitae.example/?demoTestimonials=true', 'file:///C:/Site/index.html']) {
    assert.equal(eligible(url).length, 0, url);
  }
  for (const url of ['http://localhost:5173/', 'http://127.0.0.1:5173/', 'http://[::1]:5173/']) {
    assert.deepEqual(Array.from(eligible(url), item => item.client), ['Marina', 'Rafael', 'André', 'Camila', 'Renata']);
    assert.equal(eligible(url, false).length, 0);
  }
  const authorized = { ambientes: { authorized: true, client: 'Cliente autorizado', title: 'Título fornecido', summary: 'Resumo fornecido', transcript: 'Transcrição fornecida', videoSrc: '/relato.mp4', poster: '/capa.webp', captionsSrc: '/legendas.vtt' } };
  const real = eligible('https://visitae.example/', true, authorized);
  assert.equal(real.length, 1);
  assert.equal(real[0].ready, true);
  assert.equal(real[0].client, authorized.ambientes.client);
  assert.equal(eligible('https://visitae.example/', true, { ambientes: { ...authorized.ambientes, authorized: false } }).length, 0);
  assert.equal(eligible('https://visitae.example/', true, { ambientes: { ...authorized.ambientes, captionsSrc: 'https://other.example/captions.vtt' } }).length, 0);
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
