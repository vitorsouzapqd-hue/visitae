import { Button } from "../components/Button.mjs";

export function Hero() {
  return `<section class="hero container" id="inicio" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow hero-badge">TOURS VIRTUAIS 360°</p>
        <h1 id="hero-title">Seu próximo cliente<br>já pode visitar<br><em>seu espaço.</em></h1>
        <p class="hero-lead">Antes mesmo de sair de casa.</p>
        <p class="hero-description">Seu espaço tem mais para mostrar do que cabe em algumas fotos.</p>
<p class="hero-description">Com uma visita virtual 360°, seus clientes podem explorar os ambientes, escolher para onde olhar e conhecer melhor o lugar antes de chegar.</p>
        <div class="hero-actions">${Button({ tag: "a", attributes: " class=\"button button-dark\" href=\"#experimente\" data-demo-start=\"hotel\"", content: `Experimentar um tour <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>` })}${Button({ tag: "a", attributes: " class=\"text-link\" href=\"#contato\"", content: `Quero isso para meu espaço <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow"/></svg>` })}</div>
      </div>
      <div class="hero-visual">
        <button class="hero-tour" type="button" data-demo-start="hotel" aria-label="Explorar o Holm Hotel em 360">
          <img src="assets/tour-cover.webp" alt="Suíte do Holm Hotel no tour produzido pela Clear Pano" width="1179" height="664" fetchpriority="high">
          <span class="hero-photo-shade"></span>
          <span class="visual-tag"><span class="status-dot"></span> VOCÊ ESCOLHE PARA ONDE OLHAR</span>
          <span class="orbit-mark" aria-hidden="true"><span>360<span class="degree">°</span></span><svg viewBox="0 0 240 170"><ellipse cx="120" cy="85" rx="108" ry="41" transform="rotate(-22 120 85)"/></svg></span>
          <span class="hero-play"><span class="play-disc"><svg class="icon" aria-hidden="true" focusable="false"><use href="#play"/></svg></span><span>Não precisa imaginar.<br><strong>Entre e explore.</strong></span><svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg></span>
        </button>
      </div>
    </section>`;
}
