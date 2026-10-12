// Native elements styled by the original styles.css. No global initialization.
function element(tag, className, text, doc) {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function Button({ text, variant = 'dark', small = false, type = 'button', disabled = false, document: doc = globalThis.document }) {
  if (!['dark', 'lime', 'light', 'outline'].includes(variant)) throw new TypeError('Unknown button variant');
  const button = element('button', `button button-${variant}${small ? ' button-small' : ''}`, text, doc);
  button.type = type;
  button.disabled = disabled;
  return button;
}

export function Label({ text, htmlFor, document: doc = globalThis.document }) {
  const label = element('label', '', text, doc);
  label.htmlFor = htmlFor;
  return label;
}

export function Input({ id, name, type = 'text', value = '', required = false, disabled = false, placeholder = '', autocomplete, describedBy, document: doc = globalThis.document }) {
  const input = element('input', '', undefined, doc);
  Object.assign(input, { id, name, type, value, required, disabled, placeholder });
  if (autocomplete) input.autocomplete = autocomplete;
  if (describedBy) input.setAttribute('aria-describedby', describedBy);
  return input;
}

export function Select({ id, name, options, value, required = false, disabled = false, describedBy, document: doc = globalThis.document }) {
  const select = element('select', '', undefined, doc);
  Object.assign(select, { id, name, required, disabled });
  if (describedBy) select.setAttribute('aria-describedby', describedBy);
  for (const item of options) {
    const option = element('option', '', item.label, doc);
    option.value = item.value;
    option.disabled = item.disabled === true;
    select.append(option);
  }
  if (value !== undefined) select.value = value;
  return select;
}

export function Accordion({ items, document: doc = globalThis.document }) {
  const list = element('div', 'faq-list', undefined, doc);
  for (const item of items) {
    const details = element('details', '', undefined, doc);
    details.open = item.open === true;
    const summary = element('summary', '', item.title, doc);
    const indicator = element('span', '', '+', doc);
    indicator.setAttribute('aria-hidden', 'true');
    summary.append(indicator);
    const content = element('div', '', undefined, doc);
    if (typeof item.content === 'string') content.append(element('p', '', item.content, doc));
    else content.append(item.content);
    details.append(summary, content);
    list.append(details);
  }
  return list;
}
