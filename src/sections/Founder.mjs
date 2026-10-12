import { BrandLogo } from "../components/BrandLogo.mjs";
import { Button } from "../components/Button.mjs";

export function Founder() {
  return `<section class="personal-section container"><div class="personal-mark" aria-hidden="true"><span>v.</span><svg viewBox="0 0 260 180"><ellipse cx="130" cy="90" rx="122" ry="48" transform="rotate(-25 130 90)"/></svg></div><div class="personal-copy"><p class="eyebrow">POR TRÁS DA ${BrandLogo({ attributes: " class=\"brand-name\" aria-label=\"Visitaê\"", uppercase: true })}</p><h2>Prazer, sou <em>o Vítor.</em></h2><p>Estou à frente da Visitaê, uma empresa criada para ajudar negócios a apresentar seus espaços pela internet de uma maneira mais completa e interativa.</p>
<p>Quero que o proprietário de um estabelecimento tenha uma forma prática de mostrar sua estrutura e que o interessado possa conhecer melhor o lugar antes de chegar.</p>
<p>Por isso, meu trabalho começa entendendo o que você deseja apresentar e termina com uma experiência pronta para compartilhar.</p>${Button({ tag: "a", attributes: " class=\"text-link\" href=\"#contato\" ", content: `<span>Conversar com a ${BrandLogo({ attributes: " class=\"brand-name\"", uppercase: false })}</span> <svg class="icon" aria-hidden="true"><use href="#arrow-up"/></svg>` })}</div></section>`;
}
