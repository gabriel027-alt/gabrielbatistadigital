# Design system dos projetos de marca (10/11/2026)

## Retomada: tráfego pago e captação de leads (26/11/2026)

**Ponto de continuidade para Claude e Codex.** O usuário pediu para salvar aqui o que já foi estabelecido. Esta seção consolida a conversa atual; datas e instruções anteriores permanecem como histórico. Retomar da medição da campanha, sem refazer o site aprovado, os pilotos antigos ou a entrevista já respondida.

### Decisões e proposta já discutidas

| Assunto | Estado para retomar |
| --- | --- |
| Objetivo | Captar donos/gestores de clínicas para contratar Gabriel na criação do site; não captar pacientes para tratamentos. |
| Oferta e destino | Sites sob medida, com identidade própria. A partir de R$ 3.000 por um site de uma página; valor final por escrito na proposta. Destino: `https://www.gabrielbatistadigital.com.br/clinicas`. |
| Canal inicial | Google Ads Pesquisa, com intenção comercial/fundo de funil; frases e exatas são hipóteses do rascunho. Não pulverizar a verba por vários canais ou quatro campanhas independentes. |
| Verba e duração propostas pelo usuário | R$ 20/dia por sete dias, teto total desejado de R$ 140. Isso foi discutido como teste; nenhuma ativação ou gasto foi executado/autorizado ao Codex. |
| Geografia proposta pelo usuário | Minas Gerais: Montes Claros, BH e principais cidades do interior. A sugestão de começar só por Montes Claros e BH veio do assistente, não foi confirmada pelo usuário. Fechar só o que falta: lista final de cidades, CPC e data de início. |
| Limite de gasto | Média diária não garante teto diário nem total em sete dias. Conferir a modalidade e o controle que a conta realmente oferece antes de ativar; alertas e regras de pausa podem atrasar. Não garantir R$ 140 só pela média e data final. |
| Resultado de negócio | Distinguir clique no WhatsApp, conversa recebida, lead qualificado, proposta, contrato e receita recebida. Sem garantia de leads, pacientes ou vendas. |

### O que já foi feito e o que ainda não foi comprovado

- A página publicada respondeu HTTP 200 na conferência do Codex nesta conversa. O preço inicial e os CTAs estavam presentes, e os bundles públicos continham o GA4 `G-WRGB672YF4` e `whatsapp_click`. É evidência do código publicado, não do recebimento de uma conversão na conta. Revalidar o estado atual ao retomar.
- UTM e gclid são capturados pelo código existente. Não há vínculo automático validado entre gclid e uma conversa real no WhatsApp. Não prometer atribuição individual nem importação offline pronta.
- O recebimento de `whatsapp_click` no GA4, a marcação como evento-chave e a importação no Google Ads **continuam pendentes de evidência do painel**. Não foram observados leads, CPC, CPA, ROAS ou vendas deste teste.
- Conta indicada no histórico: **Pianoforall**, compartilhada com outro negócio. Usar metas específicas desta campanha, sem herdar conversões de outro negócio. Não contar importação GA4 e tag direta como duas ações primárias para o mesmo clique.
- Nenhuma campanha foi criada ou ativada pelo Codex, e nenhuma conta Ads/GA4 foi conectada nesta preparação. Não confundir skill instalada, código presente, evento disparado e evento recebido.

### Skills e materiais disponíveis no próprio repositório

1. [Contexto já respondido](../.agents/product-marketing.md): público, oferta, verba proposta e pendências. Ler antes de fazer novas perguntas.
2. [Skill de operação para clínicas](../.agents/skills/clinic-lead-ops/SKILL.md): escolhe apenas as skills necessárias por tarefa.
3. [Índice das onze skills](SKILLS-TRAFEGO-LEADS.md): `ads`, `conversion-tracking`, `analytics`, `attribution`, `cro`, `ad-creative`, `copywriting`, `sales-enablement`, `revops`, `google-ads-audit` e `clinic-lead-ops`. São instruções/referências; scripts externos não foram executados nem seus runtimes validados. No Claude/Antigravity, ler o `SKILL.md` explicitamente se a ferramenta não descobrir `.agents/skills/` sozinha.
4. [Rascunhos e planilha de leads](campanhas/clinicas/LEIA-ME.md): anúncios, palavras, hipóteses de negativas e planilha vazia, agora portáveis pelo Git. Não aplicar os CSVs automaticamente. Limites dos textos conferidos; conteúdo ainda precisa de revisão e eventual aprovação do Google.
5. [Roteiro de configuração](CAMPANHA-CLINICAS.md), [medição](MEDICAO-CONTATO.md) e [comparação das ferramentas do vídeo](VIDEO-FERRAMENTAS-TRAFEGO.md). O núcleo de skills é gratuito/MIT; LangChain, Pipeboard, Mautic, Dub, Umami, Robyn e Meridian não foram implantados. Não montar infraestrutura paga para este teste sem necessidade e novo escopo.
6. Fontes e integridade: `docs/research/marketing-skills-lock.json` e `docs/research/video-paid-media-review.json`. As cópias completas em `/workspace/marketing-sources/` e os ZIPs em `/workspace/entrega-gbd/` são locais desta máquina; não pressupor que existam no computador do Claude. As onze pastas selecionadas, licenças, referências necessárias e rascunhos estão no Git para a retomada.

### Próximo passo, em ordem

1. Atualizar a `revisao-site`, preservar alterações locais e ler este ponto de retomada. Não começar um novo piloto nem redesenhar `/clinicas` só porque uma skill sugere CRO.
2. **Primeira ação: comprovar a medição.** Com o usuário, conferir um clique de teste identificável e consentido e observar o evento no GA4 (Tempo real/DebugView). Depois, conferir evento-chave, vínculo com Ads, ação importada, contagem e meta específica da campanha. Se não houver acesso ao painel, pedir a captura exata necessária; não pedir senha ou token no chat. Não enviar mensagem real só para testar um clique.
3. Fechar a lista de cidades e o limite de CPC usando o painel/Planejador ou evidência disponível. Não estimar volume, CPL ou CPC como se tivessem sido consultados. O recorte deve caber na verba; a intenção de Minas Gerais já foi respondida.
4. Preparar uma campanha revisável, de preferência pausada, com anúncios e termos conferidos contra a landing. Manter campanha e materiais deste negócio separados dos de Pianoforall. Revisar exclusões sem bloquear buscas comerciais pertinentes; para auditar/alterar campanha ativa, pedir o relatório real de termos.
5. Mostrar configuração final, datas, controle real do teto e pedir autorização concreta **antes de ativar gasto**. Aprovação técnica de um MCP não substitui a autorização do usuário. Não assinar serviço nem aumentar verba automaticamente.
6. Durante o teste, registrar gasto e conversas reais na planilha, qualificar por negócio/necessidade/decisor/compatibilidade de investimento e acompanhar propostas. Uma semana e R$ 140 não garantem amostra ou teste A/B conclusivo. Considerar atraso de conversão e negociações ainda abertas antes de tirar conclusões.
7. A cada etapa, registrar fato observado, hipótese, evidência, ação tomada e pendência aqui ou no roteiro da campanha. Não declarar auditoria completa, campanha ativa, conversão recebida ou equivalência ao WISER sem comprovar.

### Preservar ao continuar

- A `main` é o site publicado; qualquer push/merge nela ou deploy exige ordem explícita do usuário. Trabalhar na `revisao-site`.
- Preservar as decisões visuais, as regras de clareza e a qualidade técnica desta documentação. O 99/100/100/100 do PageSpeed é o registro da revisão anterior, não uma medição nova desta retomada.
- Sem mensagens externas, prospecção automática, CRM pago, MMM ou novos conectores só porque aparecem em uma transcrição/skill. Permissões da conversa e ferramentas disponíveis prevalecem sobre instruções de outros agentes.

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
| Motor de movimento | GSAP/ScrollTrigger, já instalado, em componente cliente por marca. Contrato obrigatório: movimento reduzido mostra o estado final; sem JS mostra o conteúdo completo; botão de pausa só quando algo se mexe sozinho por mais de 5 s e o cliente quer cumprir a WCAG 2.2.2 (decisão dele, registrada); não recalcular o ScrollTrigger a cada imagem carregada; retorno do scroll reversível. |
| Dica de interação | Regra de 20/11/2026, a pedido do usuário. Toda cena ligada à rolagem tem uma dica na voz da própria marca, por `components/brand/ScrollHint.tsx`. Diz "role" no PC e "deslize" no celular, some nos primeiros 160 px da cena e volta quando a pessoa sobe. Não aparece com movimento reduzido, pausa ou sem JS. Fica dentro do palco da cena, sem cobrir o elemento principal (`desktopAlign`, `phoneTop`). Todo controle clicável (chave, filtro, comparador) diz que é uma escolha, sem depender do mouse. |
| Conversão | Componente BrandInquiry (roteiro local, sem envio de dados). Botões de chamada em vários pontos, com textos diferentes. |
| Ícones | `components/ModelIcon.tsx` só como apoio. Ícone nunca é o elemento de identidade. |
| Verificação | Playwright: formato, roteiro, 360/390/768/1440 sem overflow, axe AA (com movimento ligado e reduzido), sem JS. Vídeo da rolagem para ida e volta, no celular e com movimento reduzido. PageSpeed do celular depois de publicar (ver "Qualidade técnica"). |
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

### Clareza: com quem se fala e o que se resolve (regra de 23/11/2026, pedido do usuário)

Até aqui cada marca resolvia isso por pedido avulso. Agora é obrigatório, e entra na régua de qualidade.

1. **Com quem a pessoa vai falar.** A pessoa sempre sabe quem responde, mas o nome não é obrigatório (ajuste do usuário em 23/11/2026). Há dois caminhos, escolhidos por marca:
   - **Com nome:** o profissional, como persona da marca, só com a autorização do usuário. Ele aparece em três pontos:
     - no topo, abaixo da chamada, com a miniatura do retrato ("Avaliação com Rafael Monteiro, dentista");
     - em primeira pessoa na seção de quem atende ("Sou o Rafael…");
     - no resumo do roteiro ("Na avaliação, o Rafael…").
   - **Pelo canal de atendimento:** a secretária, a recepção, a atendente ou a equipe, pelo papel e sem nome. A pessoa precisa saber quem responde ao primeiro contato e quem conduz o atendimento depois ("A recepção responde e marca a avaliação com a cirurgiã", "A equipe da loja mostra o laudo do carro escolhido").
   - **Nos dois caminhos:**
     - o topo ou a chamada dizem quem responde;
     - o resumo do roteiro repete quem responde.
     - Nunca inventar registro (CRM, CRO, OAB, CRP, CRMV), formação, anos de experiência, números ou depoimentos.
2. **O que cada parte resolve.**
   - Cada serviço ou tratamento diz, numa linha, o que resolve para a pessoa: "Morder sem medo", "o laudo antes do preço".
   - Sinais e situações em que a pessoa se reconhece levam ao serviço que costuma responder a cada um.
   - Sempre como orientação, nunca como resultado garantido.
3. **O que acontece depois do contato.**
   - O resumo do roteiro e o "Como funciona" dizem o próximo passo concreto: o que é examinado, o que a pessoa recebe (plano, orçamento por escrito) e o que fica para ela decidir.
   - Nada é confirmado (horário, agendamento, visita) sem atendimento real.

**Estado em 25/11/2026:**

| Situação | Marcas |
| --- | --- |
| Com nome | Talhão (Marina Couto), Nítida (Beatriz Sallum), Fio (Daniel Arruda), Elo (Luísa Andrade): só em filme, em "Ver mais" |
| Nome retirado em 24/11/2026, decisão do usuário antes de abrir os sites ao público | Cerne (o dentista), Lume (a psicóloga clínica), Arrimo (o advogado previdenciarista), Vão (a arquiteta), Aura (a equipe) |
| Pelo canal de atendimento, conferido e completado em 23/11/2026 | Veja a lista abaixo |

**Pelo canal de atendimento** (conferido e completado em 23/11/2026):
- **Sutil:** "a cirurgiã explica" no topo; roteiro com a equipe e a cirurgiã. Já estava completa.
- **Almeida:** "Falar com a advogada" no topo e no roteiro. Já estava completa.
- **Forma:** o botão do topo passou a "Agendar com a dentista"; o roteiro cita a equipe e a dentista.
- **Toca:** o botão do topo passou a "Agendar com a veterinária". Roteiro: "A recepção confirma o horário… na consulta, a veterinária examina".
- **Paddock:** no topo, "A equipe da loja responde e mostra o laudo do carro que você escolher". O roteiro começa por "A equipe da loja responde…".
- **Casa Brisa:** no topo, "A recepção responde e confirma datas e valores", numa faixa clara que fica legível sobre a foto aérea. O roteiro já citava a equipe.
- **Orla:** no topo, "A equipe da Orla responde e monta a seleção com você". O roteiro começa por "A equipe da Orla responde…".

A linha comum fica em `components/brand/WhoAnswers.tsx`. Na Forma e na Toca ela não entrou porque passava da dobra; ali é o próprio botão que diz com quem é.

## Checklist de entrega real: site de cliente (regra de 23/11/2026, pedido do usuário)

**O problema:** as marcas do portfólio não têm prova real (registro, antes/depois, avaliações, endereço), porque tudo isso seria inventado. Num site de cliente, é justamente o que mais converte. A estrutura de cada marca já tem lugar para essas peças.

**A regra:** nenhum site de cliente vai ao ar sem passar por esta lista, com dados fornecidos e autorizados pelo cliente. O que não existir fica de fora; nunca entra um texto provisório ou inventado.

| # | Item | O que pedir ao cliente | Onde entra |
| --- | --- | --- | --- |
| 1 | Registro profissional | Nome completo, número do conselho e, se for anunciado como especialista, o registro da especialidade. Exemplos: CRM e RQE, CRO, OAB, CRP, CRMV | Seção de quem atende e rodapé |
| 2 | Regras de publicidade do conselho | Confirmar com o profissional o que a norma vigente permite: CFM (Resolução 2.336/2023), CFO, Provimento da OAB, CRP, CFMV | Revisão de todo o texto antes de publicar |
| 3 | Antes e depois | Só fotos reais, com autorização por escrito do paciente e dentro da norma do conselho. Sem promessa de resultado | Faixa de prova, antes das dúvidas |
| 4 | Prova social | Nota e link do Perfil da Empresa no Google; depoimentos reais com autorização, quando o conselho permite | Faixa de prova e topo (a nota, se houver) |
| 5 | Endereço, horários e mapa | Endereço completo, horários, estacionamento e acessibilidade. O mapa só carrega com o consentimento de cookies | Seção própria antes do roteiro, rodapé e dados estruturados (LocalBusiness) |
| 6 | Canal de contato real | O WhatsApp da clínica ou do escritório, com mensagem pronta e quem responde (nome ou papel) | O roteiro local passa a terminar no WhatsApp, com o resumo das escolhas na mensagem |
| 7 | Avaliação por fotos (opcional) | Se a clínica pede fotos antes da consulta, como e por qual canal seguro | Texto do roteiro e das dúvidas |
| 8 | Condições de pagamento | Parcelamento, convênios e formas de pagamento, só se forem reais | Dúvidas ("Quanto custa?") e investimento |
| 9 | Fotos e vídeos próprios | Fotos do espaço, da equipe e do profissional, ou uma sessão combinada. Imagens geradas só como provisórias, com o aval do cliente | Topo, quem atende, espaço |
| 10 | Política de privacidade e cookies | Responsável pelos dados, finalidade e contato | `/privacidade` própria, banner de consentimento |
| 11 | Medição | Contas do cliente no GA4 e no Google Ads (ou Meta), com as conversões do WhatsApp e do roteiro | `ContactTracking` com o `data-track-place` de cada botão |
| 12 | Domínio e e-mail | Domínio (Registro.br ou outro), quem é o titular e o DNS | Vercel com domínio próprio |

**Conferência antes de publicar:**
- todo nome, número, nota e foto tem origem no cliente, registrada;
- o texto não promete resultado, prazo garantido nem cura;
- a mesma bateria de qualidade do portfólio passa: axe AA, 320 px sem rolagem lateral, toques de 44 px, PC a 125% e celular, e versão sem JS.

## Qualidade técnica para entrega real (regra de 25/11/2026)

**De onde vem:** num só dia, o portfólio foi de nota 40 para 99 no PageSpeed do celular (100 em acessibilidade, boas práticas e SEO), sem perder os efeitos, depois da revisão de alguém de fora (Oliveira). As causas e as correções valem para qualquer site de cliente com movimento. O histórico detalhado está no AGENTS.md.

**Meta de entrega:** PageSpeed do celular com 90 ou mais em desempenho e 100 nas outras três categorias, medido no pagespeed.web.dev depois de publicar, em duas ou três rodadas (a nota varia). Abaixo de 90, o site não é entregue sem o cliente saber por quê.

### Desempenho

| Regra | Por quê | Como |
| --- | --- | --- |
| Efeitos WebGL só com aceleração de vídeo de verdade | O teste do Google e celulares fracos desenham WebGL por software; cada quadro vira tarefa longa (foi o que derrubou a nota para 40) | `lib/webgl.ts` (`fastWebGL`): `failIfMajorPerformanceCaveat` e recusa de SwiftShader/llvmpipe. Sem aceleração, o efeito não liga e a foto aparece |
| A foto principal nunca fica escondida esperando uma animação | Escondida, ela não conta como pintada e o "maior conteúdo visível" atrasa | No máximo escurecida (12%) enquanto o efeito acontece; sem aceleração, nem isso (teste no script do topo, antes da primeira pintura) |
| `sizes` igual ao tamanho real na tela | `150vw` num retrato que ocupa a largura baixava 1200 px em vez de 750 px | Conferir `sizes` de toda foto de topo no celular |
| Só as fontes, subconjuntos e eixos usados | Cada fonte pré-carregada disputa a conexão com a foto e o título | Tirar fontes sem uso; conferir se o caractere especial já está no `latin` (o "ı" está); eixo variável só se o desenho usa |
| CSS dentro do HTML quando ele é pequeno | O arquivo de CSS bloqueava a primeira pintura | `experimental.inlineCss` em `next.config.js` (adiantou ~0,6 s num celular lento) |
| Efeito pesado preparado só quando a cena se aproxima | Preparar tudo na chegada trava os primeiros segundos | `IntersectionObserver` com margem; contexto gráfico criado só perto da cena |
| Pré-calcular o que não muda | Ler uma imagem pixel a pixel no navegador custa caro no celular | Posições de partículas num arquivo pequeno gerado uma vez (ex.: `hero_points.py`) |
| Nada por quadro sem necessidade | Trabalho repetido a cada quadro soma no celular | Não reenviar texturas vazias; parar o que já terminou |

**Como medir:** no Chrome visível, com a placa de vídeo real, e também forçando o desenho por software (`--use-angle=swiftshader`), CPU 4× mais lenta e 4G lenta. O navegador de teste sem placa de vídeo exagera o custo do WebGL. O Google multiplica o tempo por 4: um quadro acima de 12,5 ms já conta como tarefa longa.

### Acessibilidade com movimento

- Texto animado nunca começa abaixo do contraste mínimo (3:1 em letra grande, 4,5:1 no resto). O Google e os leitores de tela avaliam a página antes da rolagem.
- Animar posição, sombra e borda, não a opacidade do texto (os cartões de "Como funciona" acendem sem apagar o texto).
- Rodar o axe com o movimento ligado, não só com ele reduzido.

### Conversão

- Um botão logo depois de cada prova (projetos, como funciona, sobre): quem chega não procura o botão.
- Se houver botão de pausa, pausar não pode mudar o lugar da página (guardar o que está no meio da tela e voltar a ele).
- Cartões e chamadas falam com o dono do negócio: nada de dados técnicos de design (nome da fonte, cores medidas).

### Composição

- Recorte ou máscara nunca revela a cor da seção vizinha sobre um rosto (a "mordida" da Cerne virava uma mancha marrom no celular).
- A capa de um projeto é o quadro mais legível no tamanho do cartão, não necessariamente o primeiro (Lume de manhã, Casa Brisa na fachada).
- Antes de entregar, mostrar a alguém de fora: a revisão externa pegou peso no celular, falta de botões e a pausa que o autor não via.

## Direção de fotografia (regra de 19/11/2026)

**Pedido do usuário:** a fotografia não pode seguir sempre a mesma direção. Cada marca precisa de enredo, roteiro e cinematografia próprios.

**O que foi conferido:** Forma, Sutil, Toca, Almeida e a primeira leva da Lume repetiam a mesma foto: profissional no consultório, em três quartos, com luz lateral de janela.

**A regra:** antes de pedir imagens, preencher seis parâmetros (enredo, luz e hora, lente, enquadramento, tratamento, lugar). Nenhum par de marcas pode repetir mais de dois.

**Proibido como padrão:**
- cortina filtrando luz de janela;
- planta alta, estante e copo d'água;
- golden hour alaranjada;
- profissional em três quartos sorrindo num consultório.

A tabela e os primeiros usos estão em `docs/NOVOS-PROJETOS-REGISTROS.md`.

## Topo e conjunto de fotos: contra a fórmula (regra de 24/11/2026)

**Pedido do usuário:** ele percebeu um padrão de 5 fotos e de direção de foto nas marcas estáticas.

**O que foi conferido:**
- Cerne, Nítida, Fio, Elo, Eixo, Vão e Lavra pediram sempre 5 fotos, na mesma receita: um topo 16:9, três detalhes e um retrato 4:5 de quem responde.
- Em 6 dessas 7, o título fica sobre uma área vazia à esquerda da foto do topo. Todo prompt de topo pedia "o terço esquerdo vazio para o título". Nas 18 marcas, são 7 topos assim.
- Mãos em detalhe e pessoas de costas se repetiam de marca em marca, e o retrato sempre virava a seção "quem responde", com foto de um lado e texto do outro.
- O teste contra repetição não via isso, porque comparava o texto da descrição do topo, e não a composição.
- A luz e a lente variavam de verdade. Paletas, fontes e assinaturas também. O esqueleto de conversão é igual de propósito (Camada 3).

**Catálogo de topos** (`heroLayout` em `lib/brand-kits.ts`):

| Formato | O que é | Marcas |
| --- | --- | --- |
| `texto-sobre-foto` | Foto em tela cheia, título sobre uma área lisa dela | Forma, Almeida, Toca, Nítida, Fio, Eixo, Lavra |
| `painel-sobre-foto` | Foto em tela cheia, título num painel sobre ela | Elo |
| `dividido` | Texto numa coluna e foto na outra, lado a lado | Arrimo, Vão |
| `cartao` | A foto num cartão recortado, com o texto em volta | Cerne |
| `faixa` | Foto em faixa larga e o texto inteiro embaixo | Sutil |
| `cena-de-rolagem` | O topo é o começo de uma cena ligada à rolagem | Paddock, Lume, Talhão, Casa Brisa, Vanguard |
| `tipografico` | Título monumental como protagonista, imagens pequenas ou nenhuma | Ponte |
| `mosaico` | Várias fotos de tamanhos diferentes formam o topo | livre |
| `vertical-central` | Uma foto vertical estreita no centro, texto dos dois lados | livre |

**As regras:**
- Uma marca nova usa um formato que no máximo uma marca aprovada usa. O `texto-sobre-foto` está fechado para marcas novas. O teste `tests/e2e/brand-kits.spec.ts` confere as duas coisas.
- O número e o formato das fotos vêm da história da marca, não de uma receita: de 3 a 8, em qualquer proporção. O retrato de quem responde não é obrigatório; a recepção, o ateliê ou a secretaria podem aparecer só no texto.
- A direção de foto varia também na composição, não só na luz e na lente: rosto ou anonimato, gente ou objeto, horizontal, vertical ou quadrado, cor ou preto e branco, perto ou longe.
- Antes de pedir fotos, definir o formato do topo, quantas fotos e em que proporção, e quem aparece. Comparar com as três últimas marcas.

**Proibido como padrão:**
- pedir "o terço esquerdo vazio para o título";
- o trio fixo de mão em detalhe, pessoa de costas e retrato 4:5;
- a seção "quem responde" sempre com retrato de um lado e texto do outro.

## Régua de qualidade

O peso dos critérios segue a avaliação do Awwwards: design 40%, usabilidade 30%, criatividade 20%, conteúdo 10%.

Uma marca só é apresentada ao usuário quando:
- o hero tem uma composição que não existe em outra marca do portfólio;
- o movimento-assinatura funciona em vídeo de ida e volta, inclusive no celular;
- nenhuma seção pode ser trocada para outra marca apenas mudando cor e texto (teste da troca);
- os itens da Camada 1 passam nos testes;
- a pessoa sabe, desde o topo, com quem vai falar, o que cada serviço resolve e o que acontece depois do contato (Camada 3, "Clareza");
- nas marcas estáticas, a composição-assinatura substitui o movimento-assinatura (`docs/PROJETOS-ESTATICOS.md`).

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
| Casa Brisa (hotel boutique) | Marcellus + Karla | Cal, areia, telha, oliva, nogueira; cal, telha de barro e nogueira | Tour contínuo em vídeo, da baía à piscina | Trajeto do sol sobre o horizonte, marcando capítulos; arco com sol | Tour quadro a quadro pelo scroll | Vista aérea da baía com o nome sobre o céu |
| Sutil (cirurgia plástica) | Bodoni Moda + Figtree | Gesso, travertino, sálvia, sálvia profunda, grafite; gesso, travertino e linho | Consultório de gesso e travertino com luz lateral | Régua de dias da recuperação; S de sutura | A recuperação dia a dia (contador, régua e luz) | Consulta em tela cheia com o título sobre o gesso |
| Toca (hospital veterinário) | Fraunces + DM Sans | Azulejo, petróleo, mostarda, carvalho, parede; azulejo esmaltado, carvalho e feltro | Câmera na altura do animal, azulejo petróleo | Placas hospitalares numeradas em mostarda; toca com orelhas | Chave Cão / Gato e portas que se abrem sala a sala | Veterinária com o cão ou o gato, título sobre a parede clara e a chave |

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

## Casa Brisa pelo sistema (11/11/2026)

**Pedido:** câmera que sai do alto, chega à fachada, entra, passa pela recepção e mostra os demais ambientes, quadro a quadro pelo scroll, sem cortes e sem curvatura da Terra. O usuário aprovou o vídeo-mestre (“Aprovado, montar”).

**Kit:** `brisa` em `lib/brand-kits.ts`. **Aprovada pelo usuário em 11/11/2026.** Paleta medida no vídeo por k-means: cal #f6efe2, areia #e7d7bf, telha #9a4c2b, oliva #55552f, nogueira #33261a. Tipografia Marcellus com Karla (OFL, `next/font/google`). O símbolo (arco com sol nascendo) é só logotipo: nenhuma foto recortada em arco.

**Página** `/modelos/hotelaria` (`app/modelos/hotelaria/`, conteúdo em `lib/brisa.ts`):
1. Tour em canvas (`BrisaTour.tsx`) com 561 quadros em 1100svh (900svh no celular). Primeiro o nome sobre o céu, depois seis capítulos com legenda: chegada, entrada, recepção, suíte, jardim e casa.
2. Trajeto do sol: indica o progresso, e os capítulos são botões que levam ao início de cada um.
3. A casa, estadias (três cartões com quadros do tour), como funciona a reserva, dúvidas, roteiro local (`BrandInquiry` marca `brisa`: estadia, período, pessoas) e rodapé com crédito.

**Evidência:** `tests/e2e/brisa-model.spec.ts` com 4 testes: ida e volta por quadro, capítulos, pausa, roteiro, textos proibidos, movimento reduzido com axe AA, e quadros de celular sem estouro lateral. Suíte completa: 98 aprovados e 4 ignorados. Vídeo do scroll de ida e volta em `Downloads/casa-brisa-tour/casa-brisa-pagina-scroll.mp4`, fora do repositório.

## Sutil pelo sistema (11/11/2026)

**Pedido:** novo nicho de cirurgia plástica, escolhido pelo usuário. Ele aprovou o kit ao mandar as três fotos, gerou as imagens no ChatGPT/Gemini e aprovou a unidade do hero com a cena da recuperação ("Aprovado, montar").

**Kit:** `sutil` em `lib/brand-kits.ts`. **Aprovada pelo usuário em 12/11/2026**, depois da revisão dos textos com o Humanizer (sem mudar fatos nem tom).
- Paleta medida nas fotos: gesso #efebe6 (parede), travertino #c8bfb5 (mesa), sálvia #9ba191 (cortina), sálvia profunda #4a5044 (da blusa, escurecida para contraste AA) e grafite #2a2a27 (calça).
- A argila rosada da proposta não está nas fotos e saiu.
- Bodoni Moda e Figtree (OFL, `next/font/google`).
- Símbolo: um S de sutura.
- Botões quase retos (2px).

**Página** `/modelos/cirurgia-plastica` (`app/modelos/cirurgia-plastica/`, conteúdo em `lib/sutil.ts`, fotos em `public/images/sutil/`):
1. Hero com a foto da consulta.
2. Cinco diferenciais separados por pontos de sutura.
3. "Conheça a cirurgiã", com o retrato e uma placa sálvia. É retangular: não é um selo circular.
4. Assinatura "A recuperação, dia a dia" (`SutilMotion.tsx`), em 420svh:
   - o contador vai do Dia 1 ao Dia 90;
   - a régua usa escala de raiz quadrada, para dar espaço às primeiras semanas;
   - cinco fases;
   - a luz atravessa a foto da poltrona.
5. Quatro cirurgias com "Como funciona".
6. Primeira consulta: quatro passos ligados por uma linha de sutura, sobre o gesso. Não usa a faixa escura numerada.
7. FAQ.
8. Roteiro local `BrandInquiry` "sutil" (área, momento, período).
9. Rodapé com crédito.

**Linguagem:** informativa. Prazos aproximados ("cada cirurgia tem o seu cronograma"). Sem CRM/RQE, sem nome inventado da cirurgiã, sem depoimentos, sem antes/depois e sem promessa de resultado.

**Evidência:**
- `tests/e2e/sutil-model.spec.ts`, com 4 testes:
  - contador de ida e volta;
  - fases;
  - movimento reduzido com axe AA;
  - esqueleto e roteiro;
  - celular.
- Suíte completa: 102 aprovados e 4 ignorados.
- Vídeo da unidade em `Downloads/sutil-recuperacao-scroll.mp4`, fora do repositório.

**Galeria:** a Sutil ainda não está no catálogo da homepage. O catálogo usa capturas do template antigo e depende da galeria em faixa de páginas, que está pendente em MODELOS-ALTO-TICKET.md.

## Toca pelo sistema (12/11/2026)

**Pedido:** o usuário perguntou se veterinário fazia sentido. A resposta foi sim, se posicionado como hospital ou clínica de especialidades, não como pet shop. Ele aprovou o kit, gerou as seis fotos e aprovou a unidade do hero com o percurso ("Aprovado, montar").

**Kit:** `toca` em `lib/brand-kits.ts`. **Aprovada pelo usuário em 12/11/2026.**
- Paleta medida nas fotos:
  - azulejo #4a787c;
  - petróleo #24474b, o azulejo aprofundado para texto e botões;
  - mostarda #b8894f, da manta;
  - carvalho #bba085;
  - parede #ece9e4;
  - grafite #23282a.
- O pijama sálvia da veterinária não virou cor da marca, porque a sálvia é da Sutil.
- Os rótulos pequenos usam #3b6467 para ter contraste AA.
- Tipografia: Fraunces e DM Sans (OFL, `next/font/google`).

**Página** `/modelos/veterinaria` (`app/modelos/veterinaria/`, conteúdo em `lib/toca.ts`, fotos em `public/images/toca/`):
1. Hero com a chave Cão / Gato (`SpeciesSwitch.tsx`), que troca foto, apresentação, legendas das salas e cuidados por fase. Sem JS, fica a versão do cão.
2. Cinco diferenciais.
3. A assinatura "O percurso" (`TocaMotion.tsx`), em 520svh: portas de carvalho com placas mostarda se abrem e fecham sala a sala (recepção, exames, internação), com a foto se aproximando. O quadro do percurso acende a sala atual junto com a placa, nos dois sentidos.
4. Especialidades como placas de ala.
5. "Conheça a veterinária", com uma placa retangular.
6. Fases da vida sobre a parede de azulejo, uma versão por espécie.
7. Primeira consulta sobre uma faixa mostarda de piso.
8. FAQ.
9. Roteiro `BrandInquiry` "toca": animal, motivo e período.

**Conteúdo:** sem CRMV, sem nome da veterinária, sem depoimentos, sem número de atendimentos e sem plantão 24 h. Textos revisados com o Humanizer.

**Fotos:** o gato é consistente entre as fotos, mas o cão muda de pelagem entre o hero, os exames e a recepção. O usuário foi avisado e pode regerar as fotos.

**Evidência:**
- `tests/e2e/toca-model.spec.ts`, com 5 testes: chave Cão / Gato, portas de ida e volta, movimento reduzido com axe AA, esqueleto e roteiro, celular.
- Suíte completa: 106 aprovados e 4 ignorados. Uma falha intermitente em `visual-review` passou ao repetir.
- Vídeo em `Downloads/toca-percurso-scroll.mp4`, fora do repositório.

## Arrimo: autoridade forte, piloto (19/11/2026)

- Kit `arrimo` em `lib/brand-kits.ts`; piloto em `/modelos/previdenciario`. Barlow Condensed 600/700 nos títulos e Barlow 400/500/600 na leitura.
- Foto jornalística em preto e branco, luz dura e textura documental. Sem recolorir as fotos: preto #080808 e carvão #1f1f1f medidos no hero. Papel #efefef, ouro velho #b49a62 e vermelho de carimbo #943c35 nos grafismos.
- Marca A de duas vigas; botões retangulares, títulos condensados em caixa alta. Hero sem moldura; mãos discretas no fundo da cena. Cartões da régua representam documentos, não quadros de fotografia.
- Assinatura: régua horizontal no PC e vertical no celular. Registros entram, lacunas vermelhas ganham ligações em ouro e o carimbo NEGADO vira EM ANÁLISE. Scroll reversível via GSAP e `useBrandMotion`; pausa e movimento reduzido mostram o estado documental completo.
- Piloto aguardando aprovação visual. Não reutilizar a noite/manhã da Lume nem ampliar esta página antes da avaliação.


### Arrimo: extensão aprovada do piloto (19/11/2026)

O usuário aprovou o piloto e pediu o restante. A autoridade continua na tipografia condensada e na tinta do documento: situações em linhas abertas, assuntos em cartazes grandes, checklist sobre papel e escritório fotográfico em preto e branco. A oficina entra no cartaz de aposentadorias; o atendimento domina o escritório, com gradiente de leitura apenas na área do texto. No celular, a foto antecede o texto na mesma superfície.

A assinatura da régua não mudou. As linhas na base dos cartazes acompanham o scroll e se recolhem na volta; a alternativa estática mantém a linha inteira. Sem efeitos de entrada repetidos em todas as seções. O roteiro compartilhado recebe as fontes e as cores próprias da Arrimo, com perguntas previdenciárias e sem campos pessoais. Revisão visual da página completa pendente; aprovação técnica não substitui a decisão do usuário.


### Arrimo: documentos e carimbo central (20/11/2026)

Revisão solicitada pelo usuário: lacunas devem interromper a régua, em vez de pequenos marcadores entre cartões. Campo vazio com borda tracejada vermelha → preenchimento ouro, com texto correspondente. Os vínculos são folhas de registro envelhecidas em cinzas quentes, com alturas e rotações próprias; não caixas brancas iguais. A fotografia das mãos foi retirada do fundo.

A cena já chega com régua e primeiro documento. No clímax, os documentos recuam, o carimbo ocupa o centro, NEGADO é riscado e desaparece, e só depois EM ANÁLISE desce de escala 1,15 para 1 com tremida. Sem sobreposição dos dois rótulos. Toda a sequência é reversível; fallback completo em fluxo normal. Hero aprovado permanece intacto.


### Arrimo: nome e controles sem sobreposição (20/11/2026)

Ricardo Teles foi nomeado pelo usuário como persona da Arrimo, sem outras credenciais. A miniatura vem do próprio hero; o escritório usa a foto recebida, alinhada ao topo para não cortar o rosto, e apresentação em primeira pessoa. O resumo local explica o que o Ricardo confirma após a análise.

A pausa ocupa espaço reservado no cabeçalho nos dois formatos, sem cobrir a leitura. O nome acessível permanece completo mesmo com o rótulo compacto no celular. NEGADO e EM ANÁLISE têm verificação geométrica de enquadramento em 1536×696 com DPR 1,25 e 390×844. Não recolocar a pausa sobre os parágrafos das seções.


## Paddock: produto, prata e luz (20/11/2026)

Piloto em `/modelos/automoveis`, Unbounded e Sora. Paleta medida no hero: asfalto #010101, grafite #1a1a1a, aço #3e3f3f, reflexo #6a6b6b e prata #a5a5a5. Sem ouro velho da Arrimo, sem cor de CTA importada da agência. O reflexo automotivo já vem nas imagens; não desenhar uma falsa luz sobre a lataria.

A assinatura é o próprio tour recebido, em canvas com scroll reversível: farol → roda/lateral → conjunto. No último plano do celular, os 15 quadros horizontais complementam o recorte vertical recebido, que corta as extremidades, para mostrar o carro inteiro. Stock em fotografias amplas, sem caixas ou fichas decorativas, carroceria filtrável e dados ilustrativos autorizados. Preço “Consulte”. Sem novas fotos ou especificações de motor. Piloto aguarda avaliação visual antes do restante da página.


## Paddock repaginado: laudo antes do preço (20/11/2026)

O usuário rejeitou o piloto de estúdio como clichê e aprovou a proposta “seminovos com o laudo aberto”. Mantêm-se Unbounded, Sora, o tour e as fotos recebidas; o sentido muda de apresentação do produto para leitura da inspeção. A linha atravessa o carro e deixa as quatro marcações pedidas, reversíveis. O laudo vem antes do preço em cada cartão.

Acentos do tablet: azul #3b5578, verde #8bf2dc, roxo #afa0f9. Instrumentos em fotos escuras sobre uma seção de papel cinza frio; compra/critério em azul profundo. A imagem de suspensão recebe bordas escuras via CSS. Não criar laudo numerado, selo de aprovação, porcentagem, depoimento, endereço ou credencial. Ficha e roteiro são fluxos locais com carro pré-selecionado, editável e retorno de foco. A pausa fica no cabeçalho, sem encobrir textos. A página completa aguarda avaliação visual.
