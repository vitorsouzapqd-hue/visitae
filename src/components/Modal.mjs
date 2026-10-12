// Each owner preserves its native dialog behavior and media lifecycle.
export function Modal({ attributes = '', content = '' } = {}) {
  return `<dialog${attributes}>${content}</dialog>`;
}
