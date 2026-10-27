# Gabriel Batista Digital — versão revisada

Site institucional em Next.js App Router, React, TypeScript estrito e Tailwind CSS 4. O projeto usa o domínio `https://gabrielbatistadigital.com.br` e exclusivamente o WhatsApp **5538998267717** para contato comercial.

## Abrir esta versão

Extraia o ZIP em uma **pasta nova**, sem mesclar com a versão antiga. Abra essa pasta como projeto no Antigravity. A pasta correta contém este README, `package.json`, `app/`, `components/` e `lib/`.

Requer Node.js 22+ e npm. O lockfile acompanha a entrega.

```sh
npm ci
npm run dev
```

Mantenha uma única sessão de desenvolvimento. O endereço efetivo é o mostrado no terminal. Não encerre processos de outros projetos. Cada tarefa de nuvem já é isolada; não crie worktrees sem solicitação.

## Validação e produção

```sh
npm run lint
npm run build
npm run typecheck
npm run start
```

O build usa webpack explicitamente. Isso evita depender de diferenças do ambiente de Turbopack na geração de produção. O desenvolvimento usa o padrão do Next.js. A fonte Manrope é empacotada localmente via `@fontsource-variable/manrope`, com licença OFL presente na dependência; não há requisições de fontes ao Google em runtime ou build.

Para publicar na Vercel: importar o repositório como Next.js, usar Node.js 22 ou superior, instalação `npm ci` e build `npm run build`. As funcionalidades públicas não precisam de variáveis ou chaves. A configuração do domínio e a publicação são etapas separadas e não foram feitas nesta entrega.

## O que foi implementado

- Header sticky com navegação, tema persistente e menu móvel com Escape.
- Hero editorial de duas colunas, com composição geométrica original em CSS/SVG.
- Faixa estática de tecnologias, sem animação contínua obrigatória.
- Manifesto e princípios.
- Cinco serviços com seleção vertical no desktop e horizontal no celular, incluindo SEO local; navegação por setas, Home e End. Previews das demos autorais de Chronos e Vanguard e interfaces ilustrativas específicas para sistemas, SEO e performance.
- Portfólio com três conceitos, previews originais, arraste/swipe, controles e reprodução opcional. O carrossel usa scroll nativo e navegação circular por controles, sem clones ou promessa de marquee infinito.
- Processo em sete etapas.
- Sobre o estúdio.
- Fluxo ilustrativo de integrações, sem envio ou simulação de leads reais.
- Diagnóstico local de três perguntas, recomendação determinística e link de WhatsApp com resumo. Sem cadastro ou armazenamento das respostas.
- Rodapé e WhatsApp flutuante.
- Metadados, canonical, Organization JSON-LD, imagem Open Graph, favicon, robots, sitemap e página 404.
- Três demonstrações estáticas com navegação e conteúdo próprios, identificadas como marcas fictícias, com `noindex`.

## Editar o conteúdo

| Arquivo                                  | Responsabilidade                                                   |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `lib/site.ts`                            | Marca, domínio, navegação e WhatsApp oficial                       |
| `lib/content.ts`                         | Serviços, três conceitos e processo                                |
| `lib/whatsapp.ts`                        | Links oficiais e mensagens codificadas                             |
| `lib/diagnosis.ts`                       | Perguntas, regras e resumo do diagnóstico                          |
| `components/sections/`                   | Seções efetivamente renderizadas pela home                         |
| `components/Hero.tsx`                    | Texto e composição visual da primeira dobra                        |
| `components/sections/ServicePreview.tsx` | Previews e interfaces de cada serviço                              |
| `public/images/services/`                | Capturas WebP das demonstrações próprias, sem assets da referência |
| `components/ConceptArt.tsx`              | Arte local do relógio, arquitetura e escultura                     |
| `app/globals.css`                        | Tokens dos dois temas, layout e responsividade                     |
| `app/conceitos/[slug]/page.tsx`          | Template e metadados das três demonstrações                        |

Demonstrações:

- `/conceitos/chronos-atelier` — Alta Relojoaria.
- `/conceitos/vanguard` — Arquitetura Minimalista.
- `/conceitos/aura-aesthetics` — Medicina de Luxo.

As marcas, produtos e estudos não representam clientes, obras ou atendimentos reais. Nenhuma métrica, avaliação ou depoimento foi inventado. As páginas conceituais ficam fora do sitemap da agência.

## Testes de navegador

```sh
npx playwright install chromium
npm run build
npm run test:e2e
```

Os testes iniciam uma instância de produção temporária na porta 3107. Essa porta precisa estar livre. Para usar um Chromium já instalado, defina `PLAYWRIGHT_CHROMIUM_EXECUTABLE` com seu caminho. O servidor de testes é encerrado pelo Playwright.

A suíte verifica seções e links, WhatsApp, abas, teclado, temas, menu móvel, carrossel, diagnóstico, três demos, metadados, larguras de 360 a 1920 px e auditoria automática de acessibilidade nos dois temas. Auditoria automática não substitui avaliação manual com tecnologias assistivas.

## Tema e movimento

A preferência `gbd-theme` é salva localmente. Na ausência de escolha, a preferência do sistema define o tema. O bootstrap roda antes da pintura; listeners são limpos ao desmontar. O layout permanece um Server Component.

Não há parallax contínuo ou texto oculto esperando animações. O portfólio só se move automaticamente após ação explícita. Reduced motion desativa essa reprodução e os efeitos de transição. Clones de slides não são usados.

## Assistente de IA da versão anterior

`components/ChatAssistant.tsx`, `lib/openai.ts` e `app/api/chat/route.ts` foram preservados para não perder o trabalho anterior. O assistente não é renderizado na landing page: o diagnóstico funciona localmente e o contato é pelo WhatsApp.

A API antiga retorna 404 por padrão; só é habilitada com `ENABLE_AI_ASSISTANT=true`. Nenhuma chave foi incluída, copiada dos anexos ou usada nos testes. A integração externa não foi validada e não faz parte dos critérios de funcionamento do site. Antes de reativá-la publicamente, revise autenticação, limites de uso e validação de entrada adequados ao seu caso.

## Arquivos excluídos da exportação

O ZIP não contém `.env*`, chaves, `.git`, `node_modules`, `.next`, logs, caches de TypeScript nem relatórios gerados de teste. Execute `npm ci` na nova pasta para instalar as dependências. Não copie a `.next` do projeto antigo.
