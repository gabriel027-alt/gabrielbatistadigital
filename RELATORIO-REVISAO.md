# Revisão — sequência e conteúdo

## Problema corrigido

O dissolve entre dois retratos criava uma dupla exposição durante o scroll. A nova hero tem nove quadros independentes, desenhados um de cada vez em canvas opaco. Os intermediários foram gerados com autorização a partir das imagens aprovadas e ordenados por composição. A sequência não é uma filmagem nem um giro 3D; pode haver diferenças entre as poses geradas.

## Experiência e desempenho

Nove variantes desktop (1280×720) e nove mobile (768×432), aproximadamente 946 KB no total. A variante da visita é escolhida na primeira carga, com cache local em memória. Carregamento de quadro incompleto mantém o anterior. Movimento reduzido ou economia de dados mantém abertura estática. Sem canvas/JS, a imagem HTML continua disponível.

Corrigida uma condição de corrida ao redimensionar: o canvas não depende mais de um elemento de imagem cujo srcset pode recarregar. Limpeza de RAF, observer e listeners preservada. Testes de canvas verificam alpha=1 e todos os nove índices, além de presença de pixels após resize.

## Conteúdo

Seis imagens novas para eliminar a repetição: Héritage, Nocturne, Pavilhão Uno, Refúgio Mineral, primeira conversa e continuidade do cuidado. Coleções, fichas, descrições e detalhes têm conteúdo distinto. A seleção modifica imagem e informação, em vez de apenas mudar o recorte.

Serviços ganharam contexto, entregáveis e limites. Processo explicita a entrega de cada etapa. FAQ com seis questões de escopo, atualização, custos de ambiente, SEO e conceitos fictícios. O contato comercial continua exclusivamente em 5538998267717.

## Validação

Build, lint sem avisos, TypeScript estrito e 15 testes de Chromium passaram. Cobertura inclui rotas, segurança já existente, contato, diagnóstico, teclado, tabs, carrossel, temas, acessibilidade automatizada WCAG, limites responsivos, todos os frames, desenho opaco, pausa, redução de movimento, resize e conteúdo distinto dos protótipos.

Capturas desktop/mobile foram inspecionadas. Não houve validação em Safari/Firefox/Windows nem medição Lighthouse. Os mockups são capturas das páginas renderizadas, não imagens que simulam sites inexistentes.

Foto lateral original preservada: SHA-256 cc668c5536f5c845dc8ce69deba627bd5fe305ceb0d006cbf96fb9db81f16a74.
