export function FAQItem({ question, answerHtml }) {
  return `<details><summary>${question}<span aria-hidden="true">+</span></summary><div>${answerHtml}</div></details>`;
}
