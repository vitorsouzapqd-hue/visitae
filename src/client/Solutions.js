$$('[data-solution]').forEach(button => button.addEventListener('click', () => {
  $('#solution-choice').value = button.dataset.solution;
  $('#solution-choice').dispatchEvent(new Event('change', { bubbles: true }));
}));
