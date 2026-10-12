import { Button } from "./Button.mjs";
import { Modal } from "./Modal.mjs";

export function OwnPageDialog() {
  return `${Modal({ attributes: " class=\"page-demo-dialog\" id=\"page-demo-dialog\" aria-labelledby=\"page-demo-title\" aria-describedby=\"page-demo-note\"", content: `
    <div class="page-demo-header"><div><h2 id="page-demo-title">Modelo de página — Vila Terroir</h2><p id="page-demo-note">Demonstração conceitual de página para hospedagem.</p></div>${Button({ tag: "button", attributes: " class=\"button button-small button-dark\" id=\"page-demo-close\" type=\"button\" autofocus", content: `Fechar` })}</div>
    <div class="page-demo-frame" id="page-demo-frame"></div>
    <div class="page-demo-footer">${Button({ tag: "a", attributes: " class=\"text-link\" id=\"page-demo-external\" href=\"https://vila-terroir-demo-vitor.vitorvelame.chatgpt.site\" target=\"_blank\" rel=\"noopener noreferrer\"", content: `Abrir demonstração em nova aba` })}</div>
  ` })}`;
}
