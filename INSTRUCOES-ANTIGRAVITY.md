# Abrir a revisão atual

1. Extraia o ZIP em uma pasta nova. Localize a pasta interna que contém package.json, app/, components/ e public/ e use essa pasta como raiz de execução.
2. Leia AGENTS.md, README.md e docs/REVISAO-LANDING.md. Preserve as versões locais anteriores.
3. Verifique Node.js 22+, execute npm ci, npm run lint, npm run build e npm run typecheck. Corrija falhas reais sem enfraquecer verificações.
4. Identifique os processos e diretórios dos servidores existentes. Inicie uma única sessão persistente numa porta disponível; não encerre outros projetos. Informe a URL efetiva confirmada por HTTP.
5. Confira no navegador desktop e celular: Dia/Noite, fotografia única, oferta e WhatsApp, pausa, galeria, filtros, prévias roláveis, rotas dos modelos, laboratório e três conceitos. HTTP 200 não comprova aparência. Se o navegador falhar, informe exatamente o que não foi validado.

## Página principal atual

Leia docs/REVISAO-SIGNATURE.md. Confirme components/SignatureHome.tsx, components/SelectedWork.tsx, app/signature.css e public/images/hero/gabriel-contact.webp. O identificador da abertura é .signature-hero. Não reintroduza os componentes antigos Hero, ProjectSpotlight ou NicheGallery na página principal.

A fotografia é preservada, sem geração de novas poses. A seleção tem seis projetos; o catálogo expansível dá acesso aos 20. Confira navegação, filtros, teclado, temas, pausa e movimento reduzido. Não substituir estudos autorais por alegações de clientes contratantes.

## Galeria de 20 protótipos

Preserve os três conceitos em /conceitos/ e os 17 modelos em /modelos/. Inclua app/models.css, lib/models.ts, lib/model-brands.ts, components/BrandGlyph.tsx, components/ModelInteraction.tsx e public/images/models/, incluindo people/ e previews-branded/.

Valide filtros, navegação por teclado, conteúdo interativo, cálculo local de energia, FAQ e viewport de 360px. Não apresente marcas ou pessoas geradas como clientes reais. As chamadas comerciais são para contratar desenvolvimento com Gabriel.

Não crie temp_repo, não inclua .env ou credenciais e não faça push, merge ou deploy sem autorização do usuário.
