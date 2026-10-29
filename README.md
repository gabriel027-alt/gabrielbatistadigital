# Gabriel Batista Digital — Studio / direção cinematográfica

Next.js App Router, TypeScript estrito e Tailwind CSS 4. Contato comercial exclusivo: https://wa.me/5538998267717.

![Hero noturna](docs/preview/home-dark.webp)

[Ver transição no scroll](docs/preview/hero-scroll.gif) · [Versão diurna](docs/preview/home-light.webp) · [Celular](docs/preview/mobile.webp) · [Portfólio](docs/preview/portfolio.webp)

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

- Hero com abertura frontal aprovada provisoriamente e enquadramento lateral aprovado. O arquivo lateral `public/images/hero/gabriel.png` foi preservado; o frontal foi exportado em WebP de uma imagem gerada e aprovada na conversa.
- A passagem acompanha um trecho curto de scroll nativo com fixação da cena. É uma transição editorial entre duas imagens, não uma rotação 3D ou vídeo do usuário. Não há frames intermediários nem alegação de continuidade anatômica.
- Temas Dia/Noite alteram paleta, gradação e composição de luz. A luminária gráfica, a janela e o gato da revisão anterior foram removidos. A luminária existente dentro da fotografia não é um objeto animável independente.
- Logos oficiais em uma faixa própria, sem cartões e fora do rosto. Fontes em `public/images/brands/README.md`.
- Portfólio com capturas reais das páginas conceituais renderizadas em desktop e celular. As capturas percorrem a página no hover/foco; abrir a demonstração leva ao site navegável.
- Três conceitos fictícios, cada um com direção visual, navegação, imagens e um painel explorável por abas/teclado. Chronos explora detalhes da peça, Vanguard apresenta luz/matéria/paisagem e Aura apresenta princípios de cuidado. Nenhum deles representa uma loja ou clínica real.
- Laboratório de scroll: wireframe → código → interface. Em celular e movimento reduzido, apresenta o resultado sem fixação longa.
- Pausa global respeitada pela hero e pelo carrossel; suporte a prefers-reduced-motion. Sem scripts de terceiros para controlar a rolagem.

## Arquivos principais

- `app/experience.css`: cena, controle de temas, laboratório e apresentação dos conceitos.
- `components/HeroScene.tsx`: retrato, elementos de cenário e ícones.
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

Veja `INSTRUCOES-ANTIGRAVITY.md`. Prefira abrir o ZIP completo em uma pasta nova: aplicar apenas Hero.tsx deixa os componentes e estilos inconsistentes.
