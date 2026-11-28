# Campanha de clínicas: passo a passo (25/11/2026)

Roteiro para o usuário montar sozinho a primeira campanha no Google Ads. A página de destino é `/clinicas`. Valores de orçamento e de lance são decisão dele; nada aqui é promessa de resultado.


## Estado de retomada (26/11/2026)

Ler primeiro [o ponto de continuidade no design system](DESIGN-SYSTEM.md#retomada-tráfego-pago-e-captação-de-leads-26112026). O usuário propôs R$ 20/dia por sete dias, teto de R$ 140, em Minas Gerais (Montes Claros, BH e principais cidades do interior). Não repetir orçamento/região como se não tivessem sido discutidos: faltam lista final de cidades, CPC, início, controle efetivo do teto e autorização de ativação.

A página e os identificadores foram conferidos publicamente, mas a chegada de `whatsapp_click` ao GA4 e sua importação no Ads ainda precisam de evidência da conta. Nenhuma campanha foi criada ou ativada pelo Codex. [Anúncios, palavras e planilha](campanhas/clinicas/LEIA-ME.md) estão salvos no repositório como rascunhos, não como alterações prontas para aplicar.

## 1. Antes de gastar: a medição

1. No celular, abrir https://www.gabrielbatistadigital.com.br/clinicas, aceitar os cookies e tocar em um botão do WhatsApp (pode fechar a conversa sem enviar).
2. No GA4 (`G-WRGB672YF4`): Relatórios > Tempo real. O evento `whatsapp_click` precisa aparecer em alguns minutos.
3. GA4 > Administrador > Eventos: marcar `whatsapp_click` como **evento-chave**. (Ele só aparece na lista depois de acontecer uma vez, por isso o passo 1.)
4. Google Ads > Metas > Conversões > Nova ação de conversão > Importar > Google Analytics 4 > `whatsapp_click`.
5. Na campanha, usar **metas específicas da campanha** com só essa conversão. A conta (Pianoforall) tem outras conversões; elas não podem guiar esta campanha.
6. Google Ads > Configurações da conta: **codificação automática (gclid) ligada**.

## 2. A campanha

- **Tipo:** Rede de Pesquisa (não Performance Max nem Display para começar).
- **Nome:** `Portfolio | Clinicas | Pesquisa`.
- **Local proposto:** Minas Gerais, incluindo Montes Claros, BH e interior; lista final a confirmar. Opção: "Presença: pessoas que estão no local". Começar só pelas duas cidades foi sugestão do assistente, ainda não confirmada pelo usuário.
- **Idioma:** português.
- **Proposta de orçamento:** R$ 20/dia por sete dias, teto total desejado de R$ 140. A média diária e as datas não garantem esse teto; conferir a modalidade e os controles reais antes de ativar.
- **Lance proposto:** começar em "Maximizar cliques" com limite de CPC a definir com dados. Avaliar mudança para conversões conforme qualidade/volume/atraso dos resultados e capacidade da conta; não trocar automaticamente por atingir uma contagem fixa.
- **URL final:** `https://www.gabrielbatistadigital.com.br/clinicas?utm_source=google&utm_medium=cpc&utm_campaign=clinicas` (o site já guarda utm e gclid junto com cada clique no WhatsApp).

### Grupos de anúncio e palavras-chave (correspondência de frase e exata)

| Grupo | Palavras-chave |
| --- | --- |
| Clínica geral | "site para clínica", "criar site para clínica", "site para clínica médica", [site para consultório] |
| Odontologia | "site para dentista", "site para clínica odontológica", "site para consultório odontológico" |
| Psicologia | "site para psicólogo", "site para psicóloga", "site para clínica de psicologia" |
| Estética | "site para clínica de estética", "site para harmonização facial", "site para biomédica esteta" |

**Hipóteses iniciais de negativas, não auditadas nem para aplicação automática:** grátis, gratuito, curso, aula, tutorial, como fazer, modelo, template, wix, wordpress, canva, emprego, vaga, estágio, freelancer barato, mercado livre, pdf.

### Anúncio responsivo (confira o limite de caracteres no próprio Ads)

Títulos (até 30 caracteres):
- Site para Clínica
- Site com a Cara da Clínica
- Nada de Modelo Pronto
- Design e Programação Própria
- A partir de R$ 3.000
- Fale Direto com Quem Faz
- Veja Projetos de Clínicas
- Rápido no Celular
- Orçamento por Escrito
- Converse no WhatsApp

Descrições (até 90 caracteres):
- Sites com a identidade da sua clínica, feitos do zero. Veja projetos e converse comigo.
- Um site de uma página a partir de R$ 3.000. O valor final vem por escrito na proposta.
- Eu mesmo desenho e programo o site, para o paciente saber o próximo passo.
- Para dentistas, psicólogos e clínicas de estética e saúde que vendem pela confiança.

**Não escrever:** número de clientes, resultados, "mais pacientes garantidos", prazos, depoimentos ou "o melhor". Nada que o site não mostre.

**Recursos:** sitelinks para `/clinicas#...` das seções (projetos, como funciona, investimento, perguntas) e frases de destaque (Sem modelo pronto, Proposta por escrito, Atendimento pelo WhatsApp).

## 3. Primeira semana

- Olhar diariamente o relatório de **termos de pesquisa** e negativar o que não é cliente.
- Conferir se cada clique no WhatsApp aparece no GA4 com `place` (topo, investimento, final) e a campanha.
- Não mexer em lance nem anúncio antes de uns 7 dias, salvo termos ruins.
- Anotar cada conversa real que chegar (quem, de onde, se virou proposta): é o que diz se a campanha funciona, mais do que o clique.

## Estado observado em 27/11/2026 (capturas do usuário)

- **Tag Assistant na `/clinicas`:** duas tags Google na página, `AW-18582583733` (Google Ads) e `G-WRGB672YF4` (GA4). Um clique de teste no WhatsApp enviou:
  - ao Ads: "Conversão" (tag direta com rótulo, via `NEXT_PUBLIC_ADS_ID` e `NEXT_PUBLIC_ADS_CONVERSION_LABEL` na Vercel), "Whatsapp Click" e visualização de página;
  - ao GA4: `whatsapp_click` e visualização de página.
  - É prova de **envio**; a chegada no painel do GA4 (DebugView/Tempo real) e o status da ação de conversão no Ads ainda não foram vistos.
- **Conta do Ads:** 590-815-6468 "Gabriel Batista", conta própria, e não a Pianoforall do histórico. Isso resolve a mistura de conversões com outro negócio.
- **Campanha:** "Pesquisa | Sites para Clínicas | MG | Teste 01", Grupo de anúncios 1, **já exibindo** (Diagnóstico de anúncios: "Seu anúncio está sendo exibido" para "criação de sites para dentistas" em Belo Horizonte, celular). Criada e ativada pelo usuário; não pelo Claude nem pelo Codex.
- **Contar uma vez:** a conversão primária da campanha deve ser só a tag direta ("Conversão"). Se o `whatsapp_click` do GA4 for importado, deixá-lo como secundário.
- **Pendências:** status da ação de conversão no Ads (Metas > Conversões), conferir orçamento diário, data de término e cidades na configuração da campanha, e o relatório de termos de pesquisa depois de 1 a 2 dias.
