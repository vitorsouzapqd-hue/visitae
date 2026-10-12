import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url));

test('the complete magazine section appears immediately before plans without another CTA', () => {
  const html = read('dist/index.html').toString('utf8');
  const section = html.match(/<section class="activation-section[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.match(html, /<\/section>\s*<section class="solutions-section/, 'Magazine must lead directly into plans');
  const rest = html.slice(html.indexOf(section) + section.length);
  assert.match(rest, /^\s*<section class="solutions-section/);
  assert.equal((html.match(/id="revista"/g) || []).length, 1);
  assert.equal((section.match(/<li>/g) || []).length, 3);
  assert.doesNotMatch(section, /<(?:a|button)\b|R\$|bônus/i);
  const text = section.replace(/<\/?(?:strong|em)\b[^>]*>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  for (const expected of [
    'INCLUÍDA NA SUA CONTRATAÇÃO',
    'Seu tour não chega sozinho.',
    'Você vai ter uma nova maneira de apresentar seu espaço. Mas talvez esteja pensando:',
    '“Quando meu tour ficar pronto, como faço as pessoas chegarem até ele?”',
    'Foi para responder a essa pergunta que criamos a Revista de Ativação Visitaê.',
    'Um guia impresso para ajudar você a preparar seus canais de divulgação e colocar sua experiência 360° em circulação.',
    'Um caminho para aproveitar melhor seu tour.',
    'Descubra como Instagram, WhatsApp Business e Google ajudam as pessoas a encontrar seu negócio e chegar até a experiência virtual.',
    'Depois que seu tour estiver pronto, siga um desafio prático de sete dias para começar a divulgá-lo.',
    'Tenha 30 ideias de comunicação, referências e modelos para continuar apresentando seu espaço.',
    'A revista é entregue na contratação. O desafio começa depois que seu tour fica pronto.',
    'Ajudar você a colocá-la em circulação também importa.',
  ]) assert.ok(text.includes(expected), expected);
  // Reading order also supplies the mobile order without duplicated copy or images.
  assert.ok(section.indexOf('activation-intro') < section.indexOf('activation-visual'));
  assert.ok(section.indexOf('activation-visual') < section.indexOf('activation-guide'));
});

test('the magazine uses the exact supplied PNG with its original dimensions', () => {
  const png = read('dist/assets/revista-ativacao-visitae.png');
  assert.equal(createHash('sha256').update(png).digest('hex'), '21e547f2bd178a407945e035d5c438d5778b83264e414718493567f48f6d9c39');
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const html = read('dist/index.html').toString('utf8');
  assert.match(html, new RegExp(`src="assets/revista-ativacao-visitae.png"[^>]*width="${width}" height="${height}"[^>]*loading="lazy"`));
});

test('the section palette keeps body copy and accent text readable on the dark background', () => {
  const css = read('src/styles/ActivationMagazine.css').toString('utf8');
  function luminance(token) {
    const hex = css.match(new RegExp(`${token}: #([a-f0-9]{6});`))[1];
    const channels = hex.match(/../g).map(value => {
      const s = parseInt(value, 16) / 255;
      return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
    });
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  }
  const background = luminance('--activation-background');
  for (const token of ['--activation-text', '--activation-accent']) {
    const foreground = luminance(token);
    const contrast = (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05);
    assert.ok(contrast >= 4.5, `${token}: ${contrast.toFixed(2)}:1`);
  }
});
