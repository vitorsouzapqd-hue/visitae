import { BrandLogo } from "../components/BrandLogo.mjs";
import { Button } from "../components/Button.mjs";

export function Header() {
  return `<header class="site-header" id="topo">
    <div class="container header-inner">
      <a class="brand brand-wordmark" href="#inicio" aria-label="Visitaê, início">${BrandLogo({ attributes: " class=\"brand-name\"", uppercase: false })}</a>
      <nav class="desktop-nav" aria-label="Navegação principal"><a href="#experimente">Experimente</a><a href="#possibilidades">Para seu espaço</a><a href="#solucoes">Soluções</a><a href="#processo">Como funciona</a></nav>
      ${Button({ tag: "a", attributes: " class=\"button button-small button-lime header-contact\" href=\"#contato\"", content: `Solicitar orçamento <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>` })}
      <button class="menu-toggle" type="button" aria-controls="mobile-nav" aria-expanded="false" aria-label="Abrir menu"><span></span><span></span></button>
    </div>
    <nav id="mobile-nav" class="mobile-nav" aria-label="Navegação no celular" hidden><a href="#experimente">Experimente</a><a href="#possibilidades">Para seu espaço</a><a href="#solucoes">Soluções</a><a href="#processo">Como funciona</a><a href="#contato">Pedir orçamento</a></nav>
  </header>`;
}
