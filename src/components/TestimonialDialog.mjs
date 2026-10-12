import { Modal } from "./Modal.mjs";

export function TestimonialDialog() {
  return `${Modal({ attributes: " class=\"testimonial-dialog\" id=\"testimonial-dialog\" aria-labelledby=\"testimonial-dialog-title\"", content: `
    <button class="testimonial-dialog-close" type="button" aria-label="Fechar relato">Fechar <span aria-hidden="true">×</span></button>
    <div class="testimonial-dialog-content">
      <p class="eyebrow" id="testimonial-dialog-label"></p>
      <div class="testimonial-player" id="testimonial-player" hidden></div>
      <h2 id="testimonial-dialog-title"></h2>
      <p class="testimonial-dialog-intro" id="testimonial-dialog-intro"></p>
      <p class="testimonial-video-error" id="testimonial-video-error" role="status" hidden>Não foi possível carregar este vídeo. Tente novamente mais tarde; a transcrição continua disponível abaixo.</p>
      <p class="testimonial-video-error" id="testimonial-captions-error" role="status" hidden>As legendas não carregaram. Você pode acompanhar o relato pela transcrição abaixo.</p>
      <p class="testimonial-client" id="testimonial-client" hidden></p>
      <details class="testimonial-transcript" id="testimonial-transcript" hidden><summary>Ler transcrição</summary><p></p></details>
    </div>
  ` })}`;
}
