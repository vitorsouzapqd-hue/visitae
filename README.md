# Visitaê

## Depoimentos — apresentação atual

Os cards têm frases de impacto maiores e mais fortes, seguidas de nome e negócio em texto discreto. As fotos são mais baixas e os controles de player, o botão “Ler relato” e o diálogo foram retirados por enquanto. Os cinco relatos completos continuam preservados nos dados e no histórico; o carrossel, as fotos e a identificação dos exemplos fictícios permanecem.

## Depoimentos recuperados

A apresentação com fotos grandes foi recuperada do commit `52bd8f69af833b8f5f93bd95d42a58cee87a8116` do projeto original: capas 4:5, nomes sobre a imagem, identificação “EXEMPLO FICTÍCIO” e aviso “Prévia ilustrativa”. Os mesmos cinco retratos, os textos completos atuais, o carrossel e o diálogo de leitura foram preservados. A recuperação modifica somente esta seção e seu exemplo no Design System.

Para ver a prévia, abra `dist/index.html` como arquivo local ou use `npm run dev`. Os relatos fictícios exigem a flag e um arquivo local ou endereço de loopback; permanecem ocultos em endereços públicos. Os botões abrem o relato completo, sem simular reprodução de vídeos inexistentes. A procedência dos estilos e a preservação dos comportamentos são verificadas pelos testes.

## Componentização — etapa 4

A aplicação continua em HTML, CSS e JavaScript nativos, sem dependências novas. Edite `src/`; `npm run build` monta os arquivos estáticos em `dist/`, mantendo o contrato de hospedagem existente. `npm run dev` compila e serve em `http://127.0.0.1:5173`. Reexecute a compilação após editar os componentes; não há servidor de atualização automática.

- `src/layout/`: Header e Footer.
- `src/sections/`: Hero, ShareMarquee, TourShowcase, Applications, OwnPageShowcase, GoogleMapsShowcase, Testimonials, Solutions, Process, Founder, FAQ e QuoteForm.
- `src/components/`: BrandLogo, Button, Modal, WhatsAppIcon, PackageCard, FAQItem e os três diálogos específicos. Os renderizadores recebem somente HTML/atributos confiáveis dos arquivos do projeto, nunca entrada de visitantes.
- `src/data/`: tours com créditos, pacotes, perguntas frequentes e os cinco relatos fictícios internos.
- `src/client/`: comportamentos originais separados por responsabilidade. Os arquivos `.js.in` recebem os dados na compilação; `src/build-order.mjs` preserva a ordem dos scripts e a cascata CSS. `src/styles/` concentra os estilos por componente, regras compartilhadas e responsividade; nenhum seletor ou valor visual foi reescrito.

`src/index.html` define a ordem da página e `src/page.mjs` registra os componentes. A marca e o vetor do WhatsApp são compartilhados; este último usa o registro nativo preparado na etapa 3. Os controladores originais de tours, menu, modais e carrossel foram preservados para manter seus estados e o ciclo de vida da mídia.

As duas mudanças solicitadas nesta etapa são o título “Localização do estabelecimento”, usando o CSS já existente, e os relatos fictícios restritos a `localhost`, `127.0.0.1` ou `[::1]`, com a flag explícita. Em endereço público, apenas relatos reais completos e autorizados podem aparecer. Fontes, imagens, textos comerciais, links e estilos permanecem iguais ao original.

Verificação: `npm run check` compila e verifica a sintaxe; `npm test` compila e executa os testes. A referência recuperável em `tests/fixtures/` permite comparar o HTML completo, scripts, estilos e recursos da importação. Os testes também exercitam contato, tours, controles e elegibilidade dos relatos. Esta etapa não inclui navegador, auditoria visual ou envio de mensagens.

## Design System alinhado à implementação

`design-system.html` carrega os mesmos arquivos CSS e o mesmo endereço de fontes da landing. A prévia incorporada abre o próprio `dist/index.html`; os componentes simplificados da documentação anterior foram substituídos por essa referência real. As 17 seções documentam os valores implementados e as decisões pendentes, sem alterar a aplicação.

As demais seções do arquivo aprovado foram preservadas; o exemplo e as notas de depoimentos acompanham a recuperação acima. Os trechos anteriores ao título de localização continuam registrados; para essa decisão, consulte a etapa 4 acima. A prévia principal já exibe a aplicação atual compilada.

As seções também contêm 11 exemplos visíveis extraídos do HTML original: tipografia, botões, badge, faixa e ícones, cards de aplicações e soluções, carrossel com cinco relatos, diálogo, formulário, FAQ e menu móvel. Os exemplos usam os mesmos estilos e fontes em documentos isolados. O carrossel executa os scripts originais; a busca municipal usa `locations.js`; o formulário documental bloqueia o envio. Para atualizar os trechos após mudanças no site, execute `python scripts/sync-design-system-examples.py`.

Para consultar pelo servidor local, execute nesta pasta `python -m http.server 5174 --bind 127.0.0.1` e acesse `http://127.0.0.1:5174/design-system.html`. Sirva a raiz do projeto para que os caminhos `dist/` funcionem. A pasta deve acompanhar o HTML; fontes e demonstrações externas continuam dependendo de conexão.

## Infraestrutura de componentes

Módulos ES nativos em `src/ui/index.mjs`, copiados pela compilação para `dist/ui/index.mjs`, sem dependências externas ou inicialização automática. O registro de marcas é compartilhado com a montagem da landing; os demais controladores continuam disponíveis sem substituir comportamentos específicos já funcionais. React, shadcn/ui, Radix, lucide-react, react-icons e Embla não foram adicionados: o projeto original não usa React e já possui controles nativos funcionais. Não há migração para Tailwind.

- `Button`, `Input`, `Select`, `Label` e `Accordion` criam elementos nativos com texto seguro e classes existentes. Botões aceitam variantes `dark`, `lime`, `light`, `outline` e tamanho `small`. Campos e labels devem permanecer dentro de `.contact-form`, com `id`, `name` e associação por `htmlFor`. Conteúdo fornecido como nó DOM é responsabilidade do chamador.
- `Dialog({ element, closeButton })` recebe um `<dialog>` conectado ao documento, com título associado por `aria-labelledby` e botão de fechamento acessível. Expõe `open(opener)`, `close()` e `destroy()`. Reutiliza a modalidade nativa e prepara bloqueio de rolagem, retorno de foco e fechamento pelo backdrop; conteúdo e descarregamento de mídia continuam a cargo do componente específico.
- `Carousel({ track, previous, next, status, dots })` recebe a estrutura existente, reutiliza rolagem nativa, geometria dos cards, teclado e movimento reduzido. Expõe `goTo(index)`, `update()` e `destroy()`. Preserve CSS, labels dos botões, `tabindex="0"` e nome acessível na trilha, além de `role="status"`/`aria-live="polite"` no status. Atualize após mudanças nos cards; não altera nem recria relatos.
- `Navigation({ trigger, panel })` prepara o menu recolhível existente; o painel precisa de `id`. Expõe `open()`, `close()` e `destroy()`. Não exige Sheet. Aplique cada controlador uma única vez; use `destroy()` antes de remontar.
- `BrandIcon('whatsapp', { label, size })` reutiliza exatamente o vetor Simple Icons já presente na origem: `viewBox="0 0 24 24"`, proporções preservadas, `fill="currentColor"` e `stroke="none"`. Sem `label`, o ícone é decorativo. O registro compartilhado aceita somente marcas verificadas; outras marcas ainda não foram adicionadas.

Carregue futuramente o ponto de entrada por `<script type="module">`, mantendo `styles.css` e, para o carrossel, `testimonials.css`. Nenhum tema ou CSS global novo foi introduzido. `package.json` e `package-lock.json` registram zero dependências; `npm run dev` usa o servidor Python já disponível, `npm run check` verifica sintaxe e `npm test` executa os testes originais e dos novos controladores. Os testes de controladores usam limites DOM simulados; não constituem validação em navegador.

## Execução local — importação de 11/10/2026

Origem efetivamente importada: `C:/Users/Vítor Velame/.codex/visualizations/2026/10/10/01a127f9-fe60-7560-aa0b-41ee0d7f6358/vitor-360`, incluindo as alterações locais existentes em `dist/index.html` e `dist/styles.css`.

Na pasta deste projeto, execute `npm run dev` e acesse `http://127.0.0.1:5173`. Encerre com Ctrl+C. Node.js e Python já estão disponíveis no ambiente local; nenhuma dependência precisa ser instalada.

Na importação, `dist/` continha os arquivos originais editados diretamente e foi preservado byte a byte. Após a etapa 4, os arquivos de entrega são montados a partir de `src/`; as imagens e a base municipal permanecem em `dist/assets/`. Fora da seção de depoimentos recuperada, o HTML completo continua igual, exceto pelo título de localização e pelos endereços de cache dos recursos atualizados.

Fontes e demonstrações externas continuam usando os endereços originais e precisam de conexão para carregar. O manifesto de hospedagem original foi preservado; esta importação não publica nem altera a hospedagem. As seções abaixo registram o histórico original, inclusive configurações anteriores.

Landing page do serviço de tours virtuais 360 e páginas próprias para estabelecimentos. Projeto existente atualizado pelos comandos 1, 2 e 3 de 4 do proprietário, em 11/10/2026.

## UX e funcionamento — comando 3

- Copy comercial, ofertas, paleta, fontes, três demonstrações, URLs e créditos preservados. Acrescentados apenas controles, mensagens de validação e recuperação solicitados.
- Tour: permanece sem iframe inicial e com um único visualizador externo ativo. Troca de aba remove o anterior; eventos atrasados do iframe antigo não alteram o atual. Estado de carregamento com `aria-busy`, aviso após 12 segundos e tratamento do evento de erro. Link externo disponível junto ao visualizador, inclusive ampliado; botão para voltar à prévia descarrega o iframe. A ampliação mantém fechamento visível, contém a navegação por Tab e restaura foco e estados `inert` anteriores.
- CTA móvel: aparece após sair da abertura, permanece oculto junto ao formulário e tour, durante o menu e em janelas abertas. Áreas seguras e espaço inferior para navegação e foco respeitados. Menu fecha após navegação, ao sair por teclado e por Escape; Escape devolve o foco ao botão. Âncoras direcionam o foco ao destino e respeitam movimento reduzido.
- Pacotes preenchem a solução correspondente e levam ao formulário. Chamadas genéricas conservam a escolha anterior. Campos e obrigatoriedades mantidos; mensagens textuais de erro associadas aos campos, com foco no primeiro inválido, sem apagar valores. Nome e cidade não aceitam apenas espaços. Pesquisa municipal sem acentos, validação por UF, digitação manual quando a base falha e preenchimento enquanto carrega. Trocar UF limpa a cidade; uma restauração inicial preserva o valor existente.
- WhatsApp: modelo exato do comando 3, com linhas opcionais vazias omitidas. Número `5535991679134` preservado. Envio nativo do formulário abre o destino em outra aba e mantém a página preenchida. O evento `formdata` limita a requisição ao parâmetro `text`; campos individuais não são enviados como parâmetros adicionais. Este mecanismo foi verificado no navegador, após constatar que abas abertas por script eram bloqueadas no navegador integrado. O site apenas prepara a mensagem: o visitante confirma o envio no WhatsApp.
- Após preparar, status “Mensagem preparada. Revise os dados e envie pelo WhatsApp.” e opções de reabrir ou copiar. Se a área de transferência falhar, aparece texto selecionável. Alterações posteriores invalidam o texto preparado para evitar copiar dados antigos. Não há armazenamento persistente ou coleta de leads.
- Ícones decorativos retirados da árvore de acessibilidade; janela de créditos identificada por título. FAQ nativo e carrossel interno preservados. Relatos fictícios continuam restritos à prévia local, com flag desativada na publicação.
- Prévia Palace Hall: 145.152 → 103.424 bytes; Sumaré: 129.979 → 91.394 bytes; Vila Terroir: 100.489 → 60.244 bytes. Conversão para WebP, mantendo dimensões: total de 375.620 → 255.062 bytes, redução de 32,1% (120.558 bytes). Arquivos JPEG substituídos. Prévia principal, dimensões reservadas, imagens abaixo da abertura com carregamento tardio, fontes com preconexão e `display=swap` preservados. Nenhuma biblioteca adicionada.

## Verificações do comando 3

- Código real do contato e do tour executado em testes isolados (`tests/contact-flow.test.cjs`): texto exato, acentos, quebras, caracteres especiais, opcionais, obrigatórios, campos com espaços, destino, mensagem única no envio nativo, falha de abertura, cópia e alternativa manual; carregamento progressivo, troca, timeout, erro, evento antigo e retorno à prévia. Nenhuma mensagem enviada pelos testes.
- No navegador, carregados Holm Hotel, Palace Hall e Sumaré, com interface do fornecedor identificada. Abas por clique e setas/Home/End; ampliar, fechar, Escape, Tab, foco de retorno, link externo acessível e descarga do iframe ao voltar à prévia. Inicialização com zero iframes externos.
- Três pacotes e chamada genérica conferidos. Formulário vazio e cidade incompatível com UF bloquearam a navegação com explicação. Busca “Pocos” selecionou “Poços de Caldas” pelo teclado. Uma prévia local retornando 503 para a base municipal manteve digitação manual disponível.
- Fluxo real abriu a página de revisão do WhatsApp em outra aba, em 390 px e 1440 px, com número, dados e mensagem corretos; opcionais preenchidos e vazios conferidos, formulário preservado e cópia confirmada. Nenhuma mensagem foi enviada. A serialização nativa pode normalizar quebras para CRLF, preservando sua apresentação.
- Menu móvel, CTA na abertura/fora dela/formulário/menu/tour/janela, foco, FAQ por Enter/Espaço, créditos e retorno do foco conferidos. Nenhuma âncora interna sem destino. Sem transbordamento horizontal em 360, 390, 768 e 1440 px; controles ampliados cabem em 360 px.
- Na prévia interna: cinco relatos, setas, indicadores, Home/End, leitura do primeiro e último, janela rolável e restauração de foco. Na configuração padrão: zero cards fictícios. A flag de publicação e o mecanismo de restrição não foram alterados.
- Copy aprovada comparada com a versão anterior: seções comerciais, ofertas, respostas de FAQ e texto original de contato preservados. Sintaxe dos três scripts, integridade dos arquivos, IDs, âncoras e referências locais conferidos. Sem erros JavaScript observados na revisão final.

Limites do comando 3: não foi executado Lighthouse nem medição de Core Web Vitals; os números acima são tamanhos reais de arquivos. Gestos e área segura devem ser confirmados em aparelho físico, assim como a passagem da tela de revisão para o aplicativo instalado. Não foi enviado orçamento de teste. Vídeos reais de depoimentos não foram fornecidos. O conteúdo de iframes externos não pode ser inspecionado de forma confiável pelo JavaScript da página; o link externo e a saída para a prévia continuam disponíveis mesmo se o fornecedor apresentar uma falha interna que dispare `load`.

## Refinamento visual — comando 2

- Paleta original preservada: verde escuro `#20261f`, verde-lima `#d8f66b` e off-white `#f6f5ef`. Fontes Bricolage Grotesque, Instrument Serif e DM Sans mantidas.
- Estilos e pontos de reorganização consolidados em `dist/styles.css`, removendo as antigas camadas de ajustes responsivos. Texto principal entre 16 e 17 px; informações de apoio entre 14 e 16 px; rótulos editoriais menores mantidos apenas para identificação. Entrelinha do corpo entre 1,55 e 1,65.
- Abertura com leitura mais ampla, botões maiores e detalhe verde-lima separado do controle de entrada no tour. Visualizador generoso, legendas e abas legíveis; conteúdo lateral passa para baixo antes de apertar o tour.
- Aplicações com categorias, perguntas e textos diferenciados. Prévia da Vila Terroir preservada e empilhada em larguras intermediárias para não encolher a apresentação do site. Google Maps permanece complementar, com ressalvas legíveis.
- Três pacotes com o mesmo tratamento de entrada e botões claros, sem indicação de popularidade. Três colunas a partir de 1200 px; duas entre 900 e 1199 px, com Personalizado em faixa própria; uma abaixo de 900 px. Conteúdo e oferta mantidos.
- Itálico preservado na abertura, demonstração, chamada final e outros momentos expressivos. Títulos de soluções, processo e FAQ receberam tratamento direto, sem repetir o mesmo recurso em toda a página.
- Processo e fundador com proporções mais contidas; FAQ com estado aberto perceptível. Formulário com campos de 54 px, fonte de 16 px, rótulos e ajuda de 14 px, foco visível e bordas de erro, usando a validação existente.
- `dist/testimonials.css` e apenas a ordem de apresentação dos elementos em `dist/testimonials.js` foram ajustados: frase → retrato e identidade → contexto → leitura. Cinco cards com alturas consistentes e modal com título livre da fotografia, leitura de 16 px e fechamento acessível durante a rolagem. Restrição à prévia local mantida.
- `dist/index.html` alterado somente para versionar os arquivos de estilo e scripts. Todo seu texto, links, campos, atributos e conteúdo comercial permanecem idênticos ao comando 1. `app.js`, `locations.js` e `config.js` mantêm os mesmos hashes.

## Verificações do comando 2

- Conferidos 360, 390, 768, 1024 e 1440 px no navegador: sem transbordamento horizontal, texto excedendo seus blocos ou botões cortados. Conferidos os layouts de abertura e pacotes nas cinco larguras.
- Corpo, notas, listas, rótulos e campos conferidos pelos estilos efetivamente renderizados. Contraste calculado para textos em fundos claros, verde-lima e verde escuro; combinações verificadas acima de 4,5:1. Texto principal sobre off-white: 14,15:1; texto da chamada sobre verde-lima: 7,20:1; legenda sobre verde escuro: 8,98:1; placeholder do campo: 5,11:1.
- Carregados os três tours e testados ampliar/fechar no celular, sem mudar a integração dos visualizadores.
- Testados botões dos três pacotes, busca sem acentos e seleção de Poços de Caldas, FAQ e créditos. Validação de envio vazio manteve o foco no campo obrigatório e exibiu a borda de erro. Nenhuma mensagem foi enviada.
- Na prévia interna: cinco relatos, alturas iguais, controles de navegação e leitura do primeiro e do último relato. Modal conferido em 360 px. Na versão padrão: zero cards fictícios renderizados.
- Sintaxe do JavaScript e integridade da copy verificadas; sem erros de execução observados durante os testes locais. Movimento reduzido preservado no CSS; não foram acrescentadas animações ou funcionalidades.
- Capturas de avaliação desktop e mobile ficam no diretório da tarefa, fora dos arquivos servidos pelo site.

Limites: as interfaces internas dos tours pertencem a terceiros. Vídeos reais de depoimentos não foram fornecidos, portanto sua reprodução não foi testada. O destino privado da Vila Terroir conserva sua própria autenticação. A entrega pelo aplicativo do WhatsApp não foi testada; sua lógica e contato foram preservados.

## Arquivos alterados no comando 1

- `dist/index.html`: copy aprovada em todas as seções; marca Visitaê; navegação com “Como funciona”; três soluções; nove perguntas frequentes; apresentação pessoal do fundador preservada; formulário com novas opções; rodapé e metadados atualizados. Créditos e privacidade mantidos.
- `dist/app.js`: textos e botão inicial específicos para cada tour; seleção automática dos três pacotes no formulário; mensagem de WhatsApp dirigida à Visitaê. URLs dos tours preservadas.
- `dist/config.js`: contato comercial mantido; marca e fundador separados; flag explícita de simulação, desativada por padrão.
- `dist/testimonials.js`: cinco relatos aprovados para simulação interna; controle “Ler relato” quando não há vídeo; relatos fictícios impedidos de renderizar fora do desenvolvimento local. Entradas reais incompletas não aparecem na publicação.
- `dist/styles.css`: ajustes pontuais para acomodar textos maiores, assinatura tipográfica da marca e terceiro pacote. Paleta, fontes e disposição geral mantidas.
- `dist/testimonials.css`: aparência do controle de leitura no lugar do play da simulação.
- `dist/assets/favicon.svg`: inicial tipográfica V, usando a paleta existente, sem o símbolo anterior.
- `ASSETS.md`: condições de uso dos retratos ilustrativos atualizadas.
- `README.md`: documentação atualizada para a oferta e a configuração atuais.

## Oferta e sequência

Abertura → demonstração → aplicações → página própria → Google Maps → relatos, somente quando elegíveis para exibição → soluções → processo → fundador → FAQ → formulário.

Soluções: Visitaê Essencial, até 5 pontos de captação; Visitaê Completo, até 12 pontos e página própria; Visitaê Personalizado, sob avaliação. Não há preços publicados. A página informa contratação por projeto, ausência de acompanhamento mensal obrigatório e custos de domínio, hospedagem e plataformas apresentados separadamente.

## Contato

WhatsApp: **(35) 99167-9134**, formato internacional `5535991679134`. O formulário prepara uma mensagem e abre o WhatsApp; o visitante revisa e envia. Não há envio automático nem banco de leads.

Nome do estabelecimento, UF e cidade são obrigatórios; bairro e Instagram/site são opcionais. Tipo pode permanecer sem seleção. A cidade é filtrada pela UF, aceita busca sem acentos, permite seleção por teclado e é limpa quando o estado muda. Se a base não carregar, o campo permite digitação manual.

`dist/assets/municipalities.json` contém 5.571 municípios nas 27 UFs, obtidos da API pública do IBGE em 11/10/2026. A lista é servida pelo próprio site; o que o visitante digita não é enviado ao IBGE.

Os botões dos pacotes preenchem respectivamente “Tour Essencial”, “Tour Completo” e “Projeto Personalizado” antes de levar ao formulário. A opção de entender a melhor solução continua disponível.

## Relatos: publicação e prévia interna

`window.SITE_CONFIG.demoTestimonials` é **false** na versão enviada à hospedagem. A seção começa oculta no HTML. Os personagens, retratos e relatos fictícios não são prova de clientes atendidos e não são renderizados no endereço hospedado.

Para uma prévia de desenvolvimento, habilite a flag apenas na configuração local e abra o arquivo local ou sirva a página por `localhost`, `127.0.0.1` ou `[::1]`. A simulação exige simultaneamente a flag e um desses contextos locais. Parâmetros da URL não ativam a simulação. Mesmo que a flag seja alterada para true por engano na hospedagem, a restrição de endereço impede a exibição dos relatos fictícios. Reponha false antes de publicar.

A simulação mantém cinco cartões e janelas de leitura completa. O controle é “Ler relato”; não existe reprodução de vídeo fictício. O carrossel funciona por controles, rolagem, toque e teclado.

Relatos reais podem ser configurados em `window.SITE_TESTIMONIALS`, pelas chaves `ambientes`, `atendimento`, `google`, `captacao` e `entrega`. Cada entrada precisa conter `authorized: true`, `client`, `title`, `summary`, `transcript`, `videoSrc`, `poster` e `captionsSrc`. As legendas devem ser WebVTT no mesmo domínio. `role`, `business` e `service` podem identificar dados reais adicionais; não são preenchidos com a identidade fictícia. Não habilitar a publicação sem conteúdo real e autorização.

Com mídia completa e autorizada, o player usa controles nativos e transcrição. O carregamento ocorre após ação do visitante. Fechar o diálogo pausa e descarrega o vídeo. A reprodução de vídeos reais não foi verificada porque nenhum arquivo foi fornecido.

## Referências preservadas

- Holm Hotel / Clear Pano: https://tours.clearpano.com/T2ZhHe0r.
- Palace Hall / Tour Brasil360: https://maps.app.goo.gl/wMfgnJ47d7WYYSRbA.
- Sumaré Esportes / Tour Brasil360: https://maps.app.goo.gl/Z2bWe51JyZyWNWKD6.
- Autoria dos exemplos brasileiros: https://tourbrasil360.com/tour-virtual-google.html.
- Vila Terroir: https://vila-terroir-demo-vitor.vitorvelame.chatgpt.site.

As referências de terceiros continuam creditadas. Vila Terroir é um modelo de página, com acesso privado próprio. Não são captações ou clientes da Visitaê. Links e prévia visual foram preservados; o acesso à Vila Terroir pode pedir autenticação no projeto de destino.

## Verificações do comando 1

- JavaScript verificado quanto à sintaxe.
- Página aberta no navegador com marca Visitaê, três pacotes, nove perguntas e nenhuma âncora interna quebrada.
- Testados os botões dos três pacotes e a seleção correspondente no formulário.
- Carregados os três tours; identificadas as interfaces do Street View nos exemplos do Google e o visualizador do Holm Hotel. Testada a ampliação e o fechamento.
- Testados abertura e fechamento dos créditos e expansão de resposta do FAQ.
- Testados filtro de cidade sem acentos, seleção de “Poços de Caldas” e limpeza da cidade ao trocar a UF.
- Verificados layout e largura da página em 1440, 390 e 360 px; sem transbordamento horizontal nos tamanhos móveis. Testado o menu móvel, inclusive fechamento após selecionar “Como funciona”.
- Verificada a ausência de cartões fictícios no modo padrão e a presença de cinco cartões com “Ler relato” na prévia interna local; testada a leitura completa. Controles do carrossel conferidos na prévia.
- Executado o código real do formulário em ambiente de verificação com controles inertes: destino do WhatsApp, marca, solução, acentos, campos opcionais e bloqueio da navegação para formulário inválido. Nenhuma mensagem enviada. Não foi testado recebimento no aplicativo do WhatsApp.
- Executada a regra real de exibição dos relatos contra endereços de produção e configurações incompletas, inclusive tentativa de habilitar a flag fora de localhost: conteúdo fictício permaneceu oculto.

## Atenção para as próximas etapas

O redesign completo está fora do comando 1. O endereço hospedado atual continua igual; a mudança de identidade não altera o slug automaticamente. Novos relatos públicos dependem de depoimentos reais autorizados e de seus vídeos, capas e legendas. Custos, renovações e condições de alterações devem ser definidos na proposta comercial. O modelo Vila Terroir mantém as permissões do projeto de destino. A publicação desta landing page preserva seu público atual.

## Hospedagem e arquivos

Projeto Sites `appgprj_6acae6b57d8881918b473ffa6f327722`; manifesto `.openai/hosting.json`. Site estático em `dist/`, montado por `npm run build` sem instalação de bibliotecas. Tours externos carregam sob demanda; fontes vêm do Google Fonts. Esta etapa salva no Git e não altera a hospedagem nem suas permissões.
