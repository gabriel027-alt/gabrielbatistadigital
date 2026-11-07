# Orla: primeira unidade de apresentação

## Brief reutilizado e decisões autorais

Autorização: o usuário aprovou começar pela Orla após a Aura. Referências fornecidas: cartões de trabalhos do Jorge Web Pro e faixas de páginas da EvoPixel (capturas). As capturas mostram variedade de identidades e apresentação dos sites; não comprovam suas animações ou conversão.

Marca existente: Orla, residências de alto padrão. Materiais existentes inspecionados: `public/images/models/imoveis.webp` (casa costeira ao entardecer) e `public/images/models/people/imoveis.webp` (visita com vista para o mar). São imagens geradas do acervo; não imóveis anunciados, nem evidência de ambientes de uma mesma propriedade. Não há estoque, metragem, localização, preço, registro profissional ou canal operacional verificado.

Escopo: unidade representativa em `/propostas/orla`: abertura, percurso fotográfico por scroll e encerramento editorial. Preservar `/modelos/imoveis`, os 20 itens e os seis destaques até revisão desta direção. Não gerar um catálogo imobiliário inteiro nem alterar Aura.

## Composição

Gramática: galeria fotográfica. A navegação permite chegar ao percurso e ao olhar da marca. Não repetir a câmera de rosto da Aura. O gesto principal é percorrer horizontalmente duas fotografias amplas, usando o scroll vertical; retratos e recortes não se passam por modelos 3D.

Paleta: oceano #16333d, névoa #e5eeee, branco #f8faf8, cinza azulado #b9cdd0, azul profundo #0e242c. Vem do mar e do céu do acervo, sem recorrer ao dourado genérico de luxo. Tipografia: Manrope local em títulos e texto; marca ampliada com espaçamento próprio. Fotografia ocupa o primeiro plano; tipografia e ação têm fundo local para leitura.

Percurso emocional proposto: horizonte amplo (desejo), espaço/arquitetura (observação), pessoas e convívio (identificação), encerramento (clareza). Pico: passagem lateral da residência ao entardecer para a cena de visita diurna. Não afirmar mudança de horário de uma mesma casa. Sem compra ou agendamento fictícios; ações desta unidade exploram o próprio conteúdo.

Camadas: foto plana com enquadramento próprio, tipografia HTML e navegação em planos independentes. Não extrair pessoas com máscaras falsas nem anunciar profundidade 3D. Na abertura a foto e o título têm velocidades distintas; na galeria o deslocamento lateral revela a próxima fotografia.

## Fontes e escolha técnica

Consultados frontend-design, webapp-testing e ScrollCraft (SKILL.md, hero-depth, uniqueness, approved-collection, taste e verify), com fontes/commits em `.agents/skills/SOURCES.md` e `docs/research/video-repositories-lock.json`. Documentação Next instalada: convenção page e CSS. GSAP já instalado, referência local consultada. As regras estéticas externas são heurísticas; não obrigam mudar o brief ou instalar o motor ScrollCraft.

Escolha: Next Server Component para conteúdo e pequeno controlador cliente com GSAP/ScrollTrigger existentes. Sem novo motor, API paga ou modelo de imagem. Sem mudança no carregamento da homepage. CSS Module limita o alcance da composição.

## Critérios de aceite desta unidade

- Fotos carregadas, título/ação legíveis na abertura e nos estados intermediários.
- Percurso avança e reverte sem travar o scroll; atalhos permitem ver as duas cenas.
- Teclado, toque, pausa e movimento reduzido. Sem JS, texto e imagens completos em fluxo vertical.
- Composição própria em 390px, sem overflow horizontal da página; galeria contém seu deslocamento.
- Sem dados imobiliários inventados, CTA falso de corretora ou oferta da agência dentro da marca.
- Capturas de abertura/meio/final e gravação de movimento; testes técnicos não equivalem a aprovação estética.

## Verificação da primeira versão

- `npm run build`, `npm run lint` e `npm run typecheck`: aprovados.
- `tests/e2e/orla-proposal.spec.ts`: quatro testes aprovados em Chromium local. Cobrem deslocamento e retorno, atalhos, pausa/retomada, mudança dinâmica de movimento reduzido, 360/390/768/1440px, navegação, auditoria axe e conteúdo sem JavaScript. Ausência de violações axe não certifica acessibilidade integral.
- Capturas em `docs/preview/orla/`: abertura, entrada, meio, saída, fechamento e página com movimento reduzido, desktop e móvel. Inspeção visual corrigiu recorte de pessoas no móvel, resolução da imagem escolhida por Next/Image, ícone sem glifo disponível e proximidade entre ação principal e controle de pausa.
- Prévia `desktop.mp4`: gravação da página renderizada via CDP do Chromium e FFmpeg do sistema, com avanço e retorno. O download do FFmpeg próprio do Playwright recebeu 403 da política de domínio; não foi necessário alterar rede ou instalar pacotes. O script usa os executáveis locais existentes. Para repetir: iniciar produção em uma porta livre e executar `ORLA_PREVIEW_URL=http://127.0.0.1:PORTA node scripts/capture-orla.mjs`.
- Não foram observados dispositivos físicos, Safari/iOS, tráfego ou conversões. A primeira versão aguarda avaliação estética do usuário antes de substituir o modelo atual ou ser apresentada como filme final no portfólio.
- ESLint agora exclui `.agents/skills/**`, fontes upstream de referência. A verificação da aplicação e dos scripts próprios permanece ativa. Nenhum arquivo do motor externo foi alterado ou importado para a aplicação.

Na captura automática, cada avanço usa `behavior: instant` porque o interpolador do roteiro já calcula posições intermediárias. Isso evita que o `scroll-behavior: smooth` global retarde cada quadro novamente. A navegação interativa da aplicação mantém seu comportamento próprio.

## Reprodução da prévia no navegador

O usuário aprovou a abertura, mas relatou que o visualizador de arquivos do chat não carregou o MP4. Não foi possível atribuir a falha a um codec específico do visualizador. Foi preservada a gravação original e adicionada a versão `public/videos/projects/orla-preview.mp4`: H.264 Constrained Baseline, 960×600, YUV420p com faixa limitada, faststart, 19,33s e aproximadamente 1,6 MB.

A rota `/propostas/orla/previa` apresenta player nativo sem autoplay, legendas descritivas, poster e link de download. Não foi adicionada ao portfólio nem à apresentação da marca. A rota é noindex. O script de captura também passa a atualizar essa versão compatível. Sincronizar e reiniciar o projeto no Antigravity para acessar a nova rota na porta local confirmada.

Validação: build e lint aprovados; teste de navegador específico verifica carregamento dos metadados, reprodução com avanço do tempo, busca para 10 segundos e dimensão decodificada. Essa evidência cobre Chromium local, não certifica a prévia do chat ou todos os navegadores.
