# Primeira oferta: landing pages para clínicas de estética

Pesquisa e estrutura inicial — 4 de novembro de 2026. Documento de trabalho, sem alteração da interface.

## Confirmado pelo usuário

Público comercial inicial: clínicas de estética. Produto inicial: landing page. O portfólio continua sendo Gabriel Batista Digital. Agendamento integrado, CRM, anúncios, automações, preço, prazo, hospedagem e suporte não foram definidos como parte da oferta. WhatsApp como destino é uma proposta de escopo, ainda não uma exigência expressa do usuário para todos os clientes.

## Duas páginas, duas funções

- Portfólio de Gabriel: explicar o serviço ao responsável pela clínica e iniciar conversa comercial.
- Landing page vendida: ajudar o visitante da clínica a compreender a oferta específica e entrar em contato. Pode apresentar a clínica ou uma campanha de procedimento; escolher após briefing, sem usar a mesma estrutura automaticamente para ambos.

## Inspeção da base

lib/content.ts contém Aura Aesthetics, estudo fictício com “A beleza de ser inteiramente você”, “Escuta”, “Harmonia” e “Cuidado”. Esses textos não demonstram diferenciais de uma clínica real e não validam conversão. Preservar a identificação como estudo autoral. Não apresentar Aura como cliente atendido ou caso de resultado.

## Pesquisa consultada e alcance

1. W3C, Understanding Labels or Instructions: https://github.com/w3c/wcag/blob/HEAD/understanding/20/labels-or-instructions.html — conteúdo consultado nesta sessão. Orienta tornar propósito e instruções de campos compreensíveis, sem informação excessiva. Aplicação: se houver formulário, rótulos e instruções claros; não criar formulário por rotina. Este critério isolado não certifica acessibilidade integral e não comprova conversão no nicho.
2. GoogleChrome/web-vitals: https://github.com/GoogleChrome/web-vitals — README consultado nesta sessão. Distingue métricas reais de usuários e diagnósticos; descreve LCP, CLS e INP. Aplicação: definir medição e estabilidade antes de prometer rapidez; não há medição atual nem justificativa para instalar biblioteca nesta fase.
3. Skill local frontend-design, lida na retomada: prioriza conteúdo específico, função dos elementos e crítica de padrões genéricos. Não contém pesquisa comercial de clínicas nem garante autenticidade da voz.

Fontes remotas consultadas em branches móveis; não são versões fixadas para incorporação de código. Nenhum código externo copiado. Uma tentativa de consulta ao repositório GOV.UK retornou 404; não conta como fonte lida. Acesso a um domínio externo de clínica retornou 403 do proxy. Não foi possível realizar comparação de clínicas reais. Não há evidência nesta etapa sobre objeções predominantes, preferência estética ou desempenho comercial desse público.

## Hipóteses para investigar

Quem atende, qualificações, procedimentos, localização, como ocorre a primeira avaliação e o próximo passo podem ajudar a decidir pelo contato. São perguntas de pesquisa, não descobertas sobre pacientes. Verificar com o responsável da clínica, materiais reais e dúvidas autorizadas. Identificar profissão e responsável antes de definir regras de publicidade aplicáveis; clínicas de estética não são todas médicas. Não afirmar conformidade profissional sem revisão pertinente.

## Estrutura provisória do produto

| Parte | Pergunta respondida | Material necessário |
| --- | --- | --- |
| Abertura | Que atendimento é oferecido e onde? | Nome, cidade/unidade, foco e foto real autorizada |
| Oferta selecionada | O que posso conhecer nesta clínica? | Serviços confirmados, descrição factual e limites |
| Profissionais e espaço | Quem atende e onde? | Identidade, qualificações verificadas e fotos autorizadas |
| Primeira avaliação | O que acontece ao entrar em contato? | Etapas e condições reais, sem inventar gratuidade |
| Evidências, se disponíveis | O que sustenta as afirmações? | Provas autênticas autorizadas e adequadas às regras aplicáveis |
| Dúvidas e contato | O que preciso saber para dar o próximo passo? | Perguntas reais, localização, horários e canal confirmado |

Ordem e extensão dependem do objetivo da campanha. Não tornar cada parte um cartão idêntico. Não obrigar depoimentos, antes/depois, números ou galeria quando não houver materiais válidos.

## Copy inicial para o portfólio de Gabriel — proposta, não aprovação

Título: “Landing pages para clínicas de estética.”

Apoio: “Eu organizo a apresentação da sua clínica em uma página: os atendimentos, os profissionais e as informações que ajudam quem chega a entender o próximo passo.”

Ação: “Conversar sobre a página da minha clínica”.

É uma base factual para tornar a oferta compreensível, não um slogan final. A afirmação sobre organizar o conteúdo deve corresponder ao serviço contratado. Não prometer agenda cheia, retorno de anúncios, posição no Google ou conversão garantida. O título pode ser refinado após definição da oferta e evidências do público, sem mudar o retrato nem reconstruir o site inteiro.

## Escopo candidato para orçamento

Uma página, adaptação a celular e desktop, organização do conteúdo fornecido, integração ao canal confirmado e verificações de navegação, acessibilidade e carregamento. Definir por escrito: materiais, redação incluída, quantidade de revisões, domínio/hospedagem, manutenção, analytics, publicação e condições comerciais. Nada disso deve ser anunciado como contratado antes da definição.

## Próxima validação

1. Completar comparação com clínicas reais quando houver acesso: registrar URL, data, tipo de clínica, objetivo aparente, hierarquia, provas, CTA e comportamento móvel; não inferir eficácia apenas pela aparência.
2. Especificar primeira tela do portfólio e um exemplo de produto, mantendo separadas as audiências. Aproveitar Aura somente como estudo de design, com crítica do conteúdo.
3. Verificar composição renderizada com assets corretos, teclado, temas, larguras móveis, links e carregamento. Publicar métricas somente após medi-las.

Nenhuma nova dependência, skill, integração, interface ou promessa comercial foi adicionada nesta etapa.
