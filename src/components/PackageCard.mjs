import { BrandLogo } from './BrandLogo.mjs';
import { Button } from './Button.mjs';

export function PackageCard(item) {
  const logo = BrandLogo({ attributes: ' class="brand-name" aria-label="Visitaê"', uppercase: false });
  const features = item.featuresHtml === null ? '' : `<ul class="check-list">${item.featuresHtml}</ul>`;
  const additional = item.additionalHtml.map(text => `<p class="solution-additional">${text}</p>`).join('\n');
  const cta = Button({ tag: 'a', attributes: item.buttonAttributes, content: item.buttonHtml });
  return `<article class="${item.className}"><div class="solution-top"><span class="solution-number">${item.number}</span><span class="solution-label">${logo} ${item.label}</span></div><h3>${item.heading}</h3><p>${item.descriptionHtml}</p>${features}${additional}${cta}</article>`;
}
