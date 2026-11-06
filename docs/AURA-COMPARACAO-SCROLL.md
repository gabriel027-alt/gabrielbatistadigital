# Aura — comparação por região

Pedido de 05/11/2026: movimento mais fluido, foco mais marcado e antes/depois durante cada aproximação.

A câmera agora chega ao enquadramento, permanece estabilizada durante a comparação e segue ao próximo detalhe. Interpolação quintic smoothstep e scrub de 0,38 s; percurso ampliado. A fonte mantém resolução nativa 1024×1536, sem alegação de 4K ou giro 3D.

Uma variação anterior da personagem adulta foi gerada usando o retrato aprovado como referência. As diferenças são sutis; não constituem prova de tratamento ou previsão clínica. Recortes locais com bordas suaves substituem apenas malar, lábios, queixo e nariz, preservando a base original no restante. Conforme o scroll avança, cada recorte anterior desaparece e revela o retrato aprovado, acumulando as mudanças. Na volta, a comparação reverte. O nariz representa uma variação visual, sem atribuir estreitamento ou alterações ósseas a preenchimento.

Legendas visíveis identificam antes/depois como simulação. Movimento reduzido, pausa e ausência de JS oferecem comparações em detalhes nativos. Se a imagem comparativa falhar, permanece o capítulo original e a comparação é indicada como indisponível. Nenhuma dependência adicional: React, Canvas2D e GSAP já existentes.

Critérios: câmera imóvel durante a alteração local; pixels mudam e retornam ao mesmo estado ao reverter; texto e navegação funcionam no celular; movimento reduzido e sem JS preservam conteúdo. Testes técnicos não significam aprovação estética. O recorte ilustrativo não equivale a simulação anatômica e as diferenças geradas ainda dependem da avaliação visual do usuário.

Validação: lint e build aprovados. Oito cenários Playwright aprovados, incluindo câmera estável com pixels distintos entre antes/depois, retorno idêntico ao estado inicial, móvel, acessibilidade, falha da imagem, pausa e ausência de JavaScript. Um cenário excedeu o tempo durante captura concorrente e passou na repetição isolada (43,5 s). Não houve teste em aparelho físico nem validação clínica. Capturas e gravação em docs/preview/aura-comparison.

Prévia: movement.gif está acelerado em 2,5× para facilitar a inspeção; desktop.mp4 mantém o tempo da captura no navegador. A gravação não registrou erros de execução. Captura móvel inspecionada em 390×844.

## Ajuste de entrada — 06/11/2026

A abertura mantém o rosto inteiro. O capítulo seguinte começa imediatamente no close do zigomático, sem uma segunda apresentação do rosto inteiro nem espera antes do primeiro foco. Ordem: zigomático → lábios → queixo/mandíbula → nariz → retorno final ao conjunto. As pausas de comparação e o retorno pelo scroll foram remapeados para essa sequência mais curta. A alternativa estática também abre com enquadramento aproximado.

Verificação desta entrada direta: lint/build e os oito testes Playwright aprovados. Captura second-scene-close.png inspecionada: primeiro texto e enquadramento do capítulo são malar, no estado anterior ilustrativo; aproximação já ativa em progresso zero. Novo registro de scroll em direct-focus.mp4.

## Abertura contínua, sem moldura — 06/11/2026

O usuário esclareceu que a moldura expansível da abertura também deveria sair. A abertura passou a integrar o mesmo palco/canvas dos focos, com um único retrato e câmera: rosto inteiro → aproximação suave ao malar → comparação → demais regiões. Os primeiros 18% do percurso conduzem ao malar; não há expansão de clip-path, troca entre duas fotografias ou texto intermediário cobrindo o rosto. O título inicial desaparece enquanto o texto regional entra. O retorno refaz o mesmo caminho. Pausa/movimento reduzido/sem JS mantêm a composição estática e as comparações acessíveis.

Validação da abertura contínua: build/lint aprovados; oito cenários aprovados, com repetição do teste de câmera após retirar o texto intermediário residual. Esse teste verifica enquadramento inicial de rosto inteiro, aproximação intermediária e chegada ao malar no mesmo canvas. Nova evidência: continuous-opening.png e unframed-opening.mp4.

## Preservar simulações em janelas baixas

A animação tinha uma condição indevida de altura mínima de 700 px, que exibia o fallback estático com retratos repetidos em janelas mais baixas. A altura não representa preferência de movimento: removida essa restrição de JS/CSS, preservando hero contínua, câmera, quatro comparações regionais e reversão. A alternativa estática permanece para movimento reduzido, pausa, ausência de JS ou falha de recursos. Layout compacto ajusta tamanhos de texto. Teste de regressão em 1440×640 percorre as quatro regiões e verifica que a comparação muda pelo scroll, com os detalhes estáticos ocultos.

Verificação: lint/build e nove testes aprovados, incluindo regressão em janela compacta com todos os focos e antes/depois por scroll, reversão, celular, navegação, acessibilidade e fallback. Evidência compact-scroll.png / compact-scroll.mp4.

## Unidade de acabamento: zigomático

Nova fonte malar-before-refined.webp gerada especificamente para o malar, com o retrato aprovado como referência. Apenas as bochechas são incorporadas por máscaras elípticas suaves, agora limitadas verticalmente para não alcançar os olhos. Os demais focos conservam suas fontes e coreografia. A câmera permanece estável durante a comparação e a barra Antes/Depois indica o avanço visual, sem representar dose, intensidade de tratamento ou previsão clínica. O texto explica a observação da região em linguagem direta. Falha no novo recurso mantém o recorte anterior. A resolução continua nativa 1024×1536.

Esta unidade exige avaliação estética do usuário antes de repetir o refinamento nas demais regiões. A geração alterou também alguns detalhes fora das bochechas; eles não são incorporados ao canvas, que preserva a base original nessas áreas. A diferença malar continua discreta e não constitui validação clínica.

Verificação desta unidade: lint/build e nove cenários aprovados; o cenário de pausa/reversão passou após passar a aguardar explicitamente a inicialização da câmera antes de rolar. Comparação com câmera estável muda pixels e retorna ao estado anterior; região dos olhos permanece idêntica. Capturas before/middle/after e gravação sem erros em docs/preview/aura-malar-refined. Não se trata de aprovação estética ou clínica.
