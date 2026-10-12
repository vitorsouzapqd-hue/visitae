import { Button } from "../components/Button.mjs";

export function TourShowcase() {
  return `<section class="demo-section section" id="experimente" aria-labelledby="demo-title">
      <div class="container">
        <div class="section-heading demo-heading"><div><p class="eyebrow">01 / EXPERIMENTE A POSSIBILIDADE</p><h2 id="demo-title">A melhor explicação<br>é <em>entrar.</em></h2></div><p>Arraste a imagem, escolha para onde olhar e explore os ambientes. No celular, é só usar o dedo.</p></div>
        <div class="demo-tabs" role="tablist" aria-label="Ambientes para explorar"><button id="tab-hotel" role="tab" type="button" aria-selected="true" aria-controls="demo-panel" data-demo="hotel"><span>Hospedagem</span></button><button id="tab-evento" role="tab" type="button" aria-selected="false" aria-controls="demo-panel" tabindex="-1" data-demo="evento"><span>Espaço de eventos</span></button><button id="tab-esportes" role="tab" type="button" aria-selected="false" aria-controls="demo-panel" tabindex="-1" data-demo="esportes"><span>Espaço esportivo</span></button></div>
        <div class="demo-layout" id="demo-panel" role="tabpanel" aria-labelledby="tab-hotel">
          <div class="viewer-wrap" id="viewer-wrap">
            <div class="viewer-toolbar"><span><span class="status-dot"></span> <span id="viewer-label">HOLM HOTEL · TOUR 360</span></span><button class="viewer-expand" type="button" aria-label="Ampliar tour" title="Ampliar tour"><svg class="icon" aria-hidden="true" focusable="false"><use href="#expand"/></svg></button></div>
            <div class="viewer" id="viewer">
              <div class="viewer-cover" id="viewer-cover"><img id="viewer-image" src="assets/tour-cover.webp" alt="Interior do Holm Hotel em 360" width="1179" height="664" loading="lazy"><div class="cover-shade"></div><button type="button" class="viewer-start" id="viewer-start"><span class="play-disc"><svg class="icon" aria-hidden="true" focusable="false"><use href="#play"/></svg></span><strong>Começar a visita</strong><span>Explore no seu ritmo</span></button></div>
              <p class="viewer-loading" id="viewer-loading" role="status" hidden>Preparando sua visita…</p>
            </div>
            <div class="viewer-actions">${Button({ tag: "a", attributes: " class=\"text-link\" id=\"demo-external\" href=\"https://tours.clearpano.com/T2ZhHe0r\" target=\"_blank\" rel=\"noopener noreferrer\"", content: `Abrir tour em nova aba <svg class="icon" aria-hidden="true"><use href="#arrow-up"/></svg>` })}<button id="viewer-reset" type="button" disabled>Voltar à prévia</button></div>
            <button class="viewer-close" id="viewer-close" type="button" hidden>Fechar tour ampliado <span aria-hidden="true">×</span></button>
          </div>
          <aside class="demo-context"><span class="demo-kind" id="demo-kind">TOUR PERSONALIZADO</span><h3 id="demo-name">Uma hospedagem. Outro jeito de conhecer.</h3><p id="demo-description">Uma foto mostra o quarto por um ângulo. Agora experimente olhar ao redor.</p><div class="demo-question"><span>O QUE ESSA EXPERIÊNCIA MOSTRA</span><p id="demo-question">&quot;Como é esse ambiente para além do enquadramento das fotos?&quot;</p></div></aside>
        </div>
        <p class="demo-attribution" id="demo-attribution">Holm Hotel · Tour produzido pela Clear Pano.</p>
        <div class="demo-bottom"><p>Já imaginou seus clientes conhecendo seu espaço assim?</p>${Button({ tag: "a", attributes: " class=\"button button-lime\" href=\"#contato\"", content: `Quero um tour para meu espaço <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>` })}</div>
      </div>
    </section>`;
}
