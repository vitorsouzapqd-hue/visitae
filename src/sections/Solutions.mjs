import { packages } from '../data/packages.mjs';
import { PackageCard } from '../components/PackageCard.mjs';

export function Solutions() {
  return `<section class="solutions-section section" id="solucoes" aria-labelledby="solutions-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">06 / CONHEÇA AS SOLUÇÕES</p><h2 id="solutions-title">Cada espaço pede um <em>tipo de visita.</em></h2></div><div class="section-intro"><p>Alguns estabelecimentos precisam mostrar poucos ambientes. Outros têm uma estrutura maior ou precisam reunir tudo em uma página própria.</p></div></div><div class="solutions-grid">${packages.map(PackageCard).join('')}</div><div class="solutions-note"><p>Produção por projeto, sem mensalidade obrigatória de acompanhamento. Custos e renovações de hospedagem, domínio ou plataformas são esclarecidos no orçamento.</p></div></div></section>`;
}
