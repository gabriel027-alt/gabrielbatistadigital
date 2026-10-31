# Abrir a revisão Atelier

1. Extraia o ZIP em uma pasta nova e abra como raiz do projeto a pasta que contém este arquivo, app/, components/, public/ e package.json.
2. Leia README.md e AGENTS.md. Preserve projetos e arquivos locais anteriores.
3. Instale com npm ci. Execute npm run lint, npm run build e npm run typecheck.
4. Inicie uma única sessão persistente de desenvolvimento. Se já existir servidor de outra versão, identifique pasta e processo antes de alterar qualquer coisa; não encerre outros projetos.
5. Valide por HTTP a porta realmente em uso. No navegador confira Dia/Noite, a abertura frontal e a passagem lateral, logos sem cartões, pausa, laboratório de scroll, mockups e abas dos três conceitos no desktop e no celular.
6. A presença de texto no HTML ou HTTP 200 não comprova a composição visual. Informe limitações reais de navegador sem afirmar validação que não ocorreu.

Não copie apenas a hero: `app/experience.css`, seus imports no layout, os componentes novos e todos os assets são partes da mesma entrega. Não crie temp_repo dentro do projeto. Não inclua arquivos .env nem credenciais. Não faça push, merge ou deploy sem solicitação do usuário.

Identificadores desta revisão: `.cinematic-hero`, `.cinema-front`, `.cinema-sequence`, `.case-browser` e `components/ConceptExplorer.tsx`. Não use gato ou luminária em CSS, removidos por decisão do usuário.

Revisão de sequência: HeroScene.tsx usa um único canvas `.cinema-sequence`, com nove quadros em `public/images/hero/frames/`. Não reintroduza `.cinema-side` nem opacidade misturando rostos. Inclua `lib/concept-content.ts`, FAQ e todas as imagens novas ao integrar.

## Ampliação da galeria

Esta revisão contém 20 protótipos: três conceitos existentes e 17 modelos novos. Confirme `app/models.css`, `lib/models.ts`, `components/sections/NicheGallery.tsx`, `components/ModelInteraction.tsx`, `app/modelos/[slug]/page.tsx` e a pasta inteira `public/images/models/`, incluindo `previews/`. Não substitua imagens da hero por imagens dos modelos.

Valide os filtros em #modelos, rolagem interna das capturas, abertura das 17 rotas, escolhas de conteúdo, cálculo de consumo, FAQ, teclado e viewport de 360px. Não apresente as marcas fictícias como clientes reais. O único contato é o desenvolvedor Gabriel, em 5538998267717.
