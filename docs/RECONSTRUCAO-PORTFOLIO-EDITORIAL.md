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

## Revisão de movimento e correção de referência pessoal

A solicitação seguinte rejeitou os movimentos genéricos e informou que a capa usada era incorreta. O ZIP posterior `meu-retrato-emgrafitecomluzvermelha.zip` trouxe o original correto. O PNG foi copiado sem alterações para `public/images/hero/gabriel-approved-red.png` (SHA256 `98840395228353397319a18e8c3735f546d15e910e75345b7c602ab14f64ea2f`), usado na abertura e na apresentação pessoal. Os arquivos `gabriel-front.webp`, `gabriel.png` e `gabriel-contact.webp` mostram outros retratos no estúdio e não são a referência para o personagem. O usuário apontou também a referência incorreta na primeira geração do personagem: essa geração foi descartada, permanece fora da aplicação e não autoriza reutilizar aquele rosto. A segunda geração, já baseada na referência correta, também foi rejeitada por falta de semelhança. O componente e o MP4 experimental foram retirados da aplicação. Há um novo estudo apenas de rosto na conversa, aguardando avaliação de semelhança antes de outro cenário. Nenhum personagem foi aprovado ou entregue. O motor disponível gera imagens, não vídeo nativo; o teste de MP4 usou interpolação óptica de poses e não deve ser apresentado como vídeo gerado nativamente nem como movimento idêntico à referência.

A revisão de movimento usa o GSAP 3.15.1 já instalado, incluindo SplitText, sem dependência adicional. A fonte fornecida confirma SplitText, Lenis, transformação dos exemplos e cursor interpolado; a gravação confirma as fases da composição. Isso fundamenta os mecanismos escolhidos, não uma alegação de movimentos idênticos ou prêmio Awwwards.

- Abertura: fotografia, assinatura e amostra têm deslocamentos diferentes durante a saída.
- Títulos: revelação escalonada por palavras, reversível; o título com link preserva a semântica do link.
- Objetos: trajetórias e rotações alternadas, em vez de uma única entrada vertical.
- Galerias desktop: desdobramento do conjunto e dos cinco planos individuais; no celular continua o arraste horizontal. O retorno do scroll refaz a dobra.
- Pasta, fotografia da apresentação e painel de contato têm movimentos próprios.
- Pausa e movimento reduzido revertem as transformações; o conteúdo continua disponível sem JavaScript.

Evidência parcial, anterior à substituição da capa: `docs/preview/editorial-portfolio/gallery-reversible.mp4`, `gallery-folded.png`, `gallery-unfolded.png`. O MP4 geral foi regravado com o retrato correto e as novas transições, sem os personagens rejeitados. Estas alterações não encerram a revisão de fidelidade visual solicitada. Build, lint e sete testes Playwright passaram; conferência visual da capa cobriu desktop e celular. O personagem e seu vídeo continuam pendentes da avaliação de semelhança.

## Encerramento próprio em loop

A personagem aprovada foi animada com LivePortrait e está no rodapé da rota de revisão, sem alterar a homepage. Arquivo próprio: `public/videos/editorial/gabriel-avatar-loop-v1.mp4`, 11,1 s, 333 quadros, com duas piscadas adicionadas e expressão relativa suavizada. O brilho vermelho continua sendo CSS separado. Não reutiliza o rosto, cena ou áudio do vídeo do Juan.

O hash `#editorial-footer` e o player `/propostas/portfolio-editorial/previa` permitem avaliar o encerramento. O vídeo só baixa quando o rodapé fica visível e as preferências permitem; mantém poster sem JS, em movimento reduzido/economia de dados e em falha de mídia. Pausa fora da tela, com aba oculta, diálogo aberto ou controle global.

Método, procedência, limitações e medições em `docs/research/avatar-motion-github/expression-loop/README.md`. O resultado não é uma reprodução idêntica do estilo ou da coreografia; o movimento medido no avatar é mais contido. A avaliação estética do usuário continua necessária. Nenhum deploy foi feito.

## Correções após inspeção em 08/11/2026

Inspeção com scroll real em 1440×900 e 390×844 encontrou e corrigiu:

- A fotografia animada da apresentação vazava até 256 px sobre o contato e escondia o fundo do título do CTA. `.about` agora recorta a fotografia.
- O tema da navegação podia ficar errado por uma seção inteira após uma pequena reversão perto de um limite, porque duas seções cabiam na faixa observada. O tema agora segue a seção sob o logo, calculada a cada scroll.
- Títulos colidiam com o logo. Uma máscara na cor da seção passa sob a navegação, exceto na abertura, para não cobrir o retrato aprovado.
- A descendente de “precisa” cobria “No visual”; o rodapé começava sob a navegação; `.hook` deixava quase uma tela vazia no desktop.
- No celular, o controle de pausa virou ícone de 44 px na linha da navegação, mantendo o nome acessível.

`npm run lint` passa a ignorar `docs/research`, que guarda estudos e fontes de terceiros. `scripts/lib/record-local-page.mjs` deixou de depender de caminhos Linux. Três testes de regressão foram adicionados. O MP4 da prévia e as capturas desta pasta foram refeitos: 42,43 s, 960×600, já com o loop v2 descrito abaixo.

Evidência: 80 testes aprovados com o Chrome instalado na máquina, não o Chromium do Playwright, e sequência conferida em quadros extraídos do MP4. Não houve teste em iPhone físico ou Safari. Isso não constitui aprovação estética.

## Loop v11 no encerramento

As versões v1, v2, v3, v6 e v8 foram rejeitadas, e v4 e v5 foram aprovadas com pedidos de ajuste. Todas saíram de `public/`. A v7 foi aprovada no rosto e no queixo. O rodapé usa `gabriel-avatar-loop-v11.mp4`, que é a v7 com o trapézio (v9, aprovada), a piscada corrigida e um só olhar para os dois olhos, que antes discordavam e pareciam vesgos: 11,13 s, com a trajetória medida na gravação de tela enviada pelo usuário, boca fechada, íris, piscadas, sobrancelhas sem animação própria e vapor saindo do café. As capas de bandas foram trocadas por arte própria. Método, medições e limites em `docs/research/avatar-motion-github/reference-loop/README.md`.

A pedido do usuário, o queixo foi fechado. A v6 alargou a mandíbula pela foto real e escureceu o pescoço, o que mudou o rosto, e foi rejeitada. A v7 mantém o contorno da imagem aprovada, sobe a cabeça 14 px e continua a linha da própria mandíbula até fechar. Da foto real vem apenas a altura do queixo: lábio-queixo equivale a 36% da distância olhos-boca. As últimas linhas de pele repetem a linha limpa da imagem, sem esticar. O pescoço usa as cores da própria imagem, um tom abaixo do queixo. Na descida do aceno, o queixo entra atrás do monitor.

Depois de aprovar o queixo, o usuário pediu trapézio e ombros. A v8, com gola de jaqueta e linha de ombros desenhadas por código, foi rejeitada por parecer irreal. O usuário concluiu que basta o trapézio, sem ombros nem jaqueta. A v9 apenas abre as laterais do pescoço em curva até o monitor, na mesma pele, com leve queda de luz. O trapézio é decisão de desenho: a foto real o cobre com a jaqueta.

Medições no MP4 final, com o mesmo tipo de rastreamento da referência: correlação x 0,997, y 0,996 e inclinação 0,79. Amplitude de 0,61 e 0,62, contra 0,68 teóricos em 1280 px. Maior passo em um quadro: 3,30 px. Emenda (MAE RGB): fundo 0,023; cabeça 0,991, ante mediana de 1,090 entre quadros. Arquivo: H.264 Constrained Baseline, 1280×818, 334 quadros, 1.333.569 bytes, sem áudio. No celular, o recorte do vídeo deixa a caneca fora da tela.

## Enquadramento da abertura

O usuário apontou o cabelo cortado e animações cobrindo o rosto. A foto aprovada tem só 13 px entre o cabelo e a borda de cima, e o zoom de 13% no scroll cortava ainda mais. `scripts/extend-hero-portrait.py` gera `gabriel-approved-red-framed.webp` com margem nova acima, nas laterais e abaixo. A área original da foto é copiada sem alteração, conferida pixel a pixel pelo script. Só o fundo e a continuação da jaqueta são sintetizados. A abertura não tem mais zoom; nome, miniatura e oferta descem com a foto e somem antes de alcançar o rosto. Regressão em `tests/e2e/editorial-portfolio.spec.ts` (1366×768). A seção “Sobre” continua usando a foto original.

## Música do encerramento

Desligada por padrão desde a decisão do usuário de não prospectar clínicas com o player. Motivos: letras explícitas, aviso “Use o Spotify” e prévias de 30 s para quem não tem login. Sem a configuração, nem o botão nem qualquer requisição ao Spotify existem. Para religar: `NEXT_PUBLIC_FOOTER_MUSIC=on` em `.env.local`, seguido de novo build. O restante desta seção descreve o player quando ligado.

O botão “Ouvir Limp Bizkit” abre o player oficial do Spotify com três álbuns escolhidos pelo usuário: Significant Other, Gold Cobra e Results May Vary. Eles se revezam ao chegar perto do fim da última faixa de cada um, e o botão “Próximo álbum” troca na hora. A música pausa quando o visitante sai do rodapé e volta com ele, exceto se ele mesmo a pausou. O nome de usuário do Spotify não é necessário e não está no código.

Teste no Spotify real, sem login, em Chrome com a política padrão de autoplay: o botão passou pelos três álbuns e voltou ao primeiro. Significant Other tocou inteiro em prévias e, após a última faixa, passou sozinho para Gold Cobra, aos 474 s. A troca automática de Gold Cobra e de Results May Vary usa a mesma lógica, com as últimas faixas lidas da lista oficial, mas só foi testada com Spotify simulado. Com a conta do usuário logada no painel do app, o player a reconheceu (“Salvo no Spotify”), mas seguiu em prévia: esse navegador não tem Widevine (`NotSupportedError`), então o teste de faixa inteira precisa ser feito em um Chrome comum. Também não foi testado o celular físico. O caso de pausa feita pelo visitante só foi testado com Spotify simulado.

Registro da dependência, conforme `docs/METODO-DE-QUALIDADE.md`:

- **Problema:** tocar música comercial sem hospedar o arquivo.
- **Alternativas:** arquivo próprio exigiria licença; faixa gerada foi testada e retirada a pedido do usuário; Web Playback SDK exigiria login Premium de cada visitante.
- **Fonte:** `https://open.spotify.com/embed/iframe-api/v1`, versão mantida pelo Spotify e sem pacote npm. Documentação em `https://developer.spotify.com/documentation/embeds`.
- **Custo:** zero até o clique. Depois, script e iframe de terceiros, que podem gravar cookies do Spotify.
- **Limites:** o site não transmite a conta do usuário aos visitantes. Sem login no Spotify, o player toca prévias curtas; relatos da comunidade indicam que a faixa inteira exige Premium e, em geral, navegador de desktop. A música não sincroniza com o movimento. As letras são explícitas e os termos do Spotify devem ser revistos antes de publicar. A permissão de uso não foi avaliada juridicamente.
