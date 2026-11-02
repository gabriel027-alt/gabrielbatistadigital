# Uma cópia compartilhada do projeto

Repositório: https://github.com/gabriel027-alt/gabrielbatistadigital
Branch de trabalho: `revisao-site`. A `main` permanece preservada; este fluxo não publica o site.

## Primeira conexão no Windows

A pasta extraída do ZIP pode não ter histórico Git. Não execute pull sobre ela nem substitua seus arquivos antes de preservar as mudanças.

No Antigravity, peça ao agente para:

1. Identificar a raiz pelo package.json, verificar `git status` e o endereço remoto, sem assumir que a pasta já é um clone.
2. Se já houver um clone correto, inspecionar as alterações locais e remotas antes de sincronizar. Não usar reset --hard, clean ou push forçado.
3. Se for uma pasta de ZIP, manter a pasta original intacta e clonar o repositório em uma nova pasta irmã, na branch revisao-site. Não clonar dentro do projeto.
4. Comparar a pasta original com o clone, ignorando .git, node_modules, .next, test-results, playwright-report, logs, ZIPs e .env/credenciais. Transferir apenas mudanças de código, documentação e assets do projeto. Não sobrescrever os arquivos novos do fluxo GitHub com versões antigas. Apresentar conflitos reais antes de resolvê-los; não inferir exclusões só porque um arquivo falta na pasta antiga.
5. Revisar o diff e executar as verificações. Criar uma branch `ajustes/antigravity-local` para as alterações recuperadas, fazer commit apenas de arquivos revisados e enviar essa branch ao origin. Não enviar main nem publicar o site. A autenticação é feita pelo usuário no fluxo oficial do GitHub; não colocar tokens em arquivos ou no chat.
6. Informar a URL da branch e o SHA do commit. Abrir a pasta do clone como workspace e usá-la a partir daí.

## Rotina depois da conexão

Antes de editar: confirmar branch, remote e árvore limpa; executar fetch e examinar divergências. Em branch limpa, atualizar com `git pull --ff-only`. Se houver mudanças locais ou divergência, preservar o trabalho e resolver antes de continuar; não forçar sincronização.

Evite dois agentes editando os mesmos arquivos simultaneamente. Ao entregar uma revisão, informe branch e commit. ZIPs continuam opcionais, mas deixam de ser o mecanismo de sincronização.

## O que já está automatizado

Em pushes de `revisao-site` e `ajustes/**`, PRs para main/revisao-site e execução manual, `.github/workflows/quality.yml` instala dependências e Chromium, executa lint, build, tipagem e Playwright. Nenhuma chave de aplicação ou publicação é necessária.

Na aba **Actions**, abra a execução correspondente ao commit e baixe o artefato `revisao-visual-<SHA>`. Ele contém o relatório HTML, capturas Dia/Noite em 1440px e 390px, gravações da abertura até a galeria e traces de falhas. Extraia o artefato para consultar os arquivos. Evidências visuais exigem revisão humana; testes aprovados não significam design aprovado. Os artefatos expiram após 14 dias.

Localmente, execute build antes de `npm run test:e2e -- --reporter=list,html`; depois use `npx playwright show-report`. O Chromium local pode ser informado por PLAYWRIGHT_CHROMIUM_EXECUTABLE.

## O que ainda não está configurado

Não há hospedagem de preview por branch, proteção de branch ou merge automático. O workflow não faz deploy. A vinculação a um provedor de preview depende da conta e do projeto de hospedagem usados; configurar isso é uma etapa separada. Não instalar bibliotecas visuais sem uma necessidade concreta da implementação.
