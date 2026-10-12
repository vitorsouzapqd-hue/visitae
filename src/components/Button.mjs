// Attributes/content come only from our source templates, never visitor input.
export function Button({ tag = 'button', attributes = '', content = '' } = {}) {
  if (tag !== 'button' && tag !== 'a') throw new TypeError('Button must be an anchor or native button');
  return `<${tag}${attributes}>${content}</${tag}>`;
}
