# Modelos de nicho de alto ticket: diagnóstico e plano (10/11/2026)

## Pedido

O usuário quer ter no portfólio, antes de novos superimersivos, vários modelos de projetos de nichos de alto ticket. Segundo ele, os modelos atuais estão ruins e repetitivos.

Referência enviada: gravação de tela de evopixel.com.br. É uma faixa lateral com a página inteira de cada site em miniatura e um botão “Visitar site”. Os nichos vistos foram advocacia (vários), contabilidade, odontologia, psicologia, agro, revenda de carros e um projeto amazônico. Cada site tem foto forte do profissional, promessa direta e chamada clara. Os sites são convencionais, sem experiência imersiva.

## Diagnóstico (fatos verificados)

- **Os 17 modelos de `/modelos/[slug]` usam um único template**, com as mesmas 8 seções na mesma ordem:
  1. hero com pessoa à mesa;
  2. princípios;
  3. 3 serviços;
  4. foto com texto;
  5. 3 passos;
  6. “Conheça os caminhos possíveis”;
  7. “Uma dúvida importante”;
  8. “Uma presença assim”.

  Mudam só o texto e uma entre 6 paletas (`navy`, `olive`, `sand`, `wine`, `coast`, `electric`). Isso foi conferido em capturas de página inteira lado a lado (patrimônio, odontologia, contabilidade, hotelaria).
- **Todos parecem protótipo**:
  - aviso “MODELO AUTORAL · MARCA FICTÍCIA” no topo;
  - FAQ “Este é o site de uma empresa real? Não.”;
  - textos com ressalvas (“conceitual”, “estudo”, “proposta”).

  O site de cliente da referência não tem nada disso.
- **Na homepage, o catálogo fica fechado** atrás de “Outros universos. Encontre o seu. +”.

## Decisões do usuário

1. **Misto.**
   - Aura, Orla e Vanguard seguem como superimersivos de destaque.
   - Os demais viram **sites de entrega**, com cara de cliente real, cada um com estrutura, tipografia e composição próprias.
2. **Nichos:** saúde e estética, jurídico, patrimônio e casa, consumo premium.
3. **Os 17 atuais:**
   - Os de alto ticket que vendem para clientes de Gabriel serão reconstruídos.
   - Os demais saem da galeria, sem apagar código sem pedido.
4. **Galeria em faixa de páginas**, como na referência: miniatura da página inteira, rolagem própria e “Visitar site”, visível sem abrir nada.

## Seleção proposta

| Grupo | Modelo | Situação |
| --- | --- | --- |
| Saúde e estética | Harmonização (Aura) | Superimersivo, mantido |
| | Odontologia estética e implantes | Refazer (`odontologia`) |
| | Dermatologia | Refazer (`dermatologia`) |
| | Cirurgia plástica | Novo |
| | Oftalmologia, cirurgia refrativa | Novo |
| | Transplante capilar | Novo |
| Jurídico | Família e sucessões | Refazer (`patrimonio`) |
| | Direito do agro | Refazer (`agro`) |
| | Empresarial e tributário | Novo |
| | Previdenciário | Novo |
| Patrimônio e casa | Imóveis de alto padrão (Orla) | Superimersivo, mantido |
| | Arquitetura (Vanguard) | Superimersivo, em construção |
| | Interiores e planejados | Refazer (`interiores`) |
| | Energia solar | Refazer (`energia`) |
| Consumo premium | Seminovos premium | Novo |
| | Joalheria | Novo |
| | Eventos e casamentos | Novo |
| | Hotel boutique | Refazer (`hotelaria`) |
| | Gastronomia autoral | Refazer (`gastronomia`) |

**Saem da galeria** por não serem alto ticket para o cliente de Gabriel ou por terem venda B2B longa: logística, cibersegurança, educação executiva, consultoria, contabilidade, seguros e medicina particular.
- Psicologia continua só como o destaque “Entre” da homepage.
- O usuário pode reverter qualquer item.

## Como evitar a repetição

Em vez de um template com 6 paletas, cada modelo combina um **arquétipo de estrutura**, uma **tipografia** e uma **direção de foto**. Dois modelos vizinhos na galeria nunca compartilham arquétipo.

| Arquétipo | Estrutura | Nichos candidatos |
| --- | --- | --- |
| Autoridade | Retrato grande do profissional dividindo o hero, faixa de áreas, “quem cuida”, etapas, chamadas repetidas com textos diferentes | Jurídico, cirurgia plástica |
| Procedimento | Hero com promessa e procedimento em destaque, abas por procedimento, “como é o dia”, recuperação, dúvidas reais do paciente | Odontologia, oftalmologia, capilar, dermatologia |
| Vitrine | Foto de produto em tela cheia, galeria lateral de itens, ficha de detalhes, agendar visita | Seminovos, joalheria, hotel |
| Editorial | Tipografia de revista, ensaio fotográfico, colunas e legendas | Interiores, gastronomia, eventos |
| Calculadora honesta | Formulário que monta um pedido de estudo, sem prometer economia ou valores | Energia solar |

Regras de conteúdo:
- **Sem aviso de protótipo dentro do site.** A identificação fica na galeria e no rodapé pequeno: “Projeto conceitual de Gabriel Batista Digital”.
- **Nada de números, depoimentos, registros profissionais, endereços ou antes/depois inventados.** O texto é direto e vendedor, mas sem fatos falsos.
- **Botão de chamada em vários pontos**, com texto diferente em cada seção, como no vídeo da skill. Ele leva a um roteiro local da marca (padrão BrandInquiry), nunca ao WhatsApp de Gabriel como se fosse o canal da empresa. O contato com Gabriel fica na galeria.

## Imagens

- Os modelos refeitos reaproveitam `public/images/models/people/{slug}.webp` e `public/images/models/{slug}.webp`, quando servem ao novo arquétipo.
- Os novos (cirurgia plástica, oftalmologia, capilar, empresarial, previdenciário, seminovos, joalheria, eventos) precisam de fotos geradas pelo usuário. Não há gerador de imagem neste ambiente. Os prompts serão passados por modelo, na hora de construir.

## Padrão de formato: o dos sites da evopixel (decisão do usuário, 10/11/2026)

O usuário rejeitou a primeira versão da Forma, com foto em arco, tipografia grotesca arredondada e abas. Segundo ele, o arco tem “formato de imagem de IA amadora”. Ele pediu os **formatos exatos dos sites da evopixel** e avaliou que o template antigo, com foto larga no hero, estava mais próximo.

Formato conferido na gravação (site odontológico da evopixel, quadros 30 a 33 s):
1. **Hero** com foto larga ocupando a largura toda: o profissional à direita e o texto à esquerda, sobre a parte clara do ambiente.
2. **Rótulo curto** com traço, título serifado com a última linha em itálico, parágrafo curto, botão escuro mais link de texto e três itens de confiança com ícone.
3. **Faixa de 5 diferenciais** com ícone, título e frase, separados por linhas verticais.
4. **“Conheça o profissional”:** foto retangular de cantos arredondados com selo circular, título serifado com itálico, lista de verificação e link.
5. **Tratamentos** com título centralizado (“Diferentes cuidados. Um mesmo objetivo: o seu sorriso.”) e cards.

Nos sites jurídicos e de psicologia da mesma gravação, também aparecem:
- faixa escura com chamada sobre foto;
- FAQ em sanfona;
- formulário ou contato;
- rodapé.

**Regra daqui em diante:**
- Modelos de entrega seguem esse formato convencional de site de cliente: foto retangular larga ou com cantos arredondados, serifa com linha em itálico, faixas de ícones, cards e seções centralizadas.
- A diferença entre os modelos vem de cor, foto, conteúdo do nicho e ordem das seções, não de formatos experimentais.
- Arcos, recortes decorativos e composições experimentais ficam para os superimersivos.
- Os “arquétipos” da seção anterior valem só como variação de ordem e de ênfase dentro desse formato.

## Unidade 1: Forma Odontologia no padrão evopixel

**Rota:** `/modelos/odontologia`.
- Página em `app/modelos/odontologia/` (`page.tsx`, `forma.module.css`, ícones em `FormaIcon.tsx`) e conteúdo em `lib/forma.ts`.
- `rebuiltModels` em `lib/models.ts` tira o slug do template `[slug]` e de `models.spec.ts`.

**Estrutura:**
1. Hero com a foto horizontal original em tela cheia (dentista e paciente à direita, parede de pedra à esquerda, sob o texto), título “Um sorriso planejado *com calma e precisão.*”, botão, link e 3 itens de confiança.
2. Faixa de 5 diferenciais com ícones.
3. “Conheça a clínica”, com o retrato vertical gerado pelo usuário em cantos arredondados, selo vinho “A primeira consulta é uma conversa.”, lista de verificação e link.
4. “Diferentes tratamentos. Um mesmo objetivo: *o seu sorriso.*”, com 4 cards. Cada card tem ícone, resumo e “Como funciona” em `details`, que funciona sem JavaScript.
5. Faixa vinho sobre a foto da recepção, com a primeira consulta em 4 passos.
6. FAQ em sanfona.
7. Roteiro local de agendamento (BrandInquiry generalizado).
8. Rodapé.

**Tipografia e cores:**
- Lora 500 com itálico (OFL, via `next/font/google`) nos títulos e Manrope no texto.
- Porcelana #faf7f5, linho #f1e9e5, vinho #6b1d2a, vinho escuro #4c1420 e tinta #2a1a1c.
- O componente de abas `FormaTreatments` foi removido.

**Botões de chamada:** seis pontos, com textos diferentes. Todos abrem o roteiro local; nenhum leva ao WhatsApp.

**Conteúdo:** sem números, depoimentos, antes/depois, endereço, nome de dentista ou CRO inventados. Um site real precisa exibir o CRO do responsável técnico. A identificação de projeto conceitual fica só no rodapé.

**Evidência técnica:**
- `tests/e2e/forma-odontologia.spec.ts` (2 testes) cobre:
  - página fora do template e sem aviso de protótipo;
  - hero com foto de largura total;
  - 5 diferenciais e 4 cards com `details`;
  - roteiro completo até o resumo;
  - FAQ;
  - 360/390/768/1440 sem overflow;
  - axe AA;
  - sem JS, os tratamentos legíveis e abríveis.
- Os testes de BrandInquiry continuam aprovados.

**Evidência visual:** capturas de página inteira no desktop e no celular, conferidas. Aprovação estética pendente.
## Unidade 2: Almeida & Valença Advocacia (família e sucessões), 10/11/2026

**Rota:** `/modelos/patrimonio`.
- Página em `app/modelos/patrimonio/` (`page.tsx`, `almeida.module.css`) e conteúdo em `lib/almeida.ts`.
- Os ícones passaram para `components/ModelIcon.tsx`, compartilhado pelos modelos refeitos.

**Base:** o site de inventário da evopixel na gravação (quadro de 1 s). Formato seguido:
1. Hero azul-marinho com a foto do escritório em tela cheia (advogada à direita, parede escura à esquerda, sob o texto) e uma curva dourada.
2. 3 cards com as dúvidas sobre inventário.
3. Áreas de atuação em 4 cards.
4. “Quem vai cuidar do seu processo”, com foto, selo e valores com ícone.
5. Faixa marinho com o passo a passo de um inventário em 5 etapas.
6. FAQ.
7. Roteiro local “Falar com a advogada”.
8. Rodapé.

**Tipografia e cores:** Playfair Display (OFL, `next/font/google`) nos títulos. Marinho #0f1a2e, dourado #c9a35a, marfim #f8f5ef e areia #efe8dc.

**Conteúdo jurídico:**
- Tom informativo, sem promessa de resultado ou de rapidez, em linha com as regras de publicidade da advocacia. O teste verifica a ausência de “garantimos”, “100%” e “sem conflitos”.
- Fatos gerais conferidos:
  - prazo legal de abertura de dois meses;
  - multa sobre o ITCMD conforme o estado;
  - inventário em cartório quando há acordo e a lei permite.
- Não há nome de advogada, OAB, endereço nem casos. Um site real precisa exibir o nome e a inscrição na OAB.

**Foto:** a seção “Quem vai cuidar” usa a foto do escritório (mesa), porque não existe um retrato isolado da advogada. Para ficar como a referência, falta um retrato em pé da mesma advogada.

**Evidência técnica:**
- `tests/e2e/almeida-patrimonio.spec.ts` (2 testes) cobre:
  - formato;
  - textos proibidos;
  - roteiro até o resumo;
  - FAQ;
  - 4 larguras sem overflow;
  - axe AA;
  - sem JS.
- Suíte completa: 91 aprovados, 4 pulados (música) e uma falha intermitente em `aura-character.spec.ts`. É o mesmo problema de salto programado desfeito pelo recálculo do ScrollTrigger visto no Vanguard. O teste agora repete a rolagem enquanto espera e passou 4 de 4 vezes.

**Evidência visual:** capturas de página inteira no desktop e no celular, conferidas. Aprovação estética pendente.
## Ordem de trabalho

1. **Unidade representativa:** Odontologia estética e implantes, no arquétipo Procedimento. Usa imagens existentes e é o público mais próximo do de Gabriel (clínicas). Verificar desktop, celular, sem JS e acessibilidade, e então mostrar ao usuário.
2. Com a aprovação, um modelo de cada arquétipo: Família e sucessões (Autoridade), Hotel boutique (Vitrine), Interiores (Editorial) e Energia solar (Calculadora).
3. Galeria em faixa de páginas na homepage, com miniaturas geradas por captura automática de cada modelo.
4. Novos nichos, à medida que as fotos chegarem.
