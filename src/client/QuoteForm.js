
// Only transient page state: no storage, analytics or lead submission.
const whatsapp = String(config.whatsapp || '').replace(/\D/g, '');
const form = $('#contact-form');
const recovery = $('#contact-recovery');
let preparedMessage = '';
let nativeSubmit = false;
const fields = $$('input, select', form);
const errorMessages = {
  business: 'Informe o nome do estabelecimento.',
  state: 'Selecione o estado do estabelecimento.',
  city: 'Informe a cidade do estabelecimento.',
};
fields.forEach(field => {
  const label = field.closest('label');
  const caption = document.createElement('span');
  caption.id = `${field.id}-label`;
  while (label.firstChild !== field) caption.append(label.firstChild);
  label.prepend(caption);
  field.setAttribute('aria-labelledby', caption.id);
  const error = document.createElement('span');
  error.className = 'field-error';
  error.id = `${field.id}-error`;
  error.hidden = true;
  label.append(error);
  field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
});
function showFieldError(field, force = false) {
  if (!force && field.getAttribute('aria-invalid') !== 'true') return;
  const error = $(`#${field.id}-error`);
  const invalid = !field.disabled && !field.validity.valid;
  field.setAttribute('aria-invalid', String(invalid));
  error.hidden = !invalid;
  error.textContent = invalid ? (field.validity.valueMissing ? errorMessages[field.name] : field.validationMessage) : '';
}
function validateBusiness() {
  const business = $('#business-name');
  business.setCustomValidity(business.value.trim() ? '' : errorMessages.business);
}
function clearPrepared() {
  preparedMessage = '';
  recovery.hidden = true;
  $('#briefing-result').hidden = true;
  $('#briefing-result').value = '';
  $('#copy-status').textContent = '';
  $('#contact-status').textContent = '';
  $('#whatsapp-retry').removeAttribute('href');
}
form.addEventListener('input', event => {
  validateBusiness();
  if (fields.includes(event.target)) showFieldError(event.target);
  clearPrepared();
});
form.addEventListener('change', event => {
  if (fields.includes(event.target)) showFieldError(event.target);
  clearPrepared();
});
$('#business-city').addEventListener('cityvalidationchange', () => showFieldError($('#business-city')));
form.addEventListener('invalid', event => { event.preventDefault(); showFieldError(event.target, true); }, true);

function buildBudgetMessage(values) {
  const value = key => String(values.get(key) || '').trim();
  const lines = [
    'Olá, equipe Visitaê! Conheci o trabalho de vocês e gostaria de conversar sobre a possibilidade de criar um tour virtual 360 para meu espaço.',
    '',
    'Informações do meu estabelecimento:',
    '',
    `Nome: ${value('business')}`,
    `Localização: ${value('city')} / ${value('state')}`,
  ];
  if (value('neighborhood')) lines.push(`Bairro: ${value('neighborhood')}`);
  if (value('type')) lines.push(`Tipo de espaço: ${value('type')}`);
  if (value('solution')) lines.push(`Tenho interesse em: ${value('solution')}`);
  if (value('link')) lines.push(`Instagram ou site: ${value('link')}`);
  lines.push('', 'Gostaria de entender como funcionaria o projeto e solicitar um orçamento.');
  return lines.join('\n');
}

form.addEventListener('submit', event => {
  nativeSubmit = false;
  validateBusiness();
  fields.forEach(field => showFieldError(field, true));
  if (!form.checkValidity()) {
    event.preventDefault();
    $('#contact-status').textContent = 'Confira os campos indicados para preparar sua mensagem.';
    fields.find(field => !field.disabled && !field.validity.valid)?.focus();
    return;
  }
  preparedMessage = buildBudgetMessage(new FormData(form));
  const url = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(preparedMessage)}` : '';
  const retry = $('#whatsapp-retry');
  retry.hidden = !url;
  if (url) retry.href = url;
  recovery.hidden = false;
  $('#contact-status').textContent = 'Mensagem preparada. Revise os dados e envie pelo WhatsApp.';
  $('#copy-status').textContent = '';
  $('#briefing-result').hidden = true;
  if (url) nativeSubmit = true;
  else event.preventDefault();
});
// Native form navigation opens a tab directly from the submit action. Only the
// prepared message leaves the page; individual fields are removed from the GET.
form.addEventListener('formdata', event => {
  if (!nativeSubmit) return;
  nativeSubmit = false;
  [...event.formData.keys()].forEach(key => event.formData.delete(key));
  event.formData.set('text', preparedMessage);
});
if (whatsapp) {
  form.action = `https://wa.me/${whatsapp}`;
  form.method = 'get';
  form.target = '_blank';
  form.rel = 'noopener noreferrer';
}
$('#copy-message').addEventListener('click', async () => {
  if (!preparedMessage) return;
  const message = preparedMessage;
  try {
    await navigator.clipboard.writeText(message);
    if (preparedMessage !== message) return;
    $('#copy-status').textContent = 'Mensagem copiada. Cole no WhatsApp e revise antes de enviar.';
  } catch {
    if (preparedMessage !== message) return;
    const result = $('#briefing-result');
    result.value = message;
    result.hidden = false;
    result.focus();
    result.select();
    $('#copy-status').textContent = 'Selecione e copie a mensagem abaixo para colar no WhatsApp.';
  }
});
// Keep native validation if this script fails to initialize.
form.noValidate = true;
