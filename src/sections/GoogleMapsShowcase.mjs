import { Button } from "../components/Button.mjs";

export function GoogleMapsShowcase() {
  return `<section class="maps-section section container" id="google" aria-labelledby="maps-title"><div class="maps-copy"><p class="eyebrow">04 / TAMBÉM NO GOOGLE MAPS</p><h2 id="maps-title">Encontraram seu negócio no Google. Agora podem conhecer por dentro.</h2><p>Além de endereço, horários e fotografias, estabelecimentos elegíveis podem apresentar panoramas 360 no Google Maps.</p>
<p>Mais uma maneira de mostrar seu espaço a quem já está procurando por você.</p></div><div class="maps-visual"><div class="maps-photo"><img src="assets/palace-hall.webp" alt="Interior do Palace Hall, referência pública no Google Maps produzida pela Tour Brasil360" loading="lazy" width="1280" height="720">${Button({ tag: "button", attributes: " class=\"button button-light\" type=\"button\" data-demo-start=\"evento\"", content: `<svg class="icon" aria-hidden="true" focusable="false"><use href="#pin"/></svg> Ver um exemplo no Google Maps <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>` })}</div></div></section>`;
}
