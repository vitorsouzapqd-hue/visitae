'use strict';

(() => {
  const state = document.querySelector('#business-state');
  const city = document.querySelector('#business-city');
  const field = document.querySelector('#city-field');
  const list = document.querySelector('#city-options');
  const help = document.querySelector('#city-help');
  if (!state || !city || !field || !list || !help) return;
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();
  let dataset;
  let cities = [];
  let matches = [];
  let active = -1;
  let mode = 'idle';
  let revision = 0;

  const close = () => {
    list.hidden = true;
    city.setAttribute('aria-expanded', 'false');
    city.removeAttribute('aria-activedescendant');
    active = -1;
  };
  const validate = () => {
    const exact = cities.find(item => normalize(item.name) === normalize(city.value));
    city.setCustomValidity(city.value && !city.value.trim() ? 'Informe a cidade do estabelecimento.' : mode === 'ready' && city.value.trim() && !exact ? 'Escolha uma cidade entre as sugestões do estado selecionado.' : '');
    if (exact) city.value = exact.name;
    city.dispatchEvent(new Event('cityvalidationchange'));
  };
  const choose = item => {
    city.value = item.name;
    validate();
    close();
    help.textContent = '';
    city.dispatchEvent(new Event('change', { bubbles: true }));
    city.focus({ preventScroll: true });
  };
  const render = () => {
    if (mode !== 'ready') return close();
    const query = normalize(city.value);
    matches = cities.filter(item => normalize(item.name).includes(query)).slice(0, 12);
    active = -1;
    list.replaceChildren();
    city.removeAttribute('aria-activedescendant');
    matches.forEach((item, index) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.role = 'option';
      option.tabIndex = -1;
      option.id = `city-option-${index}`;
      option.setAttribute('aria-selected', 'false');
      option.textContent = item.name;
      option.addEventListener('mousedown', event => event.preventDefault());
      option.addEventListener('click', () => choose(item));
      list.append(option);
    });
    list.hidden = !matches.length;
    city.setAttribute('aria-expanded', String(Boolean(matches.length)));
    help.textContent = matches.length ? 'Digite para filtrar e escolha sua cidade.' : 'Nenhuma cidade encontrada neste estado. Confira o nome digitado.';
  };
  const load = async event => {
    const current = ++revision;
    close();
    cities = [];
    if (event) city.value = '';
    city.setCustomValidity('');
    city.disabled = !state.value;
    city.removeAttribute('aria-busy');
    if (!state.value) {
      mode = 'idle';
      city.placeholder = 'Selecione o estado primeiro';
      help.textContent = '';
      return;
    }
    mode = 'loading';
    city.placeholder = 'Digite o nome da cidade';
    city.setAttribute('aria-busy', 'true');
    validate();
    help.textContent = 'Carregando cidades… Você já pode digitar sua cidade.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      if (!dataset) {
        const response = await fetch('assets/municipalities.json', { signal: controller.signal });
        if (!response.ok) throw new Error('City list unavailable');
        const data = await response.json();
        if (!Object.values(data).every(items => Array.isArray(items) && items.every(item => typeof item.name === 'string'))) throw new Error('Invalid city list');
        dataset = data;
      }
      if (current !== revision) return;
      cities = dataset[state.value] || [];
      if (!cities.length) throw new Error('State unavailable');
      mode = 'ready';
      help.textContent = 'Digite para filtrar e escolha sua cidade.';
    } catch {
      if (current !== revision) return;
      mode = 'manual';
      help.textContent = 'A lista não carregou. Você pode digitar sua cidade e continuar.';
    } finally {
      clearTimeout(timeout);
      if (current === revision) {
        city.removeAttribute('aria-busy');
        validate();
        if (document.activeElement === city) render();
      }
    }
  };
  state.addEventListener('change', load);
  city.addEventListener('input', () => { validate(); render(); });
  city.addEventListener('focus', render);
  city.addEventListener('keydown', event => {
    if (event.key === 'Escape') { close(); return; }
    if (event.key === 'Enter' && !list.hidden && active >= 0) {
      event.preventDefault();
      choose(matches[active]);
      return;
    }
    if (!['ArrowDown', 'ArrowUp'].includes(event.key) || mode !== 'ready') return;
    event.preventDefault();
    if (list.hidden) render();
    if (!matches.length) return;
    active = active < 0 ? (event.key === 'ArrowDown' ? 0 : matches.length - 1) : (active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
    [...list.children].forEach((option, index) => option.setAttribute('aria-selected', String(index === active)));
    city.setAttribute('aria-activedescendant', list.children[active].id);
    list.children[active].scrollIntoView({ block: 'nearest' });
  });
  field.addEventListener('focusout', event => {
    if (!field.contains(event.relatedTarget)) { validate(); close(); }
  });
  if (state.value) load();
})();
