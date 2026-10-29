# Revisão Atelier

Base: ZIP gabrielbatistadigital-atual.zip enviado pelo usuário. A revisão preserva conteúdo, contato, tema persistente e a fotografia aprovada.

## Corrigido

O ZIP não incluía eslint.config.mjs, playwright.config.ts, next-env.d.ts e .gitignore. Esses arquivos foram restaurados para que os scripts e a entrega sejam executáveis. O README continha apenas o nome da agência e foi refeito. Blocos duplicados de CSS da hero foram substituídos por app/experience.css, importado pelo layout.

A letra A usada como Claude foi substituída pelo SVG da marca. A máscara TypeScript e os demais símbolos foram obtidos da mesma coleção identificada. A posição dos logos é limitada à cena e não depende mais do scroll absoluto da página inteira.

## Validação

Build de produção, lint sem avisos e TypeScript estrito. Dez testes Playwright em Chromium: navegação, acessibilidade WCAG automatizada nos dois temas e demos, breakpoints 360–1920px, contato exclusivo, serviços por teclado, diagnóstico, três conceitos, assets, controle de tema e pausa, posição dos ícones fora da área reservada ao rosto, capítulos de scroll e conteúdo móvel.

Capturas de desktop e celular foram inspecionadas. Isso não representa validação em Safari, Firefox ou no Windows do usuário. Não houve medição Lighthouse nem promessa de nota de desempenho.

## Assets

O SHA-256 do retrato é cc668c5536f5c845dc8ce69deba627bd5fe305ceb0d006cbf96fb9db81f16a74, igual ao arquivo extraído do ZIP. As novas imagens dos conceitos são geradas e não documentam obras ou produtos reais.

O ambiente diurno/noturno usa luz e elementos de cenário por CSS sobre a foto aprovada. O gato é uma silhueta SVG. Não foi criada uma animação 3D do usuário nem sequência de rostos por IA.
