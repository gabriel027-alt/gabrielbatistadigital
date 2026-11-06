# Aura — apresentação em filme no portfólio

Pedido: comparador arrastável da mesma personagem ao final da experiência, seguido de apresentação em MP4 como um dos projetos selecionados. O visitante do portfólio assiste à apresentação, sem um link para navegar pela landing Aura.

Comparador local feito com range nativo e recorte CSS: mouse, toque e teclado. Duas imagens ilustrativas, sempre com identificação de simulação, mesmo enquadramento e explicação de que não se trata de paciente nem previsão clínica. Sem dependências novas. A transformação regional por scroll permanece antes do comparador.

Na homepage, a Aura substitui a prévia antiga da própria Aura, mantendo seis projetos e os outros cinco cartões. Player com controles, playsInline, capa, legendas descritivas em português e preload=none. Sem autoplay ou áudio. O índice do catálogo conduz ao filme, e não ao antigo conceito Aura. As rotas históricas e a rota de revisão continuam existentes: retirar links não implementa restrição de acesso ou senha.

Gravação produzida no navegador da própria implementação, com abertura, quatro focos, retorno ao rosto inteiro e arraste do comparador. O controle de pausa da ferramenta de revisão é ocultado só na gravação. A identificação de simulação permanece visível na experiência e no comparador. O vídeo não representa atendimento ou resultado clínico real.

Fontes: componentes e ativos já documentados em docs/AURA-COMPARACAO-SCROLL.md e public/images/aura-sequence/provenance.json. Nenhum banco de pacientes ou material de terceiros foi utilizado.

Entrega de mídia: public/videos/projects/aura-showcase.mp4, H.264 1440×900, 33,96 s, cerca de 1,3 MB, sem faixa de áudio. Capa WebP de cerca de 75 KB; legendas VTT opcionais. A gravação foi inspecionada na abertura e no comparador em movimento. Não há alegação de resolução 4K.

Validação: lint/build aprovados; 17 cenários distintos aprovados (com repetição do comparador para acrescentar teste de toque). Abrangem comparação por teclado/mouse/toque, reprodução H.264 e metadados no navegador, seis cartões, ausência de link da Aura para landing, preload=none, hero preservada, scroll regional, mobile, pausa, ausência de JS, catálogo com 20 entradas e âncoras/WhatsApp oficiais. Cartão em desktop e celular e comparador final inspecionados em docs/preview/aura-showcase. A gravação não registrou erros de execução. Não houve deploy nem alteração de autenticação.
