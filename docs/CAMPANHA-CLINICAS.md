# Campanha de clínicas: passo a passo (25/11/2026)

Roteiro para o usuário montar sozinho a primeira campanha no Google Ads. A página de destino é `/clinicas`. Valores de orçamento e de lance são decisão dele; nada aqui é promessa de resultado.

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
- **Local:** a região onde ele quer atender primeiro (pode ser o Brasil todo, porque o trabalho é à distância). Opção: "Presença: pessoas que estão no local".
- **Idioma:** português.
- **Orçamento:** um valor diário pequeno para testar por duas semanas, decidido por ele.
- **Lance:** começar em "Maximizar cliques" com limite de CPC; trocar para "Maximizar conversões" depois de umas 15 a 30 conversões.
- **URL final:** `https://www.gabrielbatistadigital.com.br/clinicas?utm_source=google&utm_medium=cpc&utm_campaign=clinicas` (o site já guarda utm e gclid junto com cada clique no WhatsApp).

### Grupos de anúncio e palavras-chave (correspondência de frase e exata)

| Grupo | Palavras-chave |
| --- | --- |
| Clínica geral | "site para clínica", "criar site para clínica", "site para clínica médica", [site para consultório] |
| Odontologia | "site para dentista", "site para clínica odontológica", "site para consultório odontológico" |
| Psicologia | "site para psicólogo", "site para psicóloga", "site para clínica de psicologia" |
| Estética | "site para clínica de estética", "site para harmonização facial", "site para biomédica esteta" |

**Negativas da campanha:** grátis, gratuito, curso, aula, tutorial, como fazer, modelo, template, wix, wordpress, canva, emprego, vaga, estágio, freelancer barato, mercado livre, pdf.

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
