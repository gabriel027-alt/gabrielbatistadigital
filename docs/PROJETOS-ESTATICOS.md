# Projetos estáticos de alto ticket (23/11/2026)

## Pedido

- O usuário quer mais projetos de nichos de alto ticket na seleção.
- Decisão dele: **sem animação ligada à rolagem**. A identidade vem da composição, da fotografia e da tipografia, e o site fica mais leve e rápido de produzir.
- Primeiro nicho: **odontologia**.

Valem as mesmas regras das outras marcas:
- `docs/DESIGN-SYSTEM.md`: kit de 8 campos, esqueleto de conversão, régua de qualidade e registro contra repetição;
- direção de fotografia com seis parâmetros, sem repetir mais de dois com outra marca;
- nada de números, depoimentos, CRO, nome do profissional, antes/depois ou promessa de resultado;
- rodapé "© 2026 <marca>. Site por Gabriel Batista Digital".

**O que muda nos estáticos:**
- O campo 7 do kit (movimento-assinatura) vira **composição-assinatura**: um recurso de layout que só essa marca tem, parado.
- São permitidos estados de foco e de passar o mouse, e uma entrada curta na chegada. Nenhuma cena acompanha a rolagem.
- Por isso não há dica de rolagem nem guia de gesto.

## 1. Cerne Implantes, odontologia de reabilitação (proposta, aguarda o usuário)

**Por que esse recorte:** a Forma já ocupa a odontologia estética (lentes, proporção do sorriso, público mais jovem).

- **Alto ticket:** implantes e prótese fixa sobre implantes (o "protocolo") são dos tratamentos mais caros da odontologia, e muito anunciados.
- **Público:** pessoas de 50 anos ou mais, que usam prótese removível ou perderam dentes. Elas decidem pela confiança e precisam de leitura fácil.
- **Diferença:** outro público, outra dor e outra imagem.

| Campo | Proposta |
| --- | --- |
| 1. Conceito | **Voltar à mesa.** O implante devolve o que a pessoa deixou de fazer: morder um pão, comer uma maçã, rir num almoço sem pensar na prótese. A marca fala de comer e conviver, não de dente. |
| 2. Marca | **Cerne**, com o "C" desenhado como um círculo com uma mordida. Em SVG, de linha cheia; a mordida é a única curva irregular. |
| 3. Paleta e material | Medida nas fotos quando chegarem (regra de 11/11/2026). Direção: miolo de pão, crosta, toalha de linho cru e um acento vivo tirado da comida, sem dourado nem azul clínico. Material: linho de mesa e farinha. |
| 4. Tipografia | Schibsted Grotesk nos títulos, firme e de jornal, e Literata no texto, uma serifa feita para a leitura longa. Corpo maior (19–20 px) para o público de 50+. Par inédito no portfólio. |
| 5. Foto | Fotografia de mesa com flash direto, como editorial de gastronomia: cor viva, sombra dura atrás, comida e mãos em primeiro plano (parâmetros abaixo). |
| 6. Elemento-assinatura | **A mordida:** um recorte em arco tirado de um canto das fotos e dos cartões, sempre no mesmo raio, como o "C" da marca. Organiza o layout, porque o texto entra no espaço que a mordida abre. |
| 7. Composição-assinatura | **O cardápio:** os tratamentos e as dúvidas aparecem como um cardápio de restaurante, com nome, descrição curta e linha pontilhada até a ação ("Entender este tratamento"). Parado, sem cena de rolagem. |
| 8. Gramática | Topo com a foto da mesa e a promessa → "Isso acontece com você?" (sinais, para a pessoa se reconhecer) → cardápio dos tratamentos → como funciona, em 4 etapas → quem atende (sem nome) → dúvidas → roteiro local → rodapé. |

**Esqueleto de conversão:**
- **Promessa no topo:** "Voltar a comer o que você gosta, com dentes fixos." É uma frase sobre o objetivo do tratamento, não sobre resultado garantido.
- **Chamada:** "Agendar uma avaliação" abre o roteiro local, sem confirmar horário.
- **Sinais:**
  - a prótese solta ou machuca;
  - você evita certos alimentos;
  - cobre a boca para sorrir;
  - falta um ou mais dentes há tempo.
- **Tratamentos:**
  - implante unitário;
  - prótese fixa sobre implantes;
  - enxerto ósseo, quando necessário;
  - troca da prótese removível por fixa.
- **Como funciona** (as etapas reais do tratamento, sem prazos):
  1. avaliação e tomografia;
  2. planejamento;
  3. cirurgia;
  4. prótese definitiva.
- **Dúvidas:**
  - Dói?
  - Tenho idade para implante?
  - Quanto tempo leva? (depende do caso, definido na avaliação)
  - Quanto custa? (depende do planejamento)
  - E se eu tiver pouco osso?
- **Roteiro local:** a situação (falta um dente / vários / uso prótese), o que mais incomoda e para quando a pessoa quer resolver.

### Parâmetros de fotografia

| Parâmetro | Cerne |
| --- | --- |
| Enredo | A volta à mesa: um almoço de domingo em família; a mordida num pão, numa maçã; a risada à mesa |
| Luz e hora | Flash direto na câmera, meio-dia de interior, sombra dura recortada atrás (nenhuma outra marca usa flash) |
| Lente e distância | 50 mm perto; macro nas mãos e na comida |
| Enquadramento | De cima da mesa (top-down) e close de mãos e boca mordendo, sem mostrar dentes como antes/depois |
| Tratamento | Cor viva e saturada de revista de gastronomia, contraste alto, sem grão |
| Lugar | Mesa de almoço de uma casa brasileira, toalha de linho cru, louça simples |

A comparação com a tabela de `NOVOS-PROJETOS-REGISTROS.md` mostra no máximo um parâmetro perto de outra marca (o Talhão também usa meio-dia, mas com sol duro ao ar livre).

### Pedidos de imagem (para o usuário gerar)

Regras: fotografia realista, sem texto, logotipo ou marca d'água, maior lado com pelo menos 2400 px, as mesmas pessoas em todas as fotos.

1. **Mesa, topo (16:9, 2880×1620):**
   - Vista de cima de uma mesa de almoço de domingo numa casa brasileira, com toalha de linho cru, pães de casca crocante, frutas, queijo e louça simples.
   - Mãos de um homem e de uma mulher de cerca de 60 anos se servindo; uma das mãos segura um pão com uma mordida.
   - Flash direto, cor viva, sombras duras e curtas. Espaço livre no terço esquerdo para o título.
2. **A mordida (4:5, 2000×2500):**
   - Close frontal, 50 mm, da metade de baixo do rosto de uma mulher de cerca de 60 anos mordendo uma maçã vermelha.
   - Só boca e queixo, lábios naturais. Os dentes aparecem de leve, sem destaque e sem parecer propaganda de clareamento.
   - Flash direto, fundo de parede clara com sombra dura.
3. **A risada (3:2, 2400×1600):**
   - O casal das fotos 1 e 2 rindo à mesa com a família, fotografado de perto, ligeiramente de cima.
   - Pratos servidos, copos, guardanapos de linho. Flash direto, cor viva, sem pose.
4. **Quem atende (4:5, 2000×2500):**
   - Dentista de cerca de 45 anos, de jaleco aberto sobre roupa escura, de frente, do peito para cima.
   - Segura um modelo de estudo de arcada com implantes de titânio. Olhar direto e sereno.
   - Fundo de papel contínuo cor de farinha, flash direto com sombra dura atrás. Sem consultório, janela, planta ou estante.
5. **Detalhe (1:1, 2000×2000):**
   - Macro de um implante de titânio e de uma coroa de cerâmica sobre um guardanapo de linho, ao lado de migalhas de pão.
   - Flash direto, cor viva.

Observação: imagens geradas tendem a mostrar dentes brancos demais e sorrisos de propaganda. Se acontecer, gerar de novo pedindo dentes naturais e boca relaxada.

## Próximos passos

1. O usuário aprova ou ajusta a proposta (nome, conceito, recorte de público).
2. Ele gera as cinco imagens e as envia.
3. A paleta é medida nas fotos; o kit entra em `lib/brand-kits.ts` e no registro contra repetição.
4. A página é montada em `/modelos/implantes`, sem cena de rolagem, e conferida no PC a 125% e no celular.
5. O topo é gravado (capa e filme) para a seleção, só depois da aprovação dele.
