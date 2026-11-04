# Referências escolhidas pelo usuário

4 de novembro de 2026. Seleção estética de efeitos, não aprovação de layout completo, paleta, copy final ou dependências.

## Tipografia Codrops: identificação confirmada no HTML

Fonte: https://github.com/codrops/OnScrollTypographyAnimations . Consultados src/index.html, src/index2.html e trechos pertinentes de src/js/index.js. Não houve inspeção renderizada nesta etapa.

| Texto original | Identificador | Mecanismo observado no JS do Set 1 |
| --- | --- | --- |
| Human / gratitude | data-effect4 | Caracteres convergem horizontalmente, escalonamento a partir do centro, ligado ao scroll |
| Intentionally / dramatic | data-effect5 | Caracteres partem de posições aleatórias e ganham opacidade |
| Blooming / flowers | data-effect6 | Rotação X dos caracteres com perspectiva e deslocamento vertical |
| Unfolding / Elegantly / Naturally | data-effect7 | Rotação Y, profundidade e entrada escalonada |
| Moon / Transportation | data-effect9 | Escala horizontal e deslocamento a partir do centro da tela |
| Feel because you have a heart… | Set 2, data-effect25 | Associação confirmada no HTML; comportamento ainda requer revisão específica do JS e navegador |
| Act because you have hands… | Set 2, data-effect27 | Associação confirmada no HTML; comportamento ainda requer revisão específica do JS e navegador |

A transcrição enviada tinha letras alteradas; a correspondência acima foi confirmada no código. O usuário escolheu as animações; não copiar os poemas como copy comercial.

## Cursor Shader Trail

https://github.com/BertovDev/cursor-shader-trail — README, package.json e LICENSE consultados. MIT, copyright Bautista Berto 2026. Usa React Three Fiber, Three WebGPU/TSL e textura de dados atualizada pela CPU para o rastro. Há seis pincéis segundo README. Não é transformação de layout acionada pelo scroll: o gatilho principal é o ponteiro.

Manifesto consultado: Next 16.1.6, React 19.2.4, Fiber ^9.5, Drei ^10.7.7, Three ^0.182.0. Próximo da stack do projeto, mas não comprova compatibilidade ou desempenho. Avaliar init/fallback, suporte real do renderer, movimento reduzido, toque e consumo antes de incorporar. Não adicionar painel de debug à experiência de produção. Selecionado pelo usuário como referência visual; local de aplicação e cores pendentes.

## Theatre tutorial

https://github.com/thebenezer/TheatreTutorial_Part1 — README, package.json e LICENSE consultados. MIT, copyright Ebenezer 2023. Tutorial de cubo com animação usando Theatre.js e Three.js; demo indicada: https://bouncy.vercel.app/ . Não é implementação pronta de scroll narrativo.

Dependências consultadas: Theatre core/studio ^0.6.0, Three ^0.142.0, Vite ^2.9.9, TypeScript ^4.5.4. Usar como referência de coreografia/editoração de timeline. Não transportar a stack antiga ou presumir necessidade de Theatre; comparar com timeline GSAP depois de definir o movimento. Não há demonstração executada neste workspace.

## Próxima entrega limitada

Uma galeria isolada com os efeitos de texto selecionados, frases provisórias claramente identificadas, uma corografia de cena e fallback. Conferir legibilidade, scroll natural, teclado, toque e movimento reduzido antes de compor o site inteiro. Não usar todos os efeitos em cada título. Paleta, fotografia e conteúdo são decisões separadas. Nenhuma dependência instalada ou interface alterada nesta pesquisa.
