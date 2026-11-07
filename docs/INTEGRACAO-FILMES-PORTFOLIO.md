# Integração dos filmes de Aura e Orla

## Composição entregue

Na homepage, a seleção continua com seis trabalhos. Aura e Orla passam a ocupar seus próprios cartões com um filme completo cada. Vanguard, Entre, Chronos e Raiz permanecem preservados. O catálogo de 20 itens continua disponível; sua entrada Orla passa a apontar ao filme, assim como já ocorria com Aura. As páginas-fonte não foram removidas.

O filme apresenta uma experiência inteira: abertura, movimento controlado pelo scroll, ação do CTA, escolhas, resumo e encerramento da marca. O gesto de clicar e responder é gravado na página real, sem montagem de resultados falsos. As versões pequenas em `/propostas/jornadas` são auxiliares de revisão e não aparecem na homepage.

O player não transforma a gravação em formulário interativo. O visitante do portfólio assiste ao fluxo. Os CTAs de Aura/Orla pertencem às marcas dentro do vídeo; os botões externos pertencem a Gabriel e abrem o WhatsApp oficial com contexto do nicho.

## Decisões verificáveis

- Uma capa e um filme por projeto, sem vários players de partes da mesma experiência.
- Controles nativos, reprodução por iniciativa do visitante, sem autoplay ou áudio.
- `preload=none` preservado; as capas aparecem antes da reprodução. Reproduzir um filme pausa o outro.
- Proporção 16:10, composição dentro da grade existente; nenhuma biblioteca de reprodução adicionada.
- Biblioteca de componentes compartilha apenas a apresentação/controle. Conteúdo e movimento de cada marca continuam específicos.
- Arquivos de filme têm manifestos de origem, duração, hash e capítulos, além de legendas. A captura é reproduzível por `scripts/capture-project-films.mjs`.

## Referências e pendência externa

As capturas enviadas pelo usuário (Jorge Web Pro e EvoPixel) fundamentam a seleção de trabalhos lado a lado, capa legível e identidade própria em cada projeto. Não comprovam que esses portfólios usem exatamente o player ou o fluxo adotado aqui; não foram observadas suas interações completas nesta tarefa.

Em 07/11/2026, novas tentativas de abrir Awwwards, Locomotive e Lusion foram negadas pela política de domínios do ambiente. Foi solicitado ao usuário habilitar os domínios para uma inspeção ao vivo. A verificação externa de portfólios premiados permanece pendente. Nenhuma nota, prêmio, certificação ou taxa de conversão é atribuída a esta implementação.

Foi possível consultar o README público de brunosimon/folio-2019, mas seu conteúdo de configuração não comprova a solução de galeria de filmes solicitada. Por isso não foi usado para justificar esta arquitetura. Repositórios de clones e listas com a palavra Awwwards não substituem a inspeção da referência original.

Esta entrega resolve a integração concreta usando a galeria existente, HTML video e FFmpeg/Chromium já disponíveis. A comparação com portfólios premiados deve registrar separadamente comportamento observado, adequação, divergências e escolhas; popularidade e semelhança visual não bastam.

### Referência adicional indicada pelo usuário

O usuário enviou `https://juanmora.co/` para avaliação. A tentativa de acesso recebeu `Tunnel connection failed: 403 Forbidden` em 07/11/2026. O conteúdo, o comportamento dos projetos e eventuais premiações não foram verificados. É um candidato indicado pelo usuário, não uma evidência observada. Para concluir a comparação, liberar `juanmora.co` no ambiente ou analisar uma gravação fornecida pelo usuário. Não acessar o mesmo conteúdo por rotas alternativas para contornar o bloqueio.

## Evidências da integração

- Filmes completos capturados em Chromium: Aura 32,23s/1280×800 e Orla 22,07s/1280×800, H.264 Baseline com faixa limitada. Os arquivos incluem a navegação de scroll e o roteiro local de CTA. Capítulos e hashes nos respectivos manifestos JSON.
- Contatos visuais extraídos dos filmes conferidos, incluindo movimentos, comparação Aura, perguntas e resumo. A captura ocultou apenas o portal de ferramentas de desenvolvimento quando presente; a versão definitiva foi gravada em servidor de produção.
- Capturas da grade e de cartões móveis em docs/preview/integrated-films/. Não houve alteração da estrutura dos outros quatro projetos.
- 23 testes aprovados: integração de dois filmes, carregamento sob demanda, reprodução exclusiva, hashes e capítulos, comparador Aura, galeria de 20 e os 17 modelos preservados. Build e lint aprovados.
- REA efetivamente executado sobre o portfólio local. Cenário e evidência em docs/research/rea/. A operação não substitui a comparação externa ainda bloqueada.
