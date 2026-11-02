# Gabriel Batista Digital — Portfólio / contato direto

Next.js App Router, TypeScript estrito e Tailwind CSS 4. Contato comercial exclusivo: https://wa.me/5538998267717.

![Hero noturna](docs/preview/home-dark.webp)

[Versão diurna](docs/preview/home-light.webp) · [Celular](docs/preview/hero-mobile-complete.webp) · [Portfólio](docs/preview/portfolio.webp) · [Nova vitrine](docs/preview/spotlight-imoveis.webp) · [Gravação da interação](docs/preview/showcase.webm)

## Executar

Node.js 22+ e npm. Abra a pasta que contém este arquivo e `package.json`.

```sh
npm ci
npm run dev
```

Use a porta que o terminal confirmar. Não inicie cópias concorrentes do mesmo projeto.

```sh
npm run lint
npm run build
npm run typecheck
npm run start
```

## Direção visual e conteúdo

- Abertura com a quinta fotografia escolhida pelo usuário, exportada para `public/images/hero/gabriel-contact.webp`. Não foram gerados novos rostos, expressões ou poses. A exportação WebP comprime a fotografia, sem retoque facial.
- O scroll desloca e amplia discretamente a composição inteira; não simula giro corporal. Não há canvas, vídeo, sequência de quadros ou dissolve entre rostos.
- Pausa congela o movimento; movimento reduzido e economia de dados deixam a composição estática. Sem JavaScript, fotografia, oferta e contato continuam disponíveis.
- Oferta explícita de sites e landing pages, contato direto por WhatsApp e galeria dos 20 modelos imediatamente depois da abertura. Os modelos são demonstrações, não clientes ou resultados comerciais comprovados.
- Dia/Noite altera a paleta e os gradientes de leitura, preservando a fotografia. O retrato lateral e os antigos quadros permanecem arquivados, sem uso na abertura atual.
- Portfólio preserva os mockups de desktop/celular e agora mostra capturas atualizadas das demonstrações.
- Chronos: três peças com imagens diferentes, materiais e descrições próprias. Vanguard: três estudos de programa, materialidade e partido distintos. Aura: três etapas de uma jornada de contato, sem diagnóstico, coleta de saúde ou promessa médica.
- Seis novas imagens editoriais, além das três existentes. Nenhuma representa um cliente, produto à venda ou obra executada. Cada demonstração contém três seleções que atualizam imagem, texto e ficha.
- Serviços explicam indicação, entrega e limites. O processo mostra o resultado esperado de cada etapa; FAQ aborda conteúdo, edição, hospedagem, SEO, escopo e natureza dos protótipos.
- Laboratório de scroll, navegação nativa, suporte a teclado, temas e pausa global preservados.

## Arquivos principais

- `app/experience.css`: cena, controle de temas, laboratório e apresentação dos conceitos.
- `components/HeroScene.tsx`: fotografia única, progresso e controle de movimento.
- `app/landing.css`: composição responsiva da abertura e hierarquia de contato.
- `public/images/hero/gabriel-contact.webp`: fotografia usada na abertura.
- `lib/concept-content.ts`: fichas e conteúdo próprio dos nove itens conceituais.
- `components/sections/FAQ.tsx`: dúvidas antes do contato.
- `components/ThemeToggle.tsx`: seleção explícita Dia/Noite.
- `components/ScrollExperience.tsx`: progresso de leitura, capítulos e pausa.
- `components/ExperienceLab.tsx`: transição de wireframe para interface.
- `components/ConceptPhoto.tsx`: imagens dos conceitos nas demonstrações.
- `components/ConceptExplorer.tsx`: exploração interativa de cada conceito.
- `public/images/screens/`: capturas reais das páginas renderizadas, usadas nos mockups.
- `lib/content.ts`: textos, serviços e exatamente três conceitos.
- `lib/site.ts`, `lib/whatsapp.ts`: marca e contato oficial.

## Testes

```sh
npx playwright install chromium
npm run test:e2e
```

Em ambientes com Chromium já instalado, use a variável `PLAYWRIGHT_CHROMIUM_EXECUTABLE` com o caminho local. Não é necessária para instalações comuns do Playwright. Os testes iniciam uma instância temporária de produção na porta 3107, então execute build antes e mantenha essa porta disponível.

A API do assistente antigo permanece desativada por padrão. Não é necessária nenhuma chave para abrir a landing page. Não habilite essa API sem revisar seu comportamento e configuração.

## Instalar a revisão no Antigravity

Para trabalhar continuamente, use [o fluxo compartilhado pelo GitHub](docs/FLUXO-GITHUB.md). Ele preserva as alterações da pasta local e elimina a necessidade de novos ZIPs a cada revisão. A instalação por ZIP continua descrita em `INSTRUCOES-ANTIGRAVITY.md`.

## Galeria de 20 protótipos

Os três conceitos originais continuam em `/conceitos/`. A seção `#modelos` acrescenta 17 páginas completas em `/modelos/[slug]`: advocacia patrimonial, direito do agro, psicologia, odontologia, imóveis, energia solar, dermatologia, medicina, contabilidade, consultoria, seguros, hotelaria, gastronomia, interiores, cibersegurança, educação executiva e logística.

A apresentação usa capturas reais das páginas em janelas verticais roláveis, com filtros de setor e navegação horizontal. Cada modelo tem imagem própria, conteúdo específico, orientação interativa, FAQ e contato contextual com Gabriel. Energia inclui cálculo local de consumo diurno, sem dimensionamento ou promessa de economia. Os modelos usam seis direções visuais compartilhadas; não são 17 sistemas visuais inteiramente independentes.

- `lib/models.ts`: marcas, conteúdo e orientações por nicho.
- `app/modelos/[slug]/page.tsx`: rotas estáticas, com noindex e aviso de ficção.
- `components/sections/NicheGallery.tsx`: filtros e prévias roláveis.
- `components/ModelInteraction.tsx`: escolhas de conteúdo e cálculo local.
- `app/models.css`: estilos isolados da galeria e das seis direções visuais.
- `public/images/models/`: 17 cenas humanas, 17 fotografias de ambientes e capturas da galeria.

Nenhum modelo representa uma empresa contratante, atendimento real, estoque, reserva ou resultado comercial. As chamadas finais são explicitamente para contratar desenvolvimento com Gabriel. Nenhum dado clínico, financeiro ou credencial é coletado. A ampliação da galeria antecedeu a atual revisão da abertura.

### Revisão de presença e identidade

Os 17 modelos agora têm cenas com pessoas fictícias relacionadas à atividade, além das imagens de ambientes. A nova camada de marca em `lib/model-brands.ts` define símbolo, território verbal, princípios, narrativa, assinatura e iconografia de serviços. `components/BrandGlyph.tsx` fornece os desenhos vetoriais. Cada página inclui uma seção editorial de marca e ajustes próprios de paleta e composição via `data-brand`.

As cenas humanas estão em `public/images/models/people/`. As capturas atualizadas ficam em `public/images/models/previews-branded/`; não use as capturas da revisão anterior. Os personagens são gerados e não representam uma equipe ou profissionais contratados. A arquitetura de componentes continua compartilhada; a revisão não significa 17 sistemas de design independentes nem identidades registradas.

## Revisão atual da landing page

Veja [decisões e validação](docs/REVISAO-LANDING.md). Esta revisão substitui as instruções históricas sobre nove quadros da hero. Não há garantia de conversão: o objetivo é apresentar oferta, repertório e caminho de contato com clareza.

## Vitrine de direções de marca

Antes do catálogo, três apresentações em escala maior mostram advocacia patrimonial, psicologia e imóveis. Botões alteram composição, narrativa, imagem e demonstração. O scroll movimenta a janela e revela a interface, com pausa e movimento reduzido. Os 20 modelos continuam disponíveis. Implementação em `components/ProjectSpotlight.tsx` e `app/showcase.css`. Esta revisão incorpora as alterações locais do Antigravity no commit 9388c5a.

Validação: lint, build, tipagem e 37 testes Playwright aprovados; revisão visual em Chromium desktop e celular. Os relatórios gerados pelo Playwright são excluídos do lint, assim como os artefatos de build. Não houve deploy.
