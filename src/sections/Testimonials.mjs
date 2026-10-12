import { Button } from "../components/Button.mjs";

export function Testimonials() {
  return `<section class="testimonials-section section" id="depoimentos" aria-labelledby="testimonials-title" hidden>
      <div class="container">
        <div class="section-heading testimonials-heading">
          <div><p class="eyebrow">05 / DEPOIMENTOS</p><h2 id="testimonials-title">Quem contratou<br><em>conta como foi.</em></h2></div>
          <p>Cada relato apresenta uma experiência diferente com o tour virtual: mostrar os ambientes, compartilhar pelo WhatsApp, apresentar a estrutura no Google e facilitar o uso do material depois da entrega.</p>
        </div>
        <div class="testimonials-carousel" role="region" aria-roledescription="carrossel" aria-label="Relatos do protótipo">
          <div class="testimonials-track" id="testimonials-track" role="group" tabindex="0" aria-label="Relatos. Use as setas do teclado para navegar."></div>
          <div class="testimonials-navigation">
            <p class="testimonials-hint">Explore os relatos <span aria-hidden="true">↔</span></p>
            <div class="testimonials-dots" role="group" aria-label="Ir para um depoimento"></div>
            <div class="testimonials-arrows"><span class="testimonials-status" role="status" aria-live="polite" aria-atomic="true"></span><button type="button" class="testimonial-arrow testimonial-prev" aria-label="Depoimento anterior" aria-controls="testimonials-track"><svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow"/></svg></button><button type="button" class="testimonial-arrow testimonial-next" aria-label="Próximo depoimento" aria-controls="testimonials-track"><svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow"/></svg></button></div>
          </div>
        </div>
        <div class="testimonials-bottom"><p>Quer descobrir como essa experiência pode funcionar no seu estabelecimento?</p>${Button({ tag: "a", attributes: " class=\"text-link\" href=\"#contato\"", content: `Vamos conversar sobre seu espaço <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>` })}</div>
      </div>
    </section>`;
}
