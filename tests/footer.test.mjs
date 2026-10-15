import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { Footer } from '../src/layout/Footer.mjs';
import { footerChannels } from '../src/data/footer-channels.mjs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('provisional channels remain visible without external links until individually enabled', () => {
  const inactive = Footer({channels:footerChannels.map(channel=>({...channel,enabled:false}))});
  assert.ok(inactive.includes('Visitae.bio'));
  assert.ok(inactive.includes('@visitae360'));
  assert.equal((inactive.match(/class="footer-channel"/g) || []).length, 2);
  for (const channel of footerChannels) {
    assert.equal(channel.enabled, channel.id==='site');
    assert.ok(!inactive.includes(`href="${channel.url}"`));
  }
  for (const activeIds of [['site'], ['instagram'], ['site', 'instagram']]) {
    const html = Footer({ channels: footerChannels.map(channel => ({ ...channel, enabled: activeIds.includes(channel.id) })) });
    for (const channel of footerChannels) {
      assert.equal(html.includes(`href="${channel.url}"`), activeIds.includes(channel.id));
    }
    if (activeIds.includes('instagram')) {
      assert.ok(html.includes('href="https://www.instagram.com/visitae360/" target="_blank" rel="noopener noreferrer"'));
      assert.ok(html.includes('(abre em nova aba)'));
    }
    assert.equal(html.includes('Canais em preparação.'), activeIds.length < 2);
  }
});

test('built footer preserves identity, real navigation targets and existing privacy dialog', () => {
  const page = read('../dist/index.html');
  const footer = page.match(/<footer class="site-footer[\s\S]*?<\/footer>/)[0];
  assert.equal((page.match(/<footer\b/g) || []).length, 1);
  assert.ok(footer.includes('Visit<span>aê</span>'));
  assert.ok(footer.includes('A visita começa antes da chegada.'));
  assert.ok(footer.includes('Todos os direitos reservados.'));
  assert.ok(footer.includes('id="credits-open"'));
  assert.ok(page.includes('id="credits-dialog"'));
  for (const [, id] of footer.matchAll(/href="#([^"]+)"/g)) assert.ok(page.includes(`id="${id}"`), id);
  for (const label of ['Como funciona', 'Benefícios', 'Planos', 'Perguntas frequentes', 'Voltar ao início', 'Encontre a']) assert.ok(footer.includes(label));
});

test('copyright year updates in the browser after a calendar rollover', () => {
  const year = { textContent: '' };
  class FutureDate extends Date { getFullYear() { return 2032; } }
  vm.runInNewContext(read('../src/client/Footer.js'), { $: selector => {
    assert.equal(selector, '#year');
    return year;
  }, Date: FutureDate });
  assert.equal(year.textContent, 2032);
});
