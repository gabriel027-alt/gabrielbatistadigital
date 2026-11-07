# Juan Mora: análise do HTML fornecido pelo usuário

## Escopo e procedência

Em 07/11/2026, o usuário forneceu um HTML de 40.190 bytes intitulado “Juan Mora | Design Director - Web and Brand Design Specialist”. O comentário do documento indica Webflow e publicação em 15/05/2026. São declarações do arquivo, não verificação do estado atual do site. O domínio continua bloqueado neste ambiente; o upload permite análise local legítima.

Não vieram o CSS, `js/webflow.js`, os JSONs Lottie, imagens ou os vídeos apontados pelo HTML. Não foram baixados por intermediários nem executados os scripts/analytics do autor. Não se reconstruiu uma aparência aproximada com assets substitutos para chamá-la de referência verificada.

Inventário e hash do HTML em `docs/research/juan-mora/html-observations.json`. A cópia recebida e evidência completa do REA permanecem na biblioteca local `/workspace/library-files/references/juan-mora-user-supplied/`, fora da aplicação e do código distribuído.

## O que o arquivo demonstra

### Vídeo como evidência do serviço

Há seis elementos video nas áreas de serviços, todos com `autoplay`, `loop`, `muted`, `playsinline`, `preload=metadata` e poster, sem atributo controls. Fontes:

- home-ampli.mp4 e home-shopping.mp4 em “Websites & Landing pages”.
- home-ampli-brand.mp4 e home-brudget1.mp4 em “Visual Branding”.
- home-alena.mp4 e home-apechain.mp4 nas demais amostras de serviços.

Os vídeos aparecem em contêineres `.mask-img-service` e `.cont-imgs-service`, intercalados com imagens. Um sétimo vídeo, desk_jm3.mp4, tem outro contexto e não deve ser contado como projeto sem inspecionar seu conteúdo.

Isso confirma uma intenção declarativa de reprodução automática silenciosa em loop, integrada ao conteúdo de serviços. Não comprova que o autoplay funcione em todos os aparelhos, que os vídeos carreguem apenas quando visíveis ou que o progresso deles seja controlado pelo scroll. O HTML recebido não contém essa vinculação de currentTime ao scroll.

A página principal é uma apresentação de capacidade e serviços; há links para `work.html` e `about.html`. A página de trabalhos não foi fornecida. Não confundir as amostras desta homepage com a arquitetura completa do portfólio.

### Movimento e identidade

- GSAP, SplitText, ScrollTrigger e CustomEase são referenciados.
- Lenis é inicializado com lerp 0.1, wheelMultiplier 1, smoothTouch false e atualização por requestAnimationFrame.
- Um IntersectionObserver alterna a classe de tema da navegação conforme data-nav das seções.
- O cursor tem acompanhamento interpolado com ticker GSAP; os controles exibem feedback de hover/cópia de email.
- Os CTAs animam ícones de entrada/saída. Lottie e Unicorn Studio são declarados para elementos de identidade.

Esses comportamentos estão no HTML/JS incluído. Não há evidência suficiente para reconstruir as coreografias Webflow que residem em arquivos ausentes. Atributos data-barba não demonstram, sozinhos, uma implementação ativa de navegação Barba. A presença de ScrollTrigger não demonstra que todo vídeo seja scrubbed.

### Conversão do profissional

A narrativa liga serviços, exemplos visuais, razões para contratar e um CTA final “Let's talk”, com contato por email. Isso é diferente das jornadas de leads dentro dos sites dos projetos. O conteúdo do autor, seu contato e sua afirmação de experiência pertencem a ele e não devem ser transferidos para Gabriel.

## REA efetivamente utilizado

Foi executado `analyze-javascript-application` sobre um diretório que contém os quatro scripts inline extraídos e um package.json de identificação, sem dependências instaladas nesse material. REA 6.8.0/Node 24.22.1 registrou:

- quatro arquivos JavaScript analisados;
- zero falhas de parsing;
- 1.061 nós AST visitados;
- cinco arquivos relevantes no inventário (incluindo o manifest de identificação).

Resumo verificável em `docs/research/juan-mora/rea-summary.json`. A análise é estática e derivada, não execução no navegador. Seu resumo de aplicações Electron/IPC não é uma medida de qualidade deste website. A interpretação de UX acima também depende da leitura direta do HTML e do JS; não atribuir ao REA uma certificação comercial ou recuperação de componentes ausentes.

## Aplicação recomendada ao portfólio de Gabriel

| Camada | Função | Material próprio |
| --- | --- | --- |
| Prévia na vitrine | Comunicar rapidamente a identidade e o movimento | Trechos curtos de Aura e Orla: rosto/regiões e panorama/galeria |
| Filme completo por clique | Demonstrar a experiência e a jornada comercial | Os filmes completos já integrados: abertura → scroll → CTA → escolhas → resumo |
| CTA externo | Permitir contratar Gabriel | WhatsApp oficial com contexto de clínica ou negócio imobiliário |

A referência dá fundamento à utilização de imagens em movimento como prova visual dos serviços. A separação em prévia curta e filme completo é uma proposta de adaptação nossa; o arquivo não demonstra que Juan Mora faça exatamente esse fluxo de abertura por clique.

Preservar a seleção de seis trabalhos e o catálogo dos 20 modelos. Não colocar várias partes do mesmo projeto como players independentes. Dar prioridade ao gesto visual distintivo na prévia, deixando o formulário detalhado no filme completo.

A versão atual usa reprodução manual e preload=none por decisão anterior. Acrescentar prévias automáticas altera esse comportamento; esta análise não ativa autoplay automaticamente. Se escolhido: reprodução apenas quando visível, sem áudio, sem baixar todos os vídeos na chegada; pausa fora da tela, opção de parar, alternativa com movimento reduzido e economia de dados, fallback para autoplay negado e experiência equivalente no toque/teclado. Esses cuidados são requisitos propostos para a nossa implementação, não propriedades comprovadas no HTML do autor.

Reutilizar GSAP já instalado. Não importar Webflow, Lenis, Unicorn Studio ou múltiplas versões de GSAP apenas por aparecerem na referência. O HTML carrega GSAP mais de uma vez e menciona mais de uma versão de Unicorn; isso pede investigação, não reprodução automática. Sem CSS e mídia, paleta, dimensões, duração, responsividade e desempenho exatos continuam pendentes.

## Critério de validação

O documento serve como referência técnica concreta para vídeo dentro da narrativa comercial. Não comprova premiação Awwwards, conversão, acessibilidade ou performance. Para analisar a execução visual exata, ainda são necessários o CSS e os assets relevantes ou uma gravação da navegação. Nenhuma mudança visual ou de reprodução foi aplicada à homepage nesta etapa de análise.
