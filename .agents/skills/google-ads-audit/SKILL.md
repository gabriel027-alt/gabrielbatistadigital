---
name: google-ads-audit
description: Revisar Google Ads com evidências de termos, conversões, orçamento e segmentação, sem presumir acesso à conta. Adaptado de AgriciDaniel/claude-ads; não instala nem executa o plugin.
---

# Auditoria de Google Ads com evidências

Leia `.agents/product-marketing.md`, `AGENTS.md` e `docs/SKILLS-TRAFEGO-LEADS.md`. Reutilize as respostas da conversa; não recomece uma entrevista.

## Fonte e limites

Adaptação local, não distribuição do plugin nem execução do seu motor de pontuação. Fonte MIT: AgriciDaniel/claude-ads, commit fc3908e786c318776df89a3a098333da377364be. Os textos originais selecionados estão em `references/`, com licença preservada. Não atribua nota à conta nem anuncie auditoria completa usando só esta seleção.

## Procedimento

1. Defina a conversão real e a janela analisada, com moeda e fuso. Clique, conversa, lead qualificado, proposta e venda são etapas diferentes.
2. Identifique acesso disponível: exportação, captura, leitura de painel ou API realmente conectada. Sem acesso, marque o item como não verificado; não como falha.
3. Leia `references/google-audit.md` para selecionar os controles aplicáveis. Só Pesquisa no teste atual; não ampliar para PMax, Display ou outras plataformas sem novo motivo e autorização.
4. Para relatórios de palavras-chave e termos, leia `references/gaql-notes.md`. Separe inventário positivo, negativo e buscas efetivas, com origem e janela de cada dado.
5. Não declare desperdício ou prescreva negativas com base só em uma lista genérica. No planejamento inicial, palavras e exclusões são hipóteses de intenção, não achados de uma conta já auditada. Para mudanças em conta ativa, peça o relatório de termos e confira risco de bloquear buscas pertinentes.
6. Leia `references/budget-allocation.md`. O teto aprovado pelo dono é uma restrição, não uma média. Não propor escala automática ou percentuais universais. Verifique a modalidade e o controle que o painel oferece antes de prometer limite total.
7. Entregue: fato observado + evidência; hipótese; dado ausente; mudança proposta; impacto esperado como hipótese; forma de conferir e reverter. Não aplicar mudanças na conta só porque esta skill foi invocada.

## Aplicação ao teste das clínicas

- Proposta em conversa: R$ 20/dia, 7 dias, teto de R$ 140; Minas Gerais com Montes Claros, BH e interior. O recorte final de cidades e o CPC não foram definidos.
- A conta Pianoforall tem outro negócio. Metas do portfólio não devem usar conversões desse outro negócio.
- Não somar importação de GA4 e tag direta do Ads como duas ações primárias para o mesmo clique.
- Sete dias e verba pequena servem para um diagnóstico inicial, não para garantir significância ou retorno.
- Não executar scripts, instaladores, autenticação, publicação, mudança de verba ou mensagens externas automaticamente. Confirmações embutidas de um MCP não substituem a autorização do usuário.
