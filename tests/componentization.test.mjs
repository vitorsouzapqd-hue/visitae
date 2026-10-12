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

test('assembled page preserves the original outside the footer, magazine, testimonials and requested copy edits', () => {
  const withoutTestimonials = html => html
    .replace(/<footer class="site-footer[\s\S]*?<\/footer>/, '<!-- footer -->')
    .replace(/<section class="testimonials-section[\s\S]*?<\/section>/, '<!-- testimonial section -->')
    .replace(/^[ \t]*<dialog class="testimonial-dialog"[\s\S]*?<\/dialog>\n?/m, '');
  const expected = read('tests/fixtures/original-index.html')
    .replace('testimonials.js?v=visitae-relatos-visiveis', 'testimonials.js?v=visitae-retratos-com-folga')
    .replace('testimonials.css?v=visitae-3', 'testimonials.css?v=visitae-depoimentos-cta')
    .replace('styles.css?v=visitae-tour-tabs', 'styles.css?v=visitae-rodape-hierarquia-mobile')
    .replace('config.js?v=visitae-relatos-visiveis', 'config.js?v=visitae-relatos-sem-aviso')
    .replace('app.js?v=visitae-header-cta', 'app.js?v=visitae-legendas-removidas')
    .replace('Seu espaço merece ser explorado.', 'A visita começa antes da chegada.')
    .replace('</span> PERSONALIZADO</span>', '</span> SOB MEDIDA</span>')
    .replaceAll('Projeto Personalizado', 'Projeto Sob Medida')
    .replace('Agora, imagine seus clientes explorando <em>o seu espaço.</em>', 'Não faça seus clientes imaginarem como é o seu espaço. <em>Deixe que entrem.</em>')
    .replace('Você já viu como funciona uma visita virtual 360.', 'Você já viu como uma visita virtual 360° permite conhecer um lugar por dentro, antes mesmo de chegar até ele.')
    .replace('Agora, queremos conhecer seu estabelecimento.', '<strong>Agora, essa experiência pode começar no seu estabelecimento.</strong>')
    .replace('Conte para a Visitaê onde fica seu espaço, quais ambientes deseja apresentar e como gostaria que seus clientes o conhecessem.', 'Conte para a Visitaê onde fica seu negócio, quais ambientes deseja apresentar e como gostaria que seus clientes os conhecessem.')
    .replace('Vamos avaliar seu projeto e indicar a solução que faz mais sentido para ele.', 'Com essas informações, vamos entender as necessidades do seu projeto e indicar a solução que faz mais sentido para o seu espaço.')
    .replaceAll('<span class="brand-name" aria-label="Visitaê">VISIT<span>AÊ</span></span>', '<span class="brand-name" aria-label="Visitaê">Visit<span>aê</span></span>')
    .replace('<p class="solutions-common">Em todos os tours: captação presencial, tratamento das imagens, montagem da experiência, link para compartilhar e orientações de uso.</p>', '')
    .replace('<p class="form-note" id="form-note">Você continuará a conversa pelo WhatsApp, sem compromisso.</p>', '')
    .replace('<p class="solutions-complement">Precisa de uma página própria, mas seu espaço comporta o Tour Essencial? Podemos avaliar a página como um complemento ao projeto.</p>', '')
    .replace('<p class="asset-caption">Palace Hall · Tour produzido pela Tour Brasil360.</p>', '')
    .replace('<a class="text-link" href="https://maps.app.goo.gl/wMfgnJ47d7WYYSRbA" target="_blank" rel="noopener noreferrer">Ver um exemplo no Google Maps <svg class="icon" aria-hidden="true"><use href="#arrow-up"/></svg></a>', '')
    .replace('<p class="small-note">A publicação depende das regras e da elegibilidade do Google, sem garantia de aprovação, posicionamento ou permanência das imagens. Imóveis individuais de temporada, por exemplo, possuem restrições.</p>', '')
    .replace('        <p class="asset-caption">Holm Hotel · Tour produzido pela Clear Pano.</p>\n', '')
    .replace('        <p class="demo-attribution" id="demo-attribution">Holm Hotel · Tour produzido pela Clear Pano.</p>\n', '')
    .replace(' Projeto conceitual, não realizado para cliente.', '');
  const existingPage = read('dist/index.html')
    .replace(/    <section class="activation-section[\s\S]*?<\/section>\n\n/, '')
    .replace('  <link rel="stylesheet" href="activation-magazine.css?v=visitae-revista-frase">\n', '');
  assert.equal(withoutTestimonials(existingPage), withoutTestimonials(expected));
  assert.equal(Object.keys(pageComponents).length, 18);
});

test('unrelated styles, fonts, portraits, illustrations, municipal data and prepared UI modules are byte identical', () => {
  for (const [path, expected] of Object.entries(baseline)) {
    if (['app.js', 'config.js', 'testimonials.js', 'testimonials.css'].includes(path)) continue;
    if (path === 'styles.css') {
      const unrelated = read('dist/styles.css')
        .replace(read('src/styles/Footer.css'), read('tests/fixtures/original-footer.css'))
        .replace('.brand-name { color:var(--ink); white-space:nowrap; font-family:var(--display); font-weight:700; line-height:1; letter-spacing:-.065em; }', '.brand-name { color:var(--ink); white-space:nowrap; }')
        .replace('/* Optical weight requested for this title; Instrument Serif keeps its real 400 weight. */\n.personal-copy h2 em { font-weight:400; font-synthesis:none; -webkit-text-stroke:.3px currentColor; }\n', '');
      assert.equal(hash(unrelated), expected, path);
    } else assert.equal(hash(readFileSync(new URL(`dist/${path}`, root))), expected, path);
  }
});

test('existing tour and contact behavior is preserved after removing the inline credit update', () => {
  const app = read('dist/app.js');
  const start = app.indexOf('const demos = ') + 'const demos = '.length;
  const end = app.indexOf(';\n', start);
  const dataSource = read('src/data/tours.mjs');
  const originalExpression = dataSource.slice(dataSource.indexOf('export const tours = ') + 'export const tours = '.length).trim().slice(0, -1);
  const restored = (app.slice(0, start) + originalExpression + app.slice(end))
    .replace("    $('#demo-external').href = demo.external;", "    $('#demo-attribution').textContent = demo.attribution;\n    $('#demo-external').href = demo.external;")
    .replace("$('.demo-context'), $('.demo-bottom')", "$('.demo-context'), $('.demo-attribution'), $('.demo-bottom')");
  assert.equal(hash(restored), baseline['app.js']);
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
