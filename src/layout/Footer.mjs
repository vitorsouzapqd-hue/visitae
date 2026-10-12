import { BrandLogo } from "../components/BrandLogo.mjs";
import { Button } from "../components/Button.mjs";

export function Footer() {
  return `<footer class="site-footer"><div class="container footer-top"><a class="brand brand-wordmark" href="#inicio" aria-label="Visitaê, início">${BrandLogo({ attributes: " class=\"brand-name\"", uppercase: false })}</a><p><strong>A visita começa antes da chegada.</strong></p>${Button({ tag: "a", attributes: " href=\"#inicio\" class=\"text-link\"", content: `Voltar ao início <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>` })}</div><div class="container footer-bottom"><span>© <span id="year">2026</span> ${BrandLogo({ attributes: " class=\"brand-name\"", uppercase: false })}</span><button type="button" class="footer-button" id="credits-open">Créditos e privacidade</button><span>Tours virtuais 360 e páginas próprias para apresentar estabelecimentos de maneira interativa.</span></div></footer>`;
}
