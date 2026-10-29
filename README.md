# Gabriel Batista Digital — Atelier interativo

Next.js App Router, TypeScript estrito e Tailwind CSS 4. Contato comercial exclusivo: https://wa.me/5538998267717.

![Hero noturna](docs/preview/home-dark.webp)

[Versão diurna](docs/preview/home-light.webp) · [Celular](docs/preview/mobile.webp) · [Portfólio](docs/preview/portfolio.webp)

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

## Direção visual

- Retrato aprovado em `public/images/hero/gabriel.png`. O arquivo foi mantido intacto, sem geração de rosto, cabelo ou corpo. A composição usa enquadramento e gradação de luz por CSS.
- Controle Dia/Noite centralizado, persistente e acessível por teclado. A janela muda entre sol e estrelas; a luminária ilustrada acende/apaga. O cenário usa a mesma foto aprovada, com camadas CSS, não dois ensaios fotográficos diferentes.
- Símbolos separados de React, Next.js, TypeScript, GitHub, Claude e OpenAI, obtidos de Simple Icons v14. Não são placas nem cartões. Não indicam parceria com essas empresas. Fontes em `public/images/brands/README.md`.
- Ícones com flutuação e deslocamento limitado ao scroll da hero; posições reservadas fora do rosto. A disposição móvel é própria.
- Gato em silhueta SVG atravessa ocasionalmente a cena. É um detalhe gráfico 2D, não um personagem 3D.
- Laboratório de scroll com etapa fixada no desktop: wireframe → código → interface. No celular e com movimento reduzido, mostra o resultado sem trecho fixado longo. A rolagem continua nativa, sem scroll hijacking.
- Manifesto com movimento discreto, seleção de serviços com transição e processo com marcadores progressivos.
- Três imagens editoriais novas: Chronos, Vanguard e Aura. São imagens geradas para marcas fictícias e não representam clientes, produtos ou resultados reais. As demonstrações usam recortes da mesma imagem editorial de cada conceito.
- Botão Pausar animações e suporte a prefers-reduced-motion. Animações da hero pausam quando a cena sai da tela.

## Arquivos principais

- `app/experience.css`: cena, controle de temas, laboratório e apresentação dos conceitos.
- `components/HeroScene.tsx`: retrato, elementos de cenário e ícones.
- `components/ThemeToggle.tsx`: seleção explícita Dia/Noite.
- `components/ScrollExperience.tsx`: progresso de leitura, capítulos e pausa.
- `components/ExperienceLab.tsx`: transição de wireframe para interface.
- `components/ConceptPhoto.tsx`: imagens dos conceitos nas demonstrações.
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

Veja `INSTRUCOES-ANTIGRAVITY.md`. Prefira abrir o ZIP completo em uma pasta nova: aplicar apenas Hero.tsx deixa os componentes e estilos inconsistentes.
