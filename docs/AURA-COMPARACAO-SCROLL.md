# Aura — comparação por região

Pedido de 05/11/2026: movimento mais fluido, foco mais marcado e antes/depois durante cada aproximação.

A câmera agora chega ao enquadramento, permanece estabilizada durante a comparação e segue ao próximo detalhe. Interpolação quintic smoothstep e scrub de 0,38 s; percurso ampliado. A fonte mantém resolução nativa 1024×1536, sem alegação de 4K ou giro 3D.

Uma variação anterior da personagem adulta foi gerada usando o retrato aprovado como referência. As diferenças são sutis; não constituem prova de tratamento ou previsão clínica. Recortes locais com bordas suaves substituem apenas malar, lábios, queixo e nariz, preservando a base original no restante. Conforme o scroll avança, cada recorte anterior desaparece e revela o retrato aprovado, acumulando as mudanças. Na volta, a comparação reverte. O nariz representa uma variação visual, sem atribuir estreitamento ou alterações ósseas a preenchimento.

Legendas visíveis identificam antes/depois como simulação. Movimento reduzido, pausa e ausência de JS oferecem comparações em detalhes nativos. Se a imagem comparativa falhar, permanece o capítulo original e a comparação é indicada como indisponível. Nenhuma dependência adicional: React, Canvas2D e GSAP já existentes.

Critérios: câmera imóvel durante a alteração local; pixels mudam e retornam ao mesmo estado ao reverter; texto e navegação funcionam no celular; movimento reduzido e sem JS preservam conteúdo. Testes técnicos não significam aprovação estética. O recorte ilustrativo não equivale a simulação anatômica e as diferenças geradas ainda dependem da avaliação visual do usuário.

Validação: lint e build aprovados. Oito cenários Playwright aprovados, incluindo câmera estável com pixels distintos entre antes/depois, retorno idêntico ao estado inicial, móvel, acessibilidade, falha da imagem, pausa e ausência de JavaScript. Um cenário excedeu o tempo durante captura concorrente e passou na repetição isolada (43,5 s). Não houve teste em aparelho físico nem validação clínica. Capturas e gravação em docs/preview/aura-comparison.

Prévia: movement.gif está acelerado em 2,5× para facilitar a inspeção; desktop.mp4 mantém o tempo da captura no navegador. A gravação não registrou erros de execução. Captura móvel inspecionada em 390×844.
