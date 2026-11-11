# Design system dos projetos de marca (10/11/2026)

## Por que agora

O usuário aprovou a Forma Odontologia e depois viu a Almeida & Valença. Segundo ele, as duas ficaram “muito iguais”, com “gradientes de cores muito simples”. Ele pediu que cada design tenha autenticidade e marca própria, “extremamente personalizado, animado e imersivo, cada um com sua cara, mas no mesmo nível”. As referências citadas são godly.website (hoje redireciona para recent.design), Awwwards, Land-book e Dribbble.

**O que se repetia entre Forma e Almeida** (fato, conferido nas capturas):
- a mesma ordem de seções (hero, faixa ou cards, foto com selo, cards centralizados, faixa escura com etapas, FAQ, roteiro);
- o mesmo tratamento do hero: foto larga com degradê lateral liso;
- o mesmo rótulo com traço acima dos títulos;
- a mesma serifa com uma linha em itálico;
- o mesmo selo circular;
- a mesma faixa escura numerada.

Só mudavam a cor e o texto.

**O que as referências mostram** (consultado em 10/11/2026, recent.design/websites e Awwwards Sites of the Day): cada site tem **uma direção de arte dominante que nasce da própria marca**. Exemplos:
- o logotipo usado como máscara gigante do layout;
- um objeto central iluminado;
- fotografia de arte;
- tipografia cinética;
- ilustração própria.

A estrutura serve a essa ideia, não o contrário.

Conclusão: o design system **não** pode ser um template visual. Ele padroniza o nível (qualidade, conversão, acessibilidade, movimento) e **obriga** cada marca a ter identidade própria.

## Camada 1: fundação comum (invisível ao visitante)

Compartilhada por todas as marcas, sem determinar a aparência:

| Item | Regra |
| --- | --- |
| Grade e espaço | Grade de 12 colunas, gutter de 5 vw no desktop e 6 vw no celular. Escala de espaço 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160. |
| Escala tipográfica | Fluida com `clamp`. Corpo de 16 a 18 px, linha de 60 a 75 caracteres, contraste AA. |
| Motor de movimento | GSAP/ScrollTrigger, já instalado, em componente cliente por marca. Contrato obrigatório: movimento reduzido mostra o estado final; botão de pausa; sem JS mostra o conteúdo completo; não recalcular o ScrollTrigger a cada imagem carregada; retorno do scroll reversível. |
| Conversão | Componente BrandInquiry (roteiro local, sem envio de dados). Botões de chamada em vários pontos, com textos diferentes. |
| Ícones | `components/ModelIcon.tsx` só como apoio. Ícone nunca é o elemento de identidade. |
| Verificação | Playwright: formato, roteiro, 360/390/768/1440 sem overflow, axe AA, sem JS. Vídeo da rolagem para ida e volta, no celular e com movimento reduzido. |
| Conteúdo | Nada de números, depoimentos, registros profissionais, endereços ou antes/depois inventados. Rodapé como site de cliente: “© 2026 <marca>. Site por Gabriel Batista Digital”. Em 11/11/2026 o usuário dispensou os avisos dentro das marcas: demonstração no rodapé, legendas das ilustrações e “Nada é enviado” no roteiro (`privacyItem` opcional no BrandInquiry). A ilustração mantém o nome acessível descritivo no SVG, e o resumo do roteiro não afirma agendamento feito. |

## Camada 2: kit de marca (obrigatório e único por marca)

Cada marca preenche os 8 campos antes de qualquer código. Os campos 2 a 8 não podem repetir os de outra marca (ver registro).

1. **Conceito em uma frase:** a metáfora visual do nicho. Exemplo do Vanguard: “a rolagem é o lápis”.
2. **Marca:** símbolo ou logotipo próprio desenhado em SVG, com regra de uso. Nada de monograma em círculo genérico.
3. **Paleta:** 5 cores e um **material** (granulação, papel, pedra, metal, tecido, luz).
   - Proibido usar o degradê linear liso como único tratamento de foto ou fundo.
   - Os degradês, quando existirem, nascem do material ou da luz da foto.
4. **Tipografia:** par exclusivo, título e texto, que não se repete em outra marca. Escolha justificada pelo nicho.
5. **Direção de foto:** formato e tratamento próprios. Exemplos: recorte sobre cor, duotom, preto e branco granulado, still life em macro, tela cheia com máscara da marca.
6. **Elemento gráfico-assinatura:** forma derivada da marca que organiza o layout (máscara, linha, grade, selo, padrão).
7. **Movimento-assinatura:** interação ligada ao scroll, que só essa marca tem e que fala do serviço. Com roteiro de gatilhos, estados, retorno, celular e movimento reduzido.
8. **Gramática de seções:** ordem e composição próprias. O esqueleto de conversão da Camada 3 diz *o que* precisa existir, não *como*.

## Camada 3: esqueleto de conversão (conteúdo, não formato)

Aprendido com os sites de cliente da evopixel e com o vídeo da skill. Toda marca precisa responder, em qualquer forma visual:

- promessa clara e chamada acima da dobra;
- quem atende ou o que sustenta a confiança, sem inventar credenciais;
- serviços ou tratamentos;
- como funciona (etapas reais);
- dúvidas de quem está decidindo;
- chamadas repetidas com textos diferentes e um roteiro local.

## Régua de qualidade

O peso dos critérios segue a avaliação do Awwwards: design 40%, usabilidade 30%, criatividade 20%, conteúdo 10%.

Uma marca só é apresentada ao usuário quando:
- o hero tem uma composição que não existe em outra marca do portfólio;
- o movimento-assinatura funciona em vídeo de ida e volta, inclusive no celular;
- nenhuma seção pode ser trocada para outra marca apenas mudando cor e texto (teste da troca);
- os itens da Camada 1 passam nos testes.

**Proibições** (traços que denunciavam template nas duas marcas):
- rótulo com traço acima de todos os títulos;
- selo circular como recurso padrão;
- a mesma faixa escura numerada;
- serifa com itálico em todas as marcas;
- degradê lateral liso sobre foto;
- a mesma sequência de seções.

## Registro contra repetição

Cada nova marca precisa diferir de todas as anteriores em pelo menos 6 dos 7 campos (2 a 8). Atualizar esta tabela a cada marca.

| Marca | Tipografia | Paleta e material | Foto | Elemento-assinatura | Movimento-assinatura | Hero |
| --- | --- | --- | --- | --- | --- | --- |
| Aura (harmonização) | definida em AURA-EDITORIAL | Berinjela e lavanda, luz de pele | Retrato editorial | Recortes regionais | Câmera contínua no rosto | Rosto em tela cheia |
| Orla (imóveis) | definida em ORLA-DIRECAO | Costa | Arquitetura costeira | Galeria lateral | Trilho horizontal | Fotografia lateral |
| Vanguard (arquitetura) | Manrope | Mineral e papel | Arquitetura e maquete | Linhas medidas | A rolagem é o lápis | Folha que vira casa |
| Forma (odontologia) | Lora | Porcelana, linho, vinho; cerâmica quente sobre travertino | Consultório quente, foto larga e retrato | Grade de proporção | Grade, contornos em proporção áurea, cerâmica | Foto larga com o texto sobre a pedra |
| Almeida (sucessões) | Cormorant Garamond | Noite, nogueira, conhaque, latão, marfim; nogueira e latão | Escritório azul-noite com luminária de latão | Linha de latão com nós; lacre; cláusulas e índice | A partilha se desenha | Escritório noturno com título sublinhado em latão e lacre |

## Kits aprovados pelo usuário em 10/11/2026

### Forma Odontologia

| Campo | Proposta |
| --- | --- |
| Conceito | O sorriso é uma proporção. O planejamento digital do sorriso usa linhas de medida sobre o rosto; a marca vive dessa precisão. |
| Marca | Símbolo em linha única: o contorno de um incisivo que forma um “F”. |
| Paleta e material | Porcelana fria #f5f3ef, esmalte azul-gelo #e3ecee, grafite #1e2124, vinho #6b1d2a (só acento), prata-cerâmica #b9c2c6. Material: cerâmica translúcida, com reflexo especular suave em vez de degradê. |
| Tipografia | Archivo Expanded nos títulos (largura extra, sensação de medida clínica) e Archivo no texto. Sem serifa e sem itálico. |
| Foto | Retrato da dentista **recortado** sobre o fundo esmalte e macros em still life de cerâmica (lâminas, modelo de estudo). Sem foto larga de consultório no hero. |
| Elemento-assinatura | A grade de proporção: linhas finas horizontais e verticais, com marcas de medida, que organizam o layout e passam sobre as imagens. |
| Movimento-assinatura | **A rolagem planeja o sorriso.** A grade se desenha sobre um sorriso em close; a lâmina de cerâmica entra no lugar da medida; os tratamentos surgem como lâminas finas. Ilustrativo, sem antes/depois de paciente. |
| Gramática | Hero recortado com a grade → cena fixa de planejamento → tratamentos em lâminas verticais lado a lado → primeira consulta numa régua vertical → dúvidas em duas colunas → roteiro. |

**Imagens a gerar:**
1. A mesma dentista recortada em fundo liso azul-gelo.
2. Macro de lâminas de cerâmica sobre superfície clara.
3. Sorriso em close, frontal, sem identificação de antes ou depois.

### Almeida & Valença Advocacia

| Campo | Proposta |
| --- | --- |
| Conceito | O patrimônio passa de mãos. A sucessão é uma linha que se divide, como uma árvore de família. |
| Marca | Lacre de cera com A&V em relevo, de borda irregular, usado como assinatura no hero e no fechamento. |
| Paleta e material | Papel de algodão #f3ede2, tinta ferrogálica #2b2420, lacre #8c2f23, verde-garrafa #1f3b33, latão #a8864d. Material: papel com fibra e relevo. Sai do azul-marinho com dourado, que é o clichê jurídico. |
| Tipografia | Cormorant Garamond nos títulos (tradição dos documentos) e Source Sans 3 no texto. |
| Foto | Still life documental em duotom quente (chaves da casa, escritura, caneta-tinteiro, mãos sobre a mesa) e retrato da advogada em preto e branco granulado. |
| Elemento-assinatura | A linha de tinta com nós, como numa árvore genealógica, que liga as seções. |
| Movimento-assinatura | **A partilha se desenha.** Uma única linha de tinta parte do patrimônio e se divide em ramos até os herdeiros; casa, conta e empresa deslizam pelos ramos. Ao voltar o scroll, os ramos se recolhem. |
| Gramática | Hero composto como uma escritura (margens, cláusulas numeradas, lacre) → dúvidas como cláusulas → cena fixa da partilha → atuação em índice → advogada → dúvidas → roteiro. |

**Imagens a gerar:**
1. Still life de chaves, escritura e caneta-tinteiro.
2. Retrato da advogada em P&B.
3. Mãos de família sobre a mesa com documentos.

## Implementação da base (10/11/2026)

- `lib/brand-kits.ts`: registro dos kits (Vanguard, Forma, Almeida) com os campos da Camada 2.
- `tests/e2e/brand-kits.spec.ts`: falha se duas marcas compartilharem marca, material, foto, elemento-assinatura, movimento-assinatura, hero, tipografia de título ou paleta. A trava contra repetição passa a ser automática.
- `components/brand/useBrandMotion.ts`: contrato de movimento da Camada 1. Cuida de:
  - movimento reduzido;
  - pausa;
  - `data-brand-animated` (sem isso, o CSS mostra o estado final);
  - limpeza;
  - recálculo só depois das fontes.
- Cada marca escreve só o seu roteiro.
- `components/ModelIcon.tsx` e `components/BrandInquiry.tsx` (tema por marca) continuam compartilhados.

## Forma pelo kit: primeira validação

**Arquivos:** `app/modelos/odontologia/`
- `page.tsx`
- `forma.module.css`
- `FormaMark.tsx`: símbolo do incisivo em F;
- `SmilePlan.tsx`: ilustração vetorial;
- `FormaMotion.tsx`: roteiro de movimento.

**Hero:**
- grade de medida que se desenha ao carregar;
- título largo “O sorriso é uma proporção.”;
- retrato sobre uma régua com marcações.

**Assinatura:** cena fixa de cerca de 3,4 telas, “Antes do tratamento, o desenho”:
1. **Medir:** a grade se desenha.
2. **Desenhar:** seis contornos de dentes em proporção áurea frontal (1 : 0,618 : 0,382).
3. **Ensaiar:** a cerâmica preenche os contornos, com volume e brilho.

O retorno do scroll desfaz a sequência. Legenda visível: “Ilustração do planejamento. Não representa um paciente.” Tudo é desenho vetorial em código; nenhuma foto de paciente.

**Outras seções:**
- tratamentos em lâminas verticais lado a lado;
- primeira consulta numa régua vertical escura;
- dúvidas em duas colunas;
- roteiro local.

**Diferença da versão anterior:** a nova Forma não usa nenhum dos traços proibidos (rótulo com traço, selo, faixa numerada, serifa com itálico, degradê lateral).

**Evidência técnica:**
- `forma-odontologia.spec.ts` (3 testes): sequência de ida e volta, pausa, esqueleto de conversão, roteiro, 4 larguras, axe AA e sem JS.
- `brand-kits.spec.ts` aprovado.
- Vídeos em `docs/preview/forma/`.

**Pendências de imagem:**
- **Recorte da dentista.** Foi tentado com OpenCV GrabCut, sem modelo de segmentação no ambiente, e rejeitado: achatava o coque e deixava parte da parede. O hero usa o retrato atual até o usuário gerar a imagem recortada.
- **Ferramentas ausentes.** Não há Blender instalado neste Windows; as renderizações antigas foram feitas em outro ambiente. Também não há gerador de imagem.

**Prompts para o usuário:**
1. **Forma, retrato recortado:**
   - Mesma dentista do retrato vertical, mesmo uniforme vinho e mesmo cabelo preso, sozinha, sem paciente.
   - Fundo liso azul-gelo #e3ecee, sem cenário. Luz de estúdio suave vinda da esquerda.
   - Enquadramento 4:5 da cintura para cima, olhando levemente para a esquerda da câmera.
   - Fotografia realista, sem texto. 2000×2500 px.
2. **Forma, cerâmica em macro (opcional, para os tratamentos):**
   - Quatro lâminas finas de cerâmica dental translúcidas sobre superfície cinza-clara fosca.
   - Luz lateral rasante mostrando a translucidez da borda. Macro de estúdio, sem boca e sem pessoa, sem texto.
   - 3:2, 2400×1600 px.
3. **Almeida, still life:**
   - Sobre uma mesa de madeira escura: uma escritura antiga em papel de algodão, um molho de chaves de casa e uma caneta-tinteiro.
   - Luz de janela lateral da tarde, tons quentes, foco raso.
   - Sem texto legível, sem marcas. 3:2, 2400×1600 px.
4. **Almeida, retrato:** a mesma advogada da foto do escritório, em pé, braços relaxados, fundo de parede lisa. Preto e branco com grão de filme, 4:5, 2000×2500 px.
5. **Almeida, mãos:** mãos de duas gerações (uma mais velha, uma mais jovem) sobre documentos numa mesa, sem rostos. Luz suave, tons quentes, 3:2, 2400×1600 px.
## Regra de validação, revista em 11/11/2026

A Forma no formato evopixel, aprovada pelo usuário, **é a base validada** de estrutura e conversão. Sobre ela entra a camada de marca própria.

A primeira aplicação do kit da Forma trocou a estrutura e usou azul-gelo e grafite. O usuário avaliou que “não se harmonizou com a imagem da dra.”, que é quente: vinho, travertino e nogueira.

Regra para todos os nichos:
1. **Estrutura validada:** formato de site de cliente da evopixel (hero de foto larga, prova, serviços, profissional, etapas, dúvidas e chamadas repetidas).
2. **Paleta e material nascem das fotos da marca.** Nunca o contrário.
3. **Camada de marca própria, por marca e única:** símbolo, elemento gráfico e movimento-assinatura de nível Awwwards, integrados como cena da página.
4. **Registro contra repetição** (`brand-kits.spec.ts`): fonte de título, paleta, material, foto, elemento, movimento e hero não podem se repetir entre marcas.

**Forma harmonizada:**
- Versão aprovada restaurada: hero, faixa de 5 diferenciais, clínica com selo, cards, faixa vinho, FAQ e roteiro.
- Acréscimos:
  - o símbolo do incisivo em F (cabeçalho, selo e rodapé);
  - a cena fixa “Antes do tratamento, *o desenho.*”, com grade e linha média em vinho, contornos em vinho escuro e cerâmica quente sobre o linho.
- Evidência técnica: suíte completa com 94 aprovados e 4 pulados (música). Vídeos em `docs/preview/forma/`.
- **Aprovada pelo usuário em 11/11/2026.** É a primeira marca validada do sistema e a referência para os próximos nichos.
- O recorte da dentista deixa de ser necessário nesta direção.
## Almeida pelo sistema (11/11/2026)

O usuário escolheu manter as fotos atuais do escritório. A paleta do kit (papel, lacre, verde-garrafa) foi substituída pela das fotos, para não repetir o erro do azul-gelo da Forma.

**Cores medidas por k-means nas duas fotos:**
- parede #15181e;
- nogueira #4b3221;
- couro #946e51;
- latão #c69b71;
- luz #f3e3cd.

**Tokens:** noite #151a22, nogueira #4b3221, conhaque #8a4f2e, latão #c49a6c, latão escuro #8d6a3f, marfim #f5ecdf e suave #5c5048.

**Estrutura validada, com camada própria:**
1. Hero noturno com o título sublinhado por uma linha de latão que se desenha ao carregar, e o lacre de cera A&V (`AlmeidaSeal.tsx`).
2. As três dúvidas escritas como cláusulas (§ 1, § 2, § 3) sob fio duplo.
3. **Assinatura “A partilha, passo a passo”** (`EstateTree.tsx`, `AlmeidaMotion.tsx`), cena fixa de 3,8 telas:
   - patrimônio da família;
   - bens;
   - a linha do inventário até o nó (cartório ou judicial);
   - anel do imposto;
   - ramos até os herdeiros, com “registro em seu nome”.

   Sem frações, porque a divisão depende da lei e de cada família; a legenda diz isso. A cena substitui a faixa escura numerada.
4. Áreas de atuação como índice de documento: algarismos romanos, pontilhado e “Ler”.
5. Escritório com sombra de nogueira deslocada, sem selo circular.
6. FAQ sobre o fundo noite.
7. Roteiro local.
8. Rodapé em nogueira.

**Tipografia:** Cormorant Garamond com Source Sans 3, ambas OFL via `next/font/google`.

**Correções:**
- O tronco da árvore cruzava o rótulo “Contas e aplicações”.
- No celular, os rótulos ficavam pequenos: o texto aumenta e as notas secundárias somem, porque já estão nos passos.

**Evidência:**
- `almeida-patrimonio.spec.ts` (3 testes): sequência de ida e volta, pausa, esqueleto de conversão, textos proibidos, roteiro, 4 larguras, axe AA e sem JS.
- `brand-kits.spec.ts` aprovado.
- Vídeos em `docs/preview/almeida/`.
- Design system “Gabriel Batista Digital — Marcas” atualizado na conta do usuário.
- **Aprovada pelo usuário em 11/11/2026.** O aviso de demonstração foi trocado pelo crédito “Site por Gabriel Batista Digital”, também na Forma.

## Processo por marca

1. **Entrevista curta:** reaproveitar as respostas já dadas e perguntar só o que falta.
2. **Kit de marca:** os 8 campos, apresentados ao usuário para aprovação.
3. **Imagens:** prompts para o usuário gerar, conforme a direção de foto.
4. **Unidade representativa:** hero mais movimento-assinatura, conferido em vídeo.
5. **Página completa:** depois da aprovação da unidade.
6. **Registro:** atualizar a tabela acima e o AGENTS.md.
