'use strict';

(() => {
  const section = document.querySelector('#depoimentos');
  if (!section) return;
  const configured = window.SITE_TESTIMONIALS || {};
  // Illustrative cards are available in every environment.
  const topics = [
  {
    "id": "ambientes",
    "tag": "ENTENDER A CASA",
    "name": "Marina",
    "role": "Anfitriã",
    "business": "Casa de temporada",
    "service": "Tour 360 + página própria",
    "title": "Eu tinha foto de tudo, mas o pessoal ainda ficava com dúvida.",
    "summary": "Principalmente sobre onde ficavam os quartos, a varanda e a área externa. Agora mando o link e a pessoa consegue conhecer a casa muito melhor.",
    "story": "\"Eu já tinha bastante foto da casa, sabe? Do quarto, da sala, da varanda... Só que era tudo separado.\n\nÀs vezes a pessoa me perguntava onde ficava determinada coisa, se a varanda era ligada à sala, como era a parte de fora. E eu ficava procurando outras fotos para tentar explicar.\n\nCom o tour ficou bem mais prático. Hoje, quando alguém demonstra interesse, eu mando a página e falo para dar uma olhada na casa.\n\nA pessoa consegue explorar os ambientes, ver como eles são e depois me chama para tirar alguma dúvida ou falar sobre a reserva.\n\nEu gosto porque é uma forma bem mais completa de mostrar a casa do que ficar mandando um monte de foto.\""
  },
  {
    "id": "atendimento",
    "tag": "FACILIDADE NO ATENDIMENTO",
    "name": "Rafael",
    "role": "Responsável pelo espaço",
    "business": "Espaço de eventos",
    "service": "Tour 360",
    "title": "Antes eu ficava caçando foto no celular para mandar.",
    "summary": "Era foto do salão, vídeo da área externa, mais foto da cozinha... Agora, quando alguém quer conhecer o espaço, eu já tenho um link para enviar.",
    "story": "\"Quem trabalha com salão de festas sabe como é. A pessoa chama perguntando o valor, depois quer ver o salão, a parte de fora, onde fica a cozinha...\n\nEu tinha tudo no celular, mas era uma trabalheira. Mandava foto, depois procurava outro vídeo, às vezes precisava gravar alguma coisa de novo.\n\nAí fizemos o tour.\n\nHoje eu mando o link para a pessoa conhecer o espaço. Ela vai olhando o salão, os ambientes, vê como é o lugar.\n\nClaro que muita gente ainda prefere visitar pessoalmente antes de fechar, principalmente quando é casamento ou festa grande.\n\nMas já chega tendo uma noção muito melhor do espaço. Para mim, facilitou bastante essa parte do atendimento.\""
  },
  {
    "id": "google",
    "tag": "MOSTRAR O AMBIENTE",
    "name": "André",
    "role": "Proprietário",
    "business": "Barbearia",
    "service": "Tour 360 + Google Maps",
    "title": "Eu arrumei a barbearia toda. Queria que as pessoas vissem como ficou.",
    "summary": "Eu já tinha fotos no Google, mas queria mostrar melhor o ambiente, as cadeiras, a recepção... Não só a fachada e o endereço.",
    "story": "\"Eu investi bastante para deixar a barbearia do jeito que eu queria.\n\nEscolhi os móveis, organizei a recepção, pensei na iluminação... Essas coisas fazem diferença para mim.\n\nSó que na internet o pessoal via umas fotos e pronto. Não dava muito para ter uma ideia de como era o lugar.\n\nQuando conheci o tour 360, achei interessante justamente por isso.\n\nFizemos as imagens e conseguimos colocar a apresentação no Google Maps.\n\nAgora, quem pesquisa a barbearia também tem a possibilidade de olhar o ambiente por dentro.\n\nEu achei legal porque mostra melhor o espaço que a gente preparou, sem a pessoa precisar vir até aqui só para conhecer.\""
  },
  {
    "id": "captacao",
    "tag": "CAPTAÇÃO SEM COMPLICAÇÃO",
    "name": "Camila",
    "role": "Responsável pela academia",
    "business": "Academia",
    "service": "Tour 360",
    "title": "Achei que ia ter que parar a academia para fazer as fotos.",
    "summary": "Essa era minha preocupação. Mas combinamos tudo antes, escolhemos um horário mais tranquilo e conseguimos organizar a captação.",
    "story": "\"Quando me falaram de fazer um tour da academia, eu gostei da ideia, mas fiquei pensando na parte prática.\n\nPorque aqui tem aluno entrando e saindo o dia inteiro. Eu não queria ter que parar o funcionamento ou ficar atrapalhando o treino do pessoal.\n\nA gente conversou antes, viu quais ambientes precisavam aparecer e combinou de fazer as imagens num horário mais tranquilo.\n\nFoi tudo bem organizado.\n\nE o resultado ficou interessante porque agora consigo mostrar não só os aparelhos, mas também como é a academia por dentro, a distribuição dos espaços, as áreas de treino...\n\nPara quem pergunta sobre a estrutura antes de vir conhecer, é uma apresentação que ajuda bastante.\""
  },
  {
    "id": "entrega",
    "tag": "TUDO EM UM SÓ LINK",
    "name": "Renata",
    "role": "Proprietária",
    "business": "Estúdio de estética",
    "service": "Tour 360 + página própria",
    "title": "O que eu mais gostei foi ter tudo organizado num lugar só.",
    "summary": "Antes eu mandava fotos, endereço e outras informações separadamente. Agora tenho uma página com o espaço, a localização e o contato.",
    "story": "\"Eu queria uma maneira mais bonita e organizada de apresentar meu estúdio, principalmente para quem ainda não conhece.\n\nPorque a pessoa entrava em contato e eu ia mandando as coisas aos poucos. Primeiro umas fotos, depois a localização, depois explicava como era o ambiente...\n\nQuando vi que dava para colocar o tour e as informações numa página só, achei que fazia muito mais sentido para mim.\n\nHoje eu tenho um link que posso colocar na bio do Instagram e mandar pelo WhatsApp.\n\nA pessoa consegue conhecer o estúdio, olhar as fotos, ver onde fica e já tem o caminho para entrar em contato.\n\nE o melhor é que eu não preciso ficar explicando como usar. É só abrir o link e explorar.\n\nEra exatamente essa praticidade que eu estava procurando.\""
  }
];
  const safeMedia = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, document.baseURI);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };
  const hasText = value => typeof value === 'string' && Boolean(value.trim());
  const items = topics.map((topic, index) => {
    const data = configured[topic.id] || {};
    const videoSrc = safeMedia(data.videoSrc);
    const poster = safeMedia(data.poster);
    const captionsUrl = safeMedia(data.captionsSrc);
    const captionsSrc = captionsUrl && new URL(captionsUrl).origin === location.origin ? captionsUrl : '';
    const complete = data.authorized === true && videoSrc && poster && captionsSrc &&
      ['client', 'title', 'summary', 'transcript'].every(key => hasText(data[key]));
    return complete
      ? { id: topic.id, tag: topic.tag, ...data, videoSrc, poster, captionsSrc, ready: true }
      : { ...topic, client: topic.name, transcript: topic.story, ready: false, portraitIndex: index };
  }).filter(Boolean);
  section.hidden = items.length === 0;
  if (!items.length) return;
  const track = section.querySelector('.testimonials-track');
  const dots = section.querySelector('.testimonials-dots');
  const previous = section.querySelector('.testimonial-prev');
  const next = section.querySelector('.testimonial-next');
  const status = section.querySelector('.testimonials-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollTimer;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  items.forEach((item, index) => {
    const card = element('article', 'testimonial-card');
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `${index + 1} de ${items.length}: ${item.tag.toLowerCase()}`);
    const cover = element('div', 'testimonial-cover');
    let image;
    if (item.ready) {
      image = element('img', 'testimonial-poster');
      image.src = item.poster;
      image.alt = '';
      image.loading = 'lazy';
    } else {
      image = element('div', 'testimonial-portrait-sprite');
      image.style.backgroundPosition = `${item.portraitIndex * 25}% top`;
      image.setAttribute('role', 'img');
      image.setAttribute('aria-label', `Personagem fictício: ${item.client}. Não é cliente real.`);
    }
    cover.append(image);
    const body = element('div', 'testimonial-card-body');
    body.append(element('p', 'eyebrow', item.tag), element('h3', '', `“${item.title}”`), element('p', 'testimonial-summary', item.summary));
    const identity = element('div', 'testimonial-identity');
    identity.append(element('strong', '', item.client), element('span', '', item.business || ''));
    body.append(identity);
    card.append(cover, body);
    track.append(card);
    const dot = element('button', 'testimonial-dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Mostrar depoimento ${index + 1}: ${item.tag.toLowerCase()}`);
    dot.setAttribute('aria-controls', 'testimonials-track');
    dot.addEventListener('click', () => scrollToCard(index));
    dots.append(dot);
  });

  const cards = [...track.children];
  const dotButtons = [...dots.children];
  const update = () => {
    const bounds = track.getBoundingClientRect();
    const visible = cards.map((card, index) => ({ index, rect: card.getBoundingClientRect() }))
      .filter(({ rect }) => rect.left >= bounds.left - 6 && rect.right <= bounds.right + 6);
    const stride = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    const first = visible.length ? visible[0].index : Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / stride)));
    const last = visible.length ? visible[visible.length - 1].index : first;
    const text = `${first === last ? first + 1 : `${first + 1}–${last + 1}`} de ${items.length}`;
    if (status.textContent !== text) status.textContent = text;
    previous.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    dotButtons.forEach((button, index) => {
      button.classList.toggle('is-visible', index >= first && index <= last);
      button.setAttribute('aria-label', `Mostrar depoimento ${index + 1}: ${items[index].tag.toLowerCase()}${index >= first && index <= last ? ' (visível)' : ''}`);
    });
  };
  const scrollToCard = index => {
    track.scrollTo({ left: cards[index].offsetLeft - cards[0].offsetLeft, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  };
  const step = direction => {
    const stride = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    track.scrollBy({ left: direction * stride, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  };
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  track.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(update, 120); }, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') scrollToCard(0);
    else if (event.key === 'End') scrollToCard(items.length - 1);
    else step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  new ResizeObserver(update).observe(track);

  update();
})();
