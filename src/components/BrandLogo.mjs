// Markup is shared; existing classes select the approved light/dark colors.
export function BrandLogo({ attributes = ' class="brand-name"', uppercase = false } = {}) {
  return `<span${attributes}>${uppercase ? 'VISIT' : 'Visit'}<span>${uppercase ? 'AÊ' : 'aê'}</span></span>`;
}
