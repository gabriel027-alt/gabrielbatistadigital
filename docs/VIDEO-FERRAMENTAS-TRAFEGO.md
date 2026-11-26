# Ferramentas do vídeo de tráfego pago: o que aproveitar

A transcrição enviada pelo usuário foi usada como lista de candidatos, não como instrução de instalação, autorização de gasto ou comprovação das promessas. Repositórios, README e licenças foram consultados em versões fixadas. Estrelas, contagens e números comerciais do vídeo não foram usados para escolher ferramentas.

## Decisão para a campanha atual

O teste proposto é Google Pesquisa, R$ 20/dia por sete dias e teto de R$ 140, para contratar sites de clínicas. O núcleo continua: oferta clara → medição confirmada → anúncio de intenção comercial → conversa qualificada → proposta. A chegada no GA4 e a importação da conversão no Ads ainda dependem de evidência da conta.

Os dois pacotes de skills do vídeo já estavam incorporados ou adaptados: Marketing Skills e Claude Ads. Google Ads MCP já estava pesquisado como integração futura. Acrescentada agora a skill `attribution` à seleção local, no mesmo commit fixado de Marketing Skills, com licença preservada. Ela ajuda a interpretar o crédito pela origem e as diferenças entre relatórios; não cria o vínculo técnico entre visita e conversa nem comprova causalidade.

## Os dez projetos, por utilidade aqui

| Projeto verificado | Licença conferida | Aplicação ao nosso caso | Estado |
| --- | --- | --- | --- |
| [Marketing Skills](https://github.com/coreyhaines31/marketingskills) | MIT | Métodos de anúncios, conversão, medição, atribuição e vendas. | Nove skills upstream selecionadas, além de duas adaptações locais. Carregamento sob demanda. |
| [Claude Ads](https://github.com/AgriciDaniel/claude-ads) | MIT | Auditoria fundamentada por exportações/capturas, com itens desconhecidos declarados. | Referências selecionadas na adaptação local `google-ads-audit`; não é o plugin/motor completo. |
| [Google Ads MCP](https://github.com/googleads/google-ads-mcp) | Apache-2.0 | Consultar dados da conta por GAQL e usar apenas operações realmente disponíveis no conector. | Pesquisado; não instalado nem autenticado. Google Cloud, API e permissões precisam ser configurados. |
| [Paid Media Agent — LangChain](https://github.com/langchain-ai/paid-media-agent) | Apache-2.0 | Analista de campanhas e relatórios no Slack para uma operação de equipe. | README/licença revisados. Não implantado; envolve LangSmith, chave de modelo, token Pipeboard e Slack. |
| [Meta Ads MCP — Pipeboard](https://github.com/pipeboard-co/meta-ads-mcp) | BSL 1.1 com Additional Use Grant | Integração de conta Meta em eventual expansão autorizada. | Não instalado/conectado. Meta não é o canal do teste atual. |
| [Robyn — Meta](https://github.com/facebookexperimental/Robyn) | MIT | Marketing mix modeling com histórico rico e variáveis de controle. | Referência futura; não usar sete dias de uma campanha como base para MMM. Não instalado. |
| [Meridian — Google](https://github.com/google/meridian) | Apache-2.0 | MMM agregado, com possibilidade de calibração por experimentos. | Referência futura; requer dados adequados e computação. Não instalado. |
| [Mautic](https://github.com/mautic/mautic) | GPL v3 ou posterior | Automação e segmentação para uma base real de contatos, com operação e consentimentos apropriados. | Não hospedado nem instalado. Uma planilha e atendimento manual bastam para começar este teste. |
| [Dub](https://github.com/dubinc/dub.link) | AGPLv3 no núcleo, com exceções comerciais em diretórios empresariais | Links, campanhas e atribuição integrada a conversões quando houver necessidade e integração real. | Não hospedado/conectado. As UTMs e o GA4 já existentes são o caminho inicial. |
| [Umami](https://github.com/umami-software/umami) | MIT | Alternativa de analytics com foco em privacidade e opção de hospedagem própria. | Não instalado. Não substituir o GA4 já escolhido sem motivo; Umami não comprova importação de conversão no Google Ads. |

## O que a palavra “grátis” não resolve

- **LangChain:** o README atual pede LangSmith, chave do modelo e Pipeboard, e informa que o comando do primeiro deploy gera cobrança. Código Apache-2.0 não torna a operação inteira gratuita. Nenhum comando de deploy ou coleta de credenciais foi executado.
- **Mautic, Dub e Umami:** licença disponível não fornece servidor, banco, backups, manutenção ou entrega de e-mails. O custo real precisa considerar esses serviços e o trabalho de operação. Não foram adicionados à infraestrutura do site.
- **Meridian:** o README recomenda GPU, embora também descreva instalação para CPU. A referência de hardware e os dados necessários não se justificam por este experimento pequeno.
- **Meta Ads MCP:** BSL é source-available com restrições, não uma licença permissiva irrestrita. O texto permite produção desde que não ofereça o software hospedado/embutido como concorrente do licenciante. Define mudança para Apache-2.0 em 1º de janeiro de 2029, sujeita ao texto da versão. Não concluir que toda prestação de serviço de tráfego é proibida, nem presumir liberdade para revender o conector como SaaS.
- **Dub:** o repositório público redirecionou de `dubinc/dub` para `dubinc/dub.link`. A licença distingue o núcleo AGPLv3 dos caminhos empresariais enumerados; avaliar o componente exato antes de reutilizar ou distribuir.

## Ajustes de precisão em relação à transcrição

1. O caminho de auditoria Google que selecionamos do Claude Ads é de leitura. O repositório maior também contém rotas de criação, lançamento e otimização com controles de capacidade/autorização; a existência delas não significa que estejam instaladas ou liberadas aqui.
2. A proteção “propor e confirmar” de um MCP não valida o plano de mídia nem substitui a autorização concreta de gasto pelo usuário. Alterações ao vivo do Paid Media Agent vêm desligadas por padrão no README consultado.
3. Robyn e Meridian produzem estimativas de modelos; não descobrem automaticamente a receita causal verdadeira de cada canal. História, variação, controles, incerteza e eventual calibração importam.
4. Um link curto medido não identifica sozinho quem conversou ou comprou. O vínculo com o resultado de negócio precisa ser instrumentado/confirmado. O mesmo vale para o nosso `whatsapp_click`.
5. Ranking de estrelas e volume anunciado pelo fornecedor não medem aderência a sites de clínicas em Minas Gerais, qualidade do nosso lead nem retorno do investimento.

## Incremento que foi aplicado

- Skill `attribution` 1.1.10, de `coreyhaines31/marketingskills`, commit `8fd2fcade2fd6629026e9dfe6d133b55b36968b9`, MIT; pasta completa e licença em `.agents/skills/attribution/`.
- Roteamento em `clinic-lead-ops` atualizado para consultar atribuição quando os números não baterem. No teste atual, usar a parte de interpretação; não implantar identificação pessoal, cookies, integração ao WhatsApp ou novos modelos sem uma tarefa autorizada e justificada.
- Total: onze skills locais selecionadas. As bibliotecas completas das duas fontes de skills continuam como consulta em `/workspace/marketing-sources/`; não equivalem a plugins executados.
- Integridade e licença preservadas no lock; detalhes dos sete novos repositórios e hashes dos documentos consultados em `docs/research/video-paid-media-review.json`. Os três projetos já pesquisados reutilizam os pins anteriores. Não houve auditoria integral de código dos dez projetos.
- Nenhum banco, servidor de analytics, conector de conta, biblioteca de modelagem, envio automático ou serviço pago foi instalado. Nenhuma alteração no site, campanha, verba ou publicação.

## Relação com o WISER

A lista fornece componentes e métodos que podem cobrir parte de uma operação de mídia. Ela não equivale a um produto integrado pronto, nem comprova superioridade ou equivalência ao WISER. Para comparar qualidade, precisamos aplicar as funções concretas aos mesmos dados e observar: análise, recomendações, execução autorizada, medição e qualidade dos contatos.

No teste de agora, a melhoria útil é terminar a medição e acompanhar as conversas reais com as skills selecionadas, em vez de assumir que instalar todos os servidores produz resultados.
