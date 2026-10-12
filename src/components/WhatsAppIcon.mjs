import { brandIcons } from '../ui/brand-icons.mjs';

export function WhatsAppIcon({ attributes, symbol = false } = {}) {
  const brand = brandIcons.whatsapp;
  attributes ??= symbol
    ? ` id="whatsapp" viewBox="${brand.viewBox}"`
    : ` class="icon" viewBox="${brand.viewBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"`;
  if (symbol) return `<symbol${attributes}><path fill="currentColor" stroke="none" d="${brand.path}"/></symbol>`;
  return `<svg${attributes}><use href="#whatsapp"/></svg>`;
}
