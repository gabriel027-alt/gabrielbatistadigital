# Vanguard: primeira unidade de revisão

## Pedido e escopo

O usuário avaliou que a maioria dos projetos do portfólio está abaixo do nível de Aura e Orla e escolheu começar pela Vanguard. Rota nova de revisão: `/propostas/vanguard`. A página atual em `/conceitos/vanguard`, os cartões do portfólio e o catálogo ficam preservados até a aprovação desta direção.

Marca fictícia: Vanguard, estúdio de arquitetura minimalista. Materiais existentes: três fotografias geradas de 1440×960 (`public/images/concepts/vanguard*.webp`: Casa Horizonte, Pavilhão Uno, Refúgio Mineral) e os textos de `lib/concept-content.ts`. Não há gerador de imagem neste ambiente. São estudos, não obras executadas; nenhuma metragem, cliente, prêmio ou endereço é inventado.

## Gramática

Desenho técnico, o vocabulário do próprio público de um estúdio de arquitetura. Não repete a galeria lateral da Orla nem a câmera de rosto da Aura. A página começa como folha mineral; o projeto é desenhado em linhas e só então vira fotografia. Anotações de projeto explicam as decisões apontando elementos reais da imagem.

- Paleta: papel mineral #dddbd5, grafite #1d1c1a, linha #2a2926, cinza #57554f (era #6c6962, reprovado no contraste AA: 3,95:1), luz #f4f1ea. Sai do concreto e da sombra da própria fotografia, sem dourado genérico de luxo e sem o creme com terracota padrão.
- Tipografia: Manrope já licenciada no projeto, em peso leve no título. Nenhuma dependência nova.
- As linhas seguem coordenadas medidas na fotografia (balanço 40–100% × 0–40%, abertura 38–60% × 46–62%, espelho d'água abaixo de 66%). Um quadro com proporção 3:2 contém foto, desenho e anotações; por isso os três ficam alinhados em qualquer tela.

## Roteiro de movimento da abertura

Gatilho: scroll vertical, palco fixo por cerca de 3,2 telas, controlado por GSAP/ScrollTrigger já instalado.

| Progresso | Estado |
| --- | --- |
| 0–10% | Folha mineral. A linha do chão se desenha. As letras do título partem afastadas e se juntam a partir do centro (efeito “data-effect4” escolhido em REFERENCIAS-ESCOLHIDAS-MOVIMENTO.md) |
| 8–38% | As arestas do balanço, do pilar e da abertura se desenham em sequência |
| 38–55% | A fotografia surge primeiro pela abertura de vidro e se expande até a tela inteira; as linhas clareiam sobre ela; o título passa a claro |
| 55–100% | As linhas recuam; três anotações aparecem (balanço, abertura, espelho d'água); aproximação lenta da câmera |

- Retorno do scroll: tudo é controlado pela posição, então a volta desfaz na ordem inversa até a folha.
- Celular: o quadro centraliza em 60% da largura da fotografia, onde estão balanço e abertura. A anotação do espelho d'água fica só a partir de 700 px, porque no celular cobria o título.
- Movimento reduzido, pausa ou sem JavaScript: sem palco fixo; fotografia, linhas e anotações aparecem no estado final, e o texto segue em fluxo normal.

## Jornada completa (método de cenas aplicado em 10/11/2026)

Adaptação do método analisado em ANALISE-SITES-INCRIVEIS.md, sem o motor nem arquivos do pacote:
- jornada em cenas, curva de energia, um pico só e movimento-assinatura;
- trava contra repetição e verificação da rolagem renderizada.

A entrevista não foi repetida, porque o brief já existe (marca fictícia, três fotografias geradas, textos de concept-content). As emoções da tabela são hipóteses de intenção, não medidas com público.

| Cena | O visitante vê | Deve passar a entender | Energia | Família de movimento |
| --- | --- | --- | --- | --- |
| 1. O traço vira casa | Folha, linhas medidas, fotografia pela abertura | O estúdio pensa a casa antes da imagem | Sobe até alta | Assinatura: desenho técnico → foto (palco fixo 3,2 telas) |
| 2. O pátio como centro | Texto e ficha do estudo | Qual é o partido do projeto | Baixa | Leitura sem palco fixo |
| 3. **Pico: o percurso** | Câmera percorre a casa, do espelho d'água à sombra do balanço e à abertura, com a rota se desenhando no chão | Arquitetura é sequência de passos, não fachada | Máxima, rolagem mais longa (4 telas) | Câmera dentro da foto + rota desenhada (diferente da cena 1, que é desenho → revelação) |
| 4. Cada lugar pede uma resposta | Pavilhão Uno e Refúgio Mineral | O método muda com o lugar | Média | A fazer: mudança de fundo para o escuro do Refúgio |
| 5. Fechamento | Nome da marca e uma única ação | Saída resolvida | Baixa | A fazer: definir a ação local (sem contato real nem obra executada) |

Trava contra repetição, comparando com Aura e Orla:
- abertura: desenho técnico, contra rosto/câmera e fotografia lateral;
- efeito do pico: rota no chão com câmera, contra comparação regional e galeria lateral;
- assinatura: linhas medidas, contra fusão regional e trilho;
- paleta: mineral, contra berinjela e areia;
- estrutura das cenas.

Os cinco itens diferem.

### Roteiro do pico (cena 3)

Gatilho: scroll, palco fixo de cerca de 4 telas (GSAP/ScrollTrigger com scrub). Uma única câmera sobre `vanguard.webp`, com escala máxima de 1,9 porque a imagem tem 1440 px de largura.

| Progresso | Estado |
| --- | --- |
| 0–12% | Casa inteira escurecida; “O percurso” entra |
| 12–40% | Câmera desce ao espelho d'água; rota começa na água; etapa 1 |
| 40–68% | Câmera sobe à sombra do balanço; rota atravessa o pátio; etapa 2 |
| 68–100% | Câmera fecha na abertura de vidro; rota chega ao vão; etapa 3 |

- Retorno do scroll: a cena desfaz em ordem inversa.
- Celular: a mesma câmera, com as etapas na base sobre a sombra.
- Movimento reduzido, pausa ou sem JavaScript: foto com a rota completa e as três etapas em lista.
- As etapas são texto sem links ou controles, para que nada invisível receba foco.

## Critérios de aceite desta unidade

- As linhas coincidem com as arestas da casa na fotografia (conferir por captura).
- Título legível sobre a folha e sobre a fotografia.
- Avanço e retorno sem travar o scroll; pausa disponível.
- 360, 390, 768 e 1440 px sem overflow horizontal da página.
- Movimento reduzido e sem JavaScript com conteúdo completo.
- Gravação em vídeo da sequência; testes técnicos não equivalem a aprovação estética.

## Evidência registrada em 10/11/2026

Técnica:
- `tests/e2e/vanguard-proposal.spec.ts`, 3 testes aprovados:
  - Folha em branco, linhas desenhadas antes da foto, foto e anotações no fim e retorno até a folha.
  - Pausa e reativação; movimento reduzido remove o palco e o botão.
  - Sem overflow em 360/390/768/1440; axe WCAG 2.1 AA sem violações; nenhum link de WhatsApp.
  - Sem JavaScript, título e estudo aparecem com a foto visível.
- Lint, typecheck e build de produção aprovados. Abertura com cerca de 1980 px de scroll no desktop e 1857 px no celular; nenhum erro de console.

Correções feitas durante a verificação:
- As linhas apareciam tracejadas antes de serem desenhadas. Causa: `vector-effect: non-scaling-stroke` mede o tracejado em pixels de tela. O desenho passou a usar viewBox 1500×1000 em unidades reais, sem esse efeito.
- Linha do espelho d'água e aresta superior do balanço reajustadas após sobreposição em vermelho sobre a fotografia.

Visual:
- Capturas da sequência (0 a 100% e retorno) e vídeos em `docs/preview/vanguard/` (`opening-desktop.mp4`, `opening-mobile.mp4`).
- Pontos para o usuário avaliar:
  - Durante a convergência, as letras se sobrepõem por um instante.
  - Perto de 50% do scroll, o título passa de escuro a claro sobre a foto.
  - No celular, o cabeçalho escuro fica sobre o concreto no estado estático.
- Aprovação estética pendente.

## Evidência do pico (cena 3), 10/11/2026

Técnica:
- Novo teste em vanguard-proposal.spec.ts, aprovado em duas repetições. Ele confere:
  - a etapa visível em 30/58/100% do scroll;
  - a rota desenhada além de 20%, 60% e 99%;
  - a câmera acima de 1,5×, sem expor borda do palco;
  - o retorno até a rota apagada.
- Movimento reduzido: as três etapas ficam legíveis em lista.
- Palco de cerca de 2880 px no desktop e 2701 px no celular; sem overflow e sem erros de console.

Correções feitas durante a verificação:
- A rota pulava de vazia para completa, sem desenhar o caminho. Causa: com pathLength, o valor CSS de `stroke-dashoffset` ganhava “px” e o GSAP não interpolava. A rota agora é animada pelos atributos SVG.
- O subtítulo da cena aparecia sobre a foto clara antes da sombra; agora entra junto com o título.
- Achado de teste: a foto da cena carrega sob demanda, e o ScrollTrigger, ao recalcular, devolve a página à posição anterior a um salto programado. O teste repete a rolagem enquanto espera. Para quem rola continuamente, o efeito não foi observado nas capturas.

Visual:
- `docs/preview/vanguard/route-desktop.mp4` e `route-mobile.mp4`.
- A aproximação máxima de 1,9× sobre uma imagem de 1440 px deixa a textura um pouco suave; uma fotografia de resolução maior melhoraria a cena.
- Aprovação estética pendente.
- Cenas 4 e 5 ainda não foram implementadas.
