# Vanguard: brief da entrevista (10/11/2026)

Entrevista de 7 perguntas feita com o usuário, uma por vez, seguindo o fluxo ensinado no vídeo do pacote Sites Incríveis e o guia `referencias/entrevista.md`. Foram lidos e seguidos os arquivos do zip; a skill não foi instalada e nenhum arquivo do pacote foi copiado ao repositório. As respostas abaixo são escolhas do usuário entre propostas. Elas substituem as decisões que eu tinha tomado sozinho em VANGUARD-DIRECAO.md, cujo código passa a ser rascunho.

## As 7 respostas

1. **Para quem:** família ou casal com terreno, que vai construir uma casa de alto padrão e procura um arquiteto. A página leva a iniciar uma conversa sobre o projeto.
2. **Vibe:** silêncio mineral. Calma, matéria, luz rasante; pouca coisa, muito espaço, cada sombra pensada. Referências fora da web: o filme *Columbus* (Kogonada) e a revista *Casa Brutus*.
3. **Caminho:**
   1. abertura, em que o traço vira casa;
   2. o pátio como centro;
   3. o percurso pela casa;
   4. outros estudos;
   5. como começa um projeto;
   6. fechamento.

   O botão de conversa aparece em vários pontos, com texto diferente em cada seção.
4. **Convicção final:** “Do meu terreno ao projeto é um caminho claro, e o primeiro passo é só uma conversa.” (começar é simples)
5. **Pico:** “Como começa um projeto”. Numa cena longa, a folha recebe o terreno, depois a primeira conversa, o estudo e por fim a casa.
6. **Movimento-assinatura:** a rolagem é o lápis. Uma única linha acompanha a página inteira:
   - desenha a casa na abertura;
   - anda pelo percurso;
   - traça terreno → estudo → casa no pico;
   - termina desenhando o contorno do botão da conversa.
7. **Materiais:**
   - Existem três fotos geradas de 1440 px, os textos do conceito e o nome em texto.
   - Não há logo nem números reais, e nada será inventado.
   - O usuário escolheu **gerar as imagens que faltam antes** de o pico ser construído (prompts abaixo).
   - **O botão da conversa é só visual:** anima e leva ao fechamento, sem roteiro de escolhas, sem envio e sem WhatsApp.

## Jornada em cenas e energia

| Cena | Função para a convicção | Energia | Rolagem |
| --- | --- | --- | --- |
| 1. O traço vira casa | Mostrar que tudo começa no desenho | Média-alta | Encurtar de 3,2 para cerca de 2 telas |
| 2. O pátio como centro | Explicar o partido com calma | Baixa | Fluxo normal + botão “Conversar sobre o seu lugar” |
| 3. O percurso | Mostrar a casa vivida, passo a passo | Média | De 4 para cerca de 3 telas (já construído como rascunho) |
| 4. Cada lugar pede uma resposta | Provar que a resposta muda com o terreno | Baixa-média | Fundo vai ao escuro do Refúgio |
| 5. **Pico: como começa um projeto** | Tornar o processo simples e visível | **Máxima** | Cerca de 5 telas: terreno → conversa (traço sobre o terreno) → estudo (maquete) → casa |
| 6. Fechamento | Resolver: o primeiro passo é uma conversa | Baixa, resolvida | A linha desenha o contorno do botão final |

**Textos dos botões (propostos):**
- abertura: “Começar pelo terreno”;
- cena 2: “Conversar sobre o seu lugar”;
- cena 4: “Qual é o seu lugar?”;
- fechamento: “Começar uma conversa”.

Todos levam ao fechamento.

A trava contra repetição foi mantida: abertura, pico, assinatura, paleta e estrutura diferem de Aura e Orla.

## Imagens a gerar (o usuário traz os arquivos)

Todas em 3:2 e na maior resolução disponível (ideal 2880×1920). Precisam ser o **mesmo lugar** da Casa Horizonte (`public/images/concepts/vanguard.webp`): oliveira à esquerda, gramíneas, espelho d'água e montanha ao fundo, no fim da tarde. Anexar a foto atual como referência ao gerar.

1. **Terreno vazio:** “Mesmo enquadramento e mesma luz de fim de tarde desta foto, mas sem a casa: terreno natural levemente inclinado, com a mesma oliveira à esquerda, gramíneas altas, chão de terra e pedra, e a montanha ao fundo. Sem construção, sem pessoas, sem texto. Fotografia de arquitetura, lente 35 mm, 3:2.”
2. **Maquete de estudo:** “Maquete branca de estudo desta mesma casa (volume em balanço sobre pátio, pilar de pedra, abertura de vidro), em papel e madeira balsa, sobre mesa de ateliê com papel manteiga e um lápis. Luz lateral suave, fundo cinza mineral, sem pessoas, sem marcas, sem texto. 3:2.”
3. **Casa Horizonte em alta resolução:** ampliar a foto atual (upscale de 2× ou mais) **sem mudar o enquadramento**, porque as linhas do desenho foram medidas sobre ela.

## Imagens recebidas e pico construído (10/11/2026)

**Imagens:**
- **Terreno** (1536×1024): estava no mesmo enquadramento da casa, com diferença de cerca de 0,5%. Foi alinhado por pontos correspondentes (ORB + afim, 306 pontos, deslocamento de 5,5 e 7,7 px) e salvo em `vanguard-terreno.webp`. As linhas medidas da casa caem sobre o terreno vazio.
- **Diferença do pedido:** o terreno gerado já tem o espelho d'água e as lajes, e a montanha do fundo não é a mesma. Fica como “terreno preparado”, sem afirmar que é o mesmo lugar fotografado.
- **Maquete** (1536×1024): salva em `vanguard-maquete.webp`.
- **Casa “ampliada”:** veio com 1525×1031, praticamente a mesma resolução da original. Não foi usada; a cena usa `vanguard.webp`.

**O pico “Como começa um projeto”** (5,2 telas de palco fixo):
1. O terreno abre a partir da linha do horizonte.
2. As linhas da casa se desenham sobre o terreno (conversa).
3. A maquete entra da esquerda (estudo).
4. A casa ocupa o quadro.

O lápis à esquerda mede o caminho com quatro marcas. Abertura e percurso foram encurtados para 2,3 e 3,3 telas.

**Correções feitas durante a verificação:**
- A camada da conversa repetia a foto do terreno sem recorte e escondia a abertura pelo horizonte. As duas camadas passaram a abrir juntas.
- Os textos andavam uma etapa atrasados. A lista de etapas usava `data-vg-stage`, o mesmo atributo do palco da abertura, então a primeira “etapa” era o palco inteiro. Foi renomeada para `data-vg-process-step`.
- Recalcular o ScrollTrigger a cada imagem carregada fazia a página voltar a uma posição antiga durante a rolagem. Como as fotos ficam em caixas de proporção fixa, o recálculo agora só acontece quando as fontes terminam de carregar.

**Verificação:**
- 6 testes aprovados em duas repetições:
  - pico em 0/20/42/66/100% e retorno;
  - rolagem pela roda do mouse sem salto para trás;
  - estático com as 4 etapas e as 4 imagens.
- Sem overflow e sem erros de console.
- Vídeos em `docs/preview/vanguard/process-desktop.mp4` e `process-mobile.mp4`.

## Próximo passo

Quando as imagens chegarem:
1. Ajustar abertura e percurso aos novos tempos.
2. Construir o pico (cena 5) como unidade representativa.
3. Verificar em vídeo, celular, movimento reduzido e sem JS antes das cenas 4 e 6.

Nada de código além do rascunho existente antes do “pode ir”.
