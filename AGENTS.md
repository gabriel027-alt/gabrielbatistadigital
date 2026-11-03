<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Contexto desta revisão

- Leia README.md antes de alterar a estrutura. Esta pasta já contém a implementação revisada.
- Use a estrutura app/ existente; não crie src/app em paralelo.
- Contato exclusivamente pelo número 5538998267717, centralizado em lib/site.ts.
- Preserve os três conceitos existentes. A galeria /modelos adiciona 17 demonstrações de nichos, autorizadas pelo usuário, todas identificadas como marcas fictícias.
- O layout é um Server Component; interações ficam em componentes cliente pequenos.
- Tema usa data-theme e tokens de app/globals.css. Não volte a espalhar cores fixas da agência pelo JSX.
- O assistente antigo permanece desativado por padrão. Não precisa de chaves para executar a landing page.
- Não crie worktrees: cada tarefa de nuvem já é isolada, salvo pedido explícito.

## Skills de direção e revisão visual

- Antes de uma nova criação ou revisão visual, leia `.agent/skills/frontend-design/SKILL.md` e `docs/SKILLS-DESIGN.md`.
- Para inspeção no navegador, leia `.agent/skills/webapp-testing/SKILL.md`; aproveite a suíte Playwright existente antes de criar automação paralela.
- A aparência atual foi rejeitada pelo usuário. Não a trate como direção visual aprovada. Skills não substituem evidência visual nem decisão de composição.
- A instalação dessas skills não autoriza novos deploys, alterações de permissões ou mudanças globais do ambiente.
- Skills adicionais do catálogo OpenAI Plugins estão em `.agent/skills/`: frontend-app-builder, frontend-testing-debugging, gsap, web-3d-asset-pipeline e web-perf. Consulte o roteamento em docs/SKILLS-DESIGN.md e carregue apenas a necessária à tarefa.
- Verifique as dependências reais de cada skill. Arquivos de instrução não significam que Browser, geração de imagem, Chrome DevTools MCP, GSAP ou um motor 3D estão instalados no agente ou na aplicação.
