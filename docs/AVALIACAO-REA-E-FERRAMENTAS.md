# Avaliação do material sobre REA e ferramentas

4 de novembro de 2026. Pesquisa de documentação; nenhuma instalação ou conexão de conta realizada.

## REA

O pacote npm rea-agents informa repositório https://github.com/morluto/rea, versão consultada 6.8.0 e licença MIT (licença do repositório também lida). README e docs/browser-observation.md consultados. O tutorial https://github.com/47thtechcorner/RayCodes_Rea-AI-Agent-Setup foi encontrado, mas é material de configuração, não a implementação original.

A documentação original descreve inspeção passiva via CDP: DOM, árvore de acessibilidade, scripts, recursos, observações de rede e console, capturas e comparação de evidências. Não é garantia de clone completo, acesso ao backend, fontes originais ou reprodução de animações e shaders. Há ferramentas separadas para cenários Playwright. Observação incompleta não comprova igualdade.

Relevância: coletar evidências da referência e comparar estados pode ajudar nosso fluxo. Não substitui direção de arte, implementação, licença dos assets ou revisão móvel. A licença MIT da ferramenta não se estende ao site observado.

Dependência encontrada: engines do pacote exige ^22.23.4 || ^24.22.1 || >=26.12.1. O Node local é v24.19.0, fora do intervalo. Não executar setup ou instalar globalmente com essa incompatibilidade. Este agente não tem conexão com o Chrome do Windows do usuário. Instalação e conexão são pendentes, não presumidas.

## No AI Slop

https://github.com/petergyang/no-ai-slop — README, skills/no-ai-slop/SKILL.md, eval.md e LICENSE MIT consultados. É o candidato que corresponde aos exemplos da transcrição. O trabalho é revisar um rascunho, preservar voz, cortar construções genéricas e verificar o resultado. Tem avaliação editorial explícita; não é detector confiável de autoria nem pesquisa de público. As listas em inglês requerem interpretação em português, sem substituir expressões naturais por traduções rígidas.

Recomendação: candidato pertinente para revisão da copy. Ainda não instalado. Não copiar automaticamente outra coleção encontrada, realrossmanngroup/no_ai_slop_writing_rules: seu README inclui imitação da voz de Louis Rossmann, diferente da voz de Gabriel.

## Outras ferramentas da transcrição

- https://github.com/microsoft/playwright-cli: README consultado. CLI destinada a agentes e documentação de diferenças para MCP. Já temos Playwright Test; avaliar se há ganho em adicionar outra interface. Economia de tokens depende da tarefa. Playwright não é exclusivamente uma biblioteca Python.
- https://github.com/upstash/context7: README consultado. Documentação por biblioteca/versão; há CLI e MCP. API key recomendada para limites maiores. Útil quando faltar documentação local; cobertura não significa todas as bibliotecas e versões. Nenhuma chave configurada nesta etapa.
- https://github.com/remotion-dev/remotion: LICENSE.md consultado. Adequado a vídeos renderizados com código; não substitui automaticamente uma timeline ligada à rolagem. Gratuidade tem condições: texto consultado permite indivíduos, organizações sem fins lucrativos e empresas de até três funcionários; outros casos exigem licença. Conferir termos na adoção.
- https://github.com/googleworkspace/cli: README consultado. Requer configuração de projeto Google Cloud e autenticação. O próprio README avisa que não é produto oficialmente suportado pelo Google e prevê mudanças. Pertinente à operação/CRM, sem benefício direto para compor a hero.
- https://github.com/ComposioHQ/composio: README consultado. Integrações podem servir à operação. Quantidade de ferramentas e limites gratuitos citados no vídeo não foram confirmados; não conectar contas por este material.
- Claude in Chrome, skills antibot e security audit Cloudflare: não identifiquei e examinei os artefatos exatos nesta pesquisa. Não afirmar instalação, compatibilidade ou eficácia. A promessa de reduzir 90% dos erros não tem evidência na transcrição. Navegador alternativo não resolve bloqueio de rede imposto pelo ambiente; não contornar o proxy.

## Prioridade

1. Considerar No AI Slop para revisão editorial, com checagem factual e voz de Gabriel.
2. Usar a inspeção e testes já disponíveis para estados, scroll e capturas. Avaliar REA como complemento de evidência, após runtime compatível e navegador acessível.
3. Consultar Context7 quando houver lacuna real na documentação disponível.
4. Reservar Remotion para necessidade definida de vídeo; Workspace/Composio para a frente de operação.

Não foi executado benchmark de fidelidade, economia de tokens, teste de português ou auditoria de segurança dessas ferramentas. URLs de branch HEAD e metadados latest são móveis; fixar versão antes de adoção.
