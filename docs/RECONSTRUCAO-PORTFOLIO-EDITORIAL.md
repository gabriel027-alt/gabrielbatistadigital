# Reconstrução editorial a partir do pacote Juan Mora

## Material efetivamente recebido

Pacote `juanmora-analysis.zip`, 35 arquivos, 20.304.426 bytes descompactados. Inclui vídeo de navegação de 46,33s (1352×720), capturas desktop/móvel, DOM renderizado, quatro CSS, dez JS e três fontes. Extraído na biblioteca local, fora da aplicação. Arquivos e hashes em docs/research/juan-mora-package/manifest.json.

Foram inspecionados o relatório, JSON, CSS pertinente, scripts de interação e estados da gravação em intervalos de quatro segundos. As capturas de homepage e hero corroboram o material. O arquivo fornecido não permite verificar uma premiação no Awwwards. O acesso externo continua bloqueado, mas a referência agora possui evidência visual e técnica local.

## Correções ao relatório do Antigravity

1. O trecho de 5.215 a 6.122px é uma chamada “Work” com pasta que leva a work.html. Não é a grade dos seis vídeos. O próprio DOM e o vídeo mostram os vídeos nas faixas dos serviços.
2. `03-desktop-work-selected.png` mostra a transição com formas; o nome não descreve corretamente o conteúdo.
3. Capturas de página inteira pegaram cartões em rotação, textos sobrepostos e longos intervalos de animação. Não copiar esses espaços e sobreposições como se fossem o layout final. A gravação temporal prevalece para esses estados.
4. A alegação de “paridade total” com REA não é demonstrada. O Antigravity relata Playwright/CDP; não há evidência de parsing AST no pacote que justifique todas as afirmações.
5. `preload=metadata` e autoplay não comprovam carregamento sob demanda por visibilidade. A desativação de smoothTouch não comprova comportamento em um iPhone físico.
6. Nenhuma licença da fonte Goga ou das mídias pessoais do autor veio no pacote. Servem à análise; não foram incorporadas à aplicação.

## Percurso reconstruído

Rota de revisão: `/propostas/portfolio-editorial`. Homepage atual, Aura, Orla, seis destaques existentes e catálogo de 20 preservados.

| Referência observada | Reprodução com material próprio | Limite explícito |
| --- | --- | --- |
| Abertura fotográfica dominante, navegação fixa, nome em escala monumental e amostra entre palavras | Fotografia aprovada de Gabriel, nome Gabriel Batista e amostra Orla | Não há filmagem própria de Gabriel na mesa; não se reutiliza a do autor |
| Gancho tipográfico, botão e formas com deslocamento relativo | Frase sobre jornada de navegação, contato e formas próprias em CSS | Formas são composição CSS; não cena WebGL ou assets do autor |
| Quatro serviços com amostras em perspectiva | Quatro blocos específicos do portfólio, imagens próprias e loops Aura/Orla | Os outros projetos continuam amostras estáticas onde não há filme |
| Chamada Work com pasta animada | Pasta própria em CSS que expande a seleção de seis trabalhos | A página work.html original não foi recebida; expansão local é adaptação |
| Apresentação pessoal com foto, tipografia ampla e princípios | Fotografia de Gabriel e processo sem anos, prêmios ou clientes inventados | Mesma foto autorizada, sem inventar poses ou depoimentos |
| Convite de contato e rodapé monumental | WhatsApp oficial, assinatura e stack real | Sem copiar email, identidade ou claims de Juan |

A identidade usa o ritmo e a família cromática da referência. Na superfície clara, títulos foram escurecidos para leitura, em vez de copiar pêssego de baixo contraste. Manrope licenciada substitui Goga; tracking, tamanho e quebras foram redesenhados para as palavras em português.

## Movimento e dependências

GSAP 3.15.1 existente: parallax, entrada ligada ao scroll e abertura dos planos de mídia. Lenis 1.3.17 foi consultado no npm (MIT) e adicionado com versão fixa, sem scripts de instalação, para reproduzir a inércia observada. Funciona apenas nesta rota; não modifica o layout global. É destruído ao sair, pausar ou ativar movimento reduzido. Navegação e conteúdo ficam em HTML sem JS.

Autoplay de prévias foi autorizado pela direção de reproduzir a experiência completa, aplicado somente à nova rota de revisão. Não foi ativado na homepage existente. Loops próprios: três segundos de gravação do projeto seguidos pelo retorno reverso, seis segundos no total, 640×400, sem áudio. Não são resultados clínicos novos ou vídeo gerado do rosto.

As prévias só recebem src quando visíveis e permitidas. Pausam fora da tela, ao ocultar a aba, abrir diálogo, pausar o movimento ou usar movimento reduzido. Economia de dados impede carregar as prévias. Falha de autoplay mantém a imagem e a ação por clique. Filmes completos ficam em diálogo com controles, legenda e CTA de Gabriel fora do vídeo.

Não foram adicionados Webflow, Unicorn Studio, jQuery, scripts de analytics do autor nem suas fontes. Nenhum código de aplicação foi copiado do export.

## Critérios de revisão

Comparar abertura, trecho tipográfico, amostras abrindo em perspectiva, pasta fechada/aberta, apresentação e contato, em desktop/móvel. Verificar pausa, movimento reduzido, economia de dados, fallback sem JS, teclado e filmes por clique. Testes técnicos e reprodução de referência não constituem premiação ou conversão comprovada.

## Inspeção e evidência de revisão

A nova versão foi renderizada com fotografia e amostras próprias. A captura móvel do material recebido mostrou uma direção distinta do desktop: marca central no topo e navegação junto à base. A implementação móvel foi ajustada conforme esse estado, em vez de encolher o nome gigante do desktop.

Primeira rodada identificou contraste insuficiente do monograma da pasta e recorte da fotografia no móvel; ambos corrigidos. Nove testes de navegador passaram na rodada seguinte, incluindo a nova página, movimento reduzido/economia de dados/sem JS, reprodução do filme em diálogo e regressões do comparador Aura e da galeria atual. Nenhuma violação axe nos estados testados, sem certificação integral de acessibilidade. A captura final também verificou os estados intermediários do movimento.

O REA foi executado novamente sobre `custom-interactions.js` e `script-8.js` recebidos. Analisou dois JS, visitou 199.515 nós AST, identificou 303 módulos e não reportou falhas de parsing. Resumo em docs/research/juan-mora-package/rea-summary.json. É análise estática com limites de retenção, não prova de execução, licenciamento ou fidelidade visual. O resultado completo permanece na biblioteca local, sem incorporar código do autor ao produto.

Prévia em `/propostas/portfolio-editorial/previa`, com controles, download e legendas. Fonte reproduzível: scripts/capture-editorial-portfolio.mjs, usando Chromium e FFmpeg locais. Screenshots em docs/preview/editorial-portfolio/. A gravação é uma demonstração automatizada no desktop; não teste em dispositivo físico.

### Rodada final

Build, lint e tipagem aprovados. Dez testes Playwright passaram, somando os cinco da nova experiência (incluindo o player de prévia) e regressões do comparador Aura e dos filmes na homepage. Capturas móveis finais atualizadas após ajustar marca central/navegação inferior. MP4 da prévia: 40,37s, 960×600, aproximadamente 2,55 MB. Testada sua reprodução no Chromium. Sem deploy e sem substituição da homepage.
