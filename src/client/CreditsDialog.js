
const credits = $('#credits-dialog');
$('#credits-open').addEventListener('click', () => { credits.showModal(); updateMobileContact(); });
$('.dialog-close', credits).addEventListener('click', () => credits.close());
credits.addEventListener('click', event => { if (event.target === credits) credits.close(); });
credits.addEventListener('close', updateMobileContact);
