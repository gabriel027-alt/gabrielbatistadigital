# Jornadas locais de conversão: Aura e Orla

## Objetivo autorizado

O usuário quer demonstrar como os sites conduzem do interesse à qualificação, sem telefone, pessoa ou operação reais conectados. Os projetos devem mostrar raciocínio comercial, além da direção de arte. Preservar as animações e as marcas; a oferta de Gabriel fica fora desses sites.

## Pesquisa e limites

Em 07/11/2026, foram tentados os diretórios `https://www.awwwards.com/websites/real-estate/` e `https://www.awwwards.com/websites/health-fitness/`. Ambos receberam 403 da política de rede. Não foram inspecionados sites premiados a partir desses diretórios nesta tarefa. As tentativas de consultar WAI Forms e NN/g também foram bloqueadas. Não atribuir aprovação do Awwwards, eficácia comercial ou comportamentos não observados às referências.

As capturas enviadas pelo usuário de Jorge Web Pro e EvoPixel mostram uma galeria de identidades e apresentações de negócios. São evidência de apresentação visual, não de taxas de conversão, animações completas ou desempenho de formulários. As escolhas comerciais abaixo são hipóteses de projeto, não resultados medidos.

Fontes técnicas efetivamente consultadas, com resposta 200:

- [MDN: dialog](https://github.com/mdn/content/blob/main/files/en-us/web/html/reference/elements/dialog/index.md): showModal, fundo inerte, fechamento por Escape e necessidade de controle visível para fechar. Aplicação: dialog nativo, botão de fechamento, retorno ao acionador e foco no título a cada etapa.
- [MDN: fieldset](https://github.com/mdn/content/blob/main/files/en-us/web/html/reference/elements/fieldset/index.md): agrupamento e legendas. Aplicação: cada pergunta usa fieldset/legend e rádios nativos com rótulos completos.
- [GOV.UK Frontend: radios](https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/radios/template.njk): nomes de grupo, associação input/label e estruturas de perguntas. Consultado como implementação de referência; não copiados código Nunjucks ou estilo GOV.UK. [Licença MIT](https://github.com/alphagov/govuk-frontend/blob/main/LICENSE.txt) verificada.

As fontes acima foram lidas na branch main, não são revisões fixadas de dependências instaladas. Nenhuma biblioteca nova foi instalada. Elas validam práticas semânticas, não a estética ou a hipótese comercial.

## Repertório e edição

Aplicados os critérios de frontend-design e o método já adaptado de ScrollCraft para respeitar ritmo e identidade. Humanizer consultado em modo incorporado: revisar frases por função, retirar inflação e promessas, preservar informação e evitar provas inventadas. Não usar a skill como detector de autoria ou garantia de conversão.

As marcas compartilham apenas o mecanismo acessível de perguntas. A Aura fala de interesse e dúvida, com cor coral e leitura facial existente. A Orla fala de finalidade, cenário, investimento e prazo, com azul oceânico e percurso fotográfico existente. Não repetir uma história ou uma oferta entre nichos.

## Aura

- Ações na navegação, hero e encerramento: “Quero uma avaliação”. O CTA de exploração do rosto permanece.
- Duas etapas: região de interesse e dúvida principal.
- Resumo revisável; texto explica que as escolhas não indicam procedimento nem substituem avaliação individual.
- Sem fotos enviadas, histórico clínico, diagnóstico, campos livres ou indicação de tratamento.

## Orla

- Ações na navegação, hero e encerramento: “Encontrar meu imóvel”. O CTA de exploração dos espaços permanece.
- Três etapas: objetivo; cenário; faixa de investimento e prazo.
- Faixas são preferências hipotéticas de busca, não preços ou oferta de estoque.
- Resumo revisável, sem anunciar imóveis disponíveis ou confirmar uma visita.

## Comportamento compartilhado

Rádios obrigatórios por pergunta, sem seleção prévia; validação HTML nativa; botão voltar preserva respostas. O resumo permite ajustar escolhas, fechar e reabrir. A interface declara que nada é enviado. Estado somente em memória, sem persistência, integração, formulário POST ou envio de mensagens.

Sem JavaScript, os links chegam à seção editorial e há instrução de leitura em noscript, em vez de botão inoperante. No fluxo com JS, o modal isola a interação. A estrutura atual não instala um CRM nem testa captação real.

## Verificação

18 testes de navegador passaram: seis novos para os roteiros, regressões de Aura e Orla e reprodução da prévia existente. Foram verificados validação, foco, retorno, edição, Escape/fechamento visível, tela de 360×640, movimento reduzido, ausência de POST e alternativa sem JS. Axe não reportou violações nas jornadas inspecionadas; isso não certifica acessibilidade integral.

Build e lint aprovados. Capturas em `docs/preview/brand-inquiries/` mostram hero, convite, primeira etapa e resumo, desktop e móvel. Inspecionados pixels dos estados relevantes. Sem teste em aparelho físico ou pesquisa com leads reais.

Os filmes anteriores são registros de suas versões. As prévias específicas dos novos fluxos são materiais de revisão; não declarar que um filme antigo inclui os CTAs apenas porque a página mudou.

Prévias em `/propostas/jornadas`: Aura (12,37s, 960×600, aproximadamente 218 kB) e Orla (14,43s, 960×600, aproximadamente 310 kB). Ambos H.264 Baseline/YUV420p, sem áudio, com legendas descritivas e download. Metadados e amostras visuais do vídeo conferidos. Script reproduzível: `BRAND_PREVIEW_URL=http://127.0.0.1:PORTA node scripts/capture-brand-inquiries.mjs`.

Procedência das consultas e hashes dos documentos recebidos: `docs/research/conversion-sources.json`. Um teste adicional verifica reprodução dos dois vídeos na página de prévias; ele se soma aos 18 anteriores. Tipagem também verificada. Os vídeos anteriores de apresentação não foram substituídos automaticamente por essas gravações curtas.
