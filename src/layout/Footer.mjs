import { BrandLogo } from "../components/BrandLogo.mjs";
import { Button } from "../components/Button.mjs";
import { footerChannels } from "../data/footer-channels.mjs";

// Same outline vectors and dimensions used by ShareMarquee.
function channelIcon(id) {
  const shape = id === 'instagram'
    ? '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>'
    : '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>';
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${shape}</svg>`;
}

function channelItem(channel) {
  const content = `${channelIcon(channel.id)}<span>${channel.label}</span>`;
  if (!channel.enabled) return `<li><span class="footer-channel">${content}</span></li>`;
  const external = channel.id === 'instagram' ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<li><a class="footer-channel" href="${channel.url}"${external}>${content}${channel.id === 'instagram' ? '<span class="footer-sr-only"> (abre em nova aba)</span>' : ''}</a></li>`;
}

export function Footer({ channels = footerChannels } = {}) {
  return `<footer class="site-footer footer-section">
    <div class="container footer-main">
      <div class="footer-identity">
        <a class="brand brand-wordmark" href="#inicio" aria-label="Visitaê, início">${BrandLogo({ attributes: ' class="brand-name brand-name-on-dark"' })}</a>
        <p class="footer-slogan">A visita começa antes da chegada.</p>
      </div>
      <div class="footer-presence" role="group" aria-labelledby="footer-presence-title">
        <h2 id="footer-presence-title" class="footer-heading">Encontre a ${BrandLogo()}</h2>
        <ul class="footer-channels">${channels.map(channelItem).join('')}</ul>
        ${channels.some(channel => !channel.enabled) ? '<p class="footer-pending">Canais em preparação.</p>' : ''}
      </div>
      <nav class="footer-navigation" aria-labelledby="footer-nav-title">
        <h2 id="footer-nav-title" class="footer-heading">Explore</h2>
        <ul class="footer-links">
          <li><a href="#processo">Como funciona</a></li>
          <li><a href="#possibilidades">Benefícios</a></li>
          <li><a href="#solucoes">Planos</a></li>
          <li><a href="#faq-title">Perguntas frequentes</a></li>
        </ul>
      </nav>
    </div>
    <div class="container footer-meta">
      <div class="footer-utilities">
        <button type="button" class="footer-legal" id="credits-open">Créditos e privacidade</button>
        ${Button({ tag: 'a', attributes: ' href="#inicio" class="footer-back"', content: 'Voltar ao início <svg class="icon" aria-hidden="true" focusable="false"><use href="#arrow-up"/></svg>' })}
      </div>
      <p>© <span id="year">${new Date().getFullYear()}</span> ${BrandLogo({ attributes: ' class="brand-name brand-name-on-dark"' })}. Todos os direitos reservados.</p>
    </div>
  </footer>`;
}
