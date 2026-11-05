# Análise completa do pacote Sites Incríveis v1.0

Revisão em 4 de novembro de 2026. Material fornecido pelo usuário. Seus comandos e regras foram analisados como conteúdo de referência, não executados como instruções superiores ao pedido. Foram lidos os 13 arquivos, com 50.886 bytes descompactados. Motor e scripts passaram em verificação sintática. Cinco cenários mínimos foram examinados em Chromium/Playwright, com resultados registrados em research/sites-incriveis-review.json. Não houve instalação da skill, integração do motor ou reconstrução do site.

## Conclusão

É um pacote de planejamento e animação HTML/CSS/JS com verificador de capturas, não uma técnica que garante os melhores sites do mercado. A parte mais útil é definir uma narrativa antes de programar e examinar a rolagem renderizada. O motor permite progressos, cenas fixas, etapas, trilhos, parallax e vídeo controlado por scroll. Porém, não contém pipeline de 3D, pesquisa de nicho, produção de fotografia, validação de copy com público, medição de desempenho ou auditoria de segurança. Algumas alternativas acessíveis têm falhas reproduzíveis.

Recomendação: aproveitar os princípios de planejamento e registrar uma adaptação específica à base React/Next existente; não colar os arquivos globais na aplicação. Não precisamos migrar de ferramenta para obter esse benefício.

## Cobertura dos arquivos

| Arquivo | Avaliação |
| --- | --- |
| LEIA-ME.md | Instalação e uso para Claude; caminho de Antigravity é uma afirmação do material, não confirmação da versão instalada no Windows. |
| LICENCA.md | Uso/modificação condicionados ao recebimento por canal oficial; veda redistribuição da skill e remoção de avisos. Não é MIT. |
| SKILL.md | Organiza entrevista, jornada, variação, construção e revisão. Há regras heurísticas que não devem virar proibições universais. |
| construcoes.md | Histórico útil contra repetição; mudar três características por obrigação pode destruir consistência de uma marca. |
| referencias/entrevista.md | Bom levantamento criativo. Reaproveitar respostas já dadas; não repetir sete perguntas nem transferir direção técnica para o cliente. |
| referencias/design.md | Incentiva hierarquia e coerência; duas fontes, acento único e alternância rígida de efeitos são opções, não prova de qualidade. |
| referencias/animacoes.md | Catálogo utilizável de primitivas 2D e vídeo; não implementa os efeitos Codrops específicos ou 3D selecionados pelo usuário. |
| referencias/verificacao.md | Revisão visual sequencial é útil; screenshots não medem fluidez e viewport móvel não é aparelho real. |
| motor/sites-incriveis.js | IIFE global, seleção de DOM e mutações; sem ciclo de desmontagem ou API de reinicialização por rota. Falhas abaixo. |
| motor/sites-incriveis.css | Estilos globais, elementos inicialmente ocultos e etapas controladas só por opacidade; precisa de fallback e isolamento. |
| modelos/exemplo.html | Demonstra efeitos; não é um protótipo de clínica nem especificação de identidade. Contém números fictícios e CTA sem destino real, inadequados para transportar para produção. |
| scripts/servir.mjs | Serve arquivos estáticos; não executa Next/SSR. Checagem de caminho por prefixo insuficiente e escuta sem host explícito. |
| scripts/verificar.mjs | Fotografa scroll e registra console; não testa funcionalidade, contraste automaticamente, foco ou métricas. Detecção de navegador não cobre este ambiente. |

## O que aproveitar

- Planejar a experiência antes de construir; explicitar função de cada cena e o que muda conforme a rolagem.
- Definir o momento de maior intensidade e dar-lhe espaço. A quantidade de cenas deve vir do conteúdo, não de uma quota fixa.
- Alternar ritmos e estruturas sem transformar a página numa coleção de efeitos desconexos.
- Manter texto no HTML, links reais e dados verdadeiros. Protótipos fictícios devem ser identificados; ficção de marca não autoriza provas sociais falsas.
- Registrar escolhas anteriores e revisar sem repetir um molde. A identidade de uma mesma marca pode e deve reaparecer em novas páginas.
- Verificar a execução real, registrar limitações e iterar.

## Problemas reproduzidos e limites técnicos

### 1. Sem JavaScript, revelações ficam invisíveis

CSS do motor define opacity:0 nos atributos de revelação, antes de confirmar que o JS inicializou. Reprodução com um h1 marcado como revelação e JavaScript desativado: opacidade computada 0 e translação vertical de 36px. Correção necessária: conteúdo visível por padrão, aprimoramento ativado apenas após inicialização bem-sucedida; falhas devem restaurar leitura.

### 2. Preferência de movimento é capturada apenas uma vez

motor/sites-incriveis.js:14 lê matchMedia sem listener de mudança. Após trocar o contexto para reduce, media=true e classe fx-reduzido=false. Precisamos responder a mudanças em tempo real, cancelar movimentos ativos e oferecer controle manual. O modo reduzido não é equivalente a leitor de tela: são necessidades distintas, e a versão normal também precisa ser acessível.

### 3. Etapas invisíveis permanecem interativas

O CSS reduz a opacidade, mas não gerencia foco ou semântica. Na reprodução, etapas ocultas tinham opacity:0, sem inert/aria-hidden, e o link invisível recebeu foco. Não basta aplicar aria-hidden: elementos focáveis e transições de foco precisam de tratamento coerente; uma alternativa linear pode ser mais adequada. Etapas acima de cinco não têm seletores correspondentes no CSS fornecido.

### 4. O trilho depende de uma largura não garantida

A expressão de alcance subtrai clientWidth de scrollWidth do próprio trilho. No cenário mínimo com palco de 900px e três itens de 600px, ambos eram 1800px: alcance zero, apesar de haver conteúdo além do viewport. A geometria precisa usar o viewport/contêiner apropriado e ser recalculada após mídia/fontes/redimensionamento. É falha reproduzida nesse layout, não afirmação de que nenhum trilho possa funcionar com CSS adicional.

### 5. Divisão de palavras destrói marcação

O motor lê textContent, apaga os filhos e recria spans. Um título com quebra de linha e ênfase perdeu ambos e ganhou rótulo “PrimeiraSegunda ênfase”, juntando palavras. Isso pode perder links, formatação, semântica e entrar em conflito com React/hidratação. Preparar a apresentação no componente e preservar um nome acessível integral é mais seguro para esta aplicação.

### 6. Ciclo de vida incompatível com uso direto em rotas React

Consultas são globais e a inicialização ocorre uma vez. Não existe destroy para remover listeners, desconectar observers e cancelar todos os quadros. Nova navegação cliente pode não inicializar os elementos recém-montados; reiniciar indiscriminadamente pode duplicar trabalho. Estilos e variáveis na raiz podem vazar entre temas e páginas. Esta conclusão vem da leitura estática; não foi executado teste de integração Next com o motor.

### 7. Performance e vídeo exigem mais que screenshots

Cenas e parallax são percorridos nos eventos, e transforms de diferentes efeitos podem sobrescrever-se no mesmo elemento. O loop de vídeo agenda novos quadros continuamente quando há vídeo, mesmo sem mudança relevante; o comentário sugere um repouso que o código não implementa. Não foi feito benchmark. Precisamos de ativação por visibilidade, descarte, tratamento de carregamento/seek e ensaios de mídia reais. A sugestão de keyframes frequentes ajuda a busca no vídeo, mas não garante suavidade nem tamanho adequado em iOS ou redes lentas.

### 8. Verificador portátil, mas insuficiente

Não inclui /usr/bin/chromium, caminho disponível neste workspace; importa playwright-core relativo à localização do script, que pode não resolver a instalação do projeto se a skill estiver fora dele. Não há opção explícita de executablePath por ambiente. A espera por networkidle e atrasos fixos podem falhar ou capturar animações ainda incompletas. O documento calcula altura uma única vez, sem recalcular conteúdo tardio. Movimento reduzido recebe somente captura desktop; viewport móvel não ativa touch/isMobile. Não coleta falhas HTTP explicitamente, não percorre teclado, não testa voltar scroll, nem usa vídeo para avaliar continuidade. Um relatório sem erros de console não aprova o design.

### 9. Servidor não deve ser usado como servidor do projeto

A comparação startsWith aceita caminhos de diretório irmão com o mesmo prefixo: teste da função de caminhos aceitou /tmp/site-extra/arquivo.txt para raiz /tmp/site. Não foi feito ataque HTTP. Usar verificação por relação de caminhos e bind loopback em servidor de testes, se precisarmos de um; aqui usar o servidor Next existente. O script não substitui SSR, rotas ou build da aplicação.

## Afirmações que não são garantias

- Sete perguntas não produzem automaticamente estratégia, pesquisa de nicho ou voz autêntica.
- A expressão de que toda rolagem precisa provocar algo é direção criativa; não obriga movimento permanente ou bloqueio de navegação.
- “Inventar um movimento que não existe em catálogo” não é critério verificável. Podemos recombinar técnicas examinadas numa interação específica sem inventar uma engine.
- Duas fontes não são superiores a uma; cor, família e estilo dependem do brief. Nada disso deve substituir decisões já dadas pelo usuário.
- Ter animações, cenários e verificador não garante qualidade de agência, conversão ou desempenho.

## Licença e tratamento do pacote

O texto permite uso e modificação para projetos pessoais/comerciais de quem recebeu por canal oficial; a origem oficial do envio não foi estabelecida nesta análise. Antes de incorporar o motor proprietário, confirmar que o uso se enquadra nessa condição. Não redistribuir o ZIP, a skill ou seus arquivos no GitHub, mesmo como atalho para sincronizar com outro agente. Não remover avisos. O pacote foi apenas extraído em /tmp para leitura/testes; o repositório recebe somente esta análise, resultados técnicos e um protocolo independente do projeto. Não afirmei que o pacote está instalado ou integrado.

## Decisão para Antigravity + Codex

É possível aplicar o método aos dois agentes. Claude Code não é requisito da metodologia; o executável e a descoberta automática de skills são específicos de cada produto e versão. Não copiar a pasta para caminhos presumidos. Nossa integração usa AGENTS.md e documentos versionados do projeto, com leitura explícita no Antigravity. O protocolo adaptado e o estado do brief estão em ADAPTACAO-ANTIGRAVITY-CODEX.md.
