import { BrandLogo } from "../components/BrandLogo.mjs";
import { Button } from "../components/Button.mjs";
import { faqs } from '../data/faq.mjs';
import { FAQItem } from '../components/FAQItem.mjs';

export function FAQ() {
  return `<section class="faq-section section container" aria-labelledby="faq-title"><div class="faq-intro"><p class="eyebrow">08 / ANTES DE CONVERSARMOS</p><h2 id="faq-title">Algumas dúvidas<br><em>bem práticas.</em></h2><p>Tem outra pergunta?<br>A gente conversa sobre ela.</p>${Button({ tag: "a", attributes: " class=\"text-link\" href=\"#contato\"", content: `<span>Falar com a ${BrandLogo({ attributes: " class=\"brand-name\"", uppercase: false })}</span> <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>` })}</div><div class="faq-list">${faqs.map(FAQItem).join('')}</div></section>`;
}
