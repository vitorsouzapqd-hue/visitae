# Visitaê — regras permanentes de trabalho

## Inicialização e identidade
- Consulte design-system.html antes de alterações de interface e leia somente os arquivos relacionados.
- Esta etapa entrega documentação. Importar, instalar, migrar ou componentizar exige solicitação própria.
- Preserve marca, paleta, tipografia e padrões documentados; distinga CONFIRMADO NO CÓDIGO, APROVADO NO BRIEF e PROVISÓRIO/PENDENTE.
- Na futura migração, o código original é a fonte de verdade para aparência implementada e comportamento. Amostras documentais não autorizam substituir componentes.
- Fonte consultada nesta edição: C:/Users/Vítor Velame/.codex/visualizations/2026/10/10/01a127f9-fe60-7560-aa0b-41ee0d7f6358/vitor-360. Registre a localização efetiva do código importado na migração.
- Famílias confirmadas: Bricolage Grotesque, DM Sans e Instrument Serif. Fallbacks offline são PROVISÓRIOS. Não trocar por novas fontes definitivas.
- Instrument Serif é carregada no peso 400; não simular negrito.

## Decisões e divergências
- Implementado: institucional #20261F, off-white #F6F5EF e lima #D8F66B. Referências do brief: #26352D, #F3F1E8 e #C7DD59. Conciliar com Vítor antes de recolorir; não substituir silenciosamente.
- Logo claro: Visit institucional + aê #61751B. Logo escuro: Visit off-white + aê lima. Palavra única, com circunflexo e nome completo acessível. Sem símbolo adicional.
- Colorir identificações destacadas, mantendo Visitaê normal dentro de parágrafos.
- O original está sem legend visível Localização do estabelecimento, removido por ordem anterior. A amostra documental inclui o título solicitado no brief atual. Confirmar antes de reintroduzi-lo na aplicação.
- Os novos rótulos Hospedagem, Espaço de eventos e Espaço esportivo estão aprovados e aplicados localmente; a publicação anterior ficou pendente por limite da revisão automática. Não presumir sincronização com a hospedagem.

## Escopo e preservação
- Modifique apenas os componentes solicitados. Não faça redesign espontâneo.
- Não remova seções, cards, tours, modais ou funcionalidades sem autorização expressa.
- Não reescreva copy comercial durante ajustes técnicos ou visuais.
- Não instale bibliotecas por conveniência nem troque framework sem necessidade.
- Preserve Solicitar orçamento no header sticky, inclusive no celular, fora do menu recolhido; destino #contato e rolagem/foco respeitando movimento reduzido. Não recrie botão flutuante inferior.
- Preserve seletores com rótulo único, indicador verde, ARIA, teclado e alternância real.
- Preserve o carrossel elaborado com cinco cards, retratos, frases, contexto, identificação, navegação e leitura expandida. Nunca substitua por três cards estáticos em grade.
- Preserve o modal Vila Terroir, iframe sob demanda, link externo alternativo, fechamento, foco e bloqueio de rolagem.
- Preserve todos os campos, valores, dropdowns, validações, recuperação e integração nativa com WhatsApp. Tipo de espaço fica fora de Estado/Cidade/Bairro.

## Componentização futura
- Utilize componentes com responsabilidades claras; reutilize sem abstrações excessivas.
- Delimite estilos; evite seletores globais que interfiram em SVGs ou seções não relacionadas.
- Não distorça vetores. WhatsApp usa o path Simple Icons, viewBox 0 0 24 24, proporção preservada, fill currentColor e stroke none. Não aplicar stroke genérico à marca preenchida.
- Preserve responsividade, labels, foco visível, teclado e prefers-reduced-motion.
- Estado desabilitado didático, composição documental e fallbacks não são novos tokens de produção.

## Segurança comercial
- Não invente clientes, avaliações, portfólio, fotografias ou resultados como autênticos.
- Marina, Rafael, André, Camila e Renata são personagens fictícios. Identifique seus relatos como ilustrativos, sem valor de prova social real. Não oculte ou remova o carrossel por ambiente sem autorização.
- Holm Hotel/Clear Pano e Palace Hall + Sumaré Esportes/Tour Brasil360 são demonstrações de terceiros. Preserve links e créditos; não apresentar como produção Visitaê.
- Vila Terroir é projeto conceitual, não contratado por cliente; preservar observação centralizada abaixo do mockup.
- Não publique preços internos sem autorização. Ressalvas Google Maps ficam na seção própria e no FAQ, não na barra compacta.

## Versionamento
- Utilize o repositório Git configurado e não crie repositórios aninhados.
- Preserve versões recuperáveis antes de refatorações significativas.
- Não execute comandos destrutivos, descarte trabalho ou sobrescreva histórico remoto sem autorização.
- Não versione dependências instaladas, caches, artefatos gerados de build ou credenciais.
- Não execute Git push nesta etapa documental.

## Economia e conclusão
- Por padrão: não abrir navegador, tirar screenshots, analisar imagens, fazer auditorias amplas ou pesquisas externas sem necessidade.
- Não instalar pacotes por conveniência nem reler arquivos inteiros repetidamente.
- Essas restrições podem mudar mediante solicitação explícita do usuário.
- Faça verificações técnicas proporcionais e preserve funcionalidades relacionadas.
- Conclua somente com escopo atendido, nenhuma remoção não autorizada e limitações informadas.
- Não declare validação visual sem inspeção real. Responda de modo breve e objetivo.
