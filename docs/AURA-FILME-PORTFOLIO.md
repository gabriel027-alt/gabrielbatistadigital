> Separação corrigida: a oferta de Gabriel fica fora do filme, no portfólio. O encerramento interno da Aura é exclusivamente da marca; ver [apresentação atual](AURA-APRESENTACAO-CLIENTE.md).

> Atualização: a integração posterior consolidou os filmes completos de Aura e Orla na galeria. Estado atual em [INTEGRACAO-FILMES-PORTFOLIO.md](INTEGRACAO-FILMES-PORTFOLIO.md); referências a filmes anteriores neste documento descrevem a etapa histórica.
# Aura — apresentação em filme no portfólio

Pedido: comparador arrastável da mesma personagem ao final da experiência, seguido de apresentação em MP4 como um dos projetos selecionados. O visitante do portfólio assiste à apresentação, sem um link para navegar pela landing Aura.

Comparador local feito com range nativo e recorte CSS: mouse, toque e teclado. Duas imagens ilustrativas, sempre com identificação de simulação, mesmo enquadramento e explicação de que não se trata de paciente nem previsão clínica. Sem dependências novas. A transformação regional por scroll permanece antes do comparador.

Na homepage, a Aura substitui a prévia antiga da própria Aura, mantendo seis projetos e os outros cinco cartões. Player com controles, playsInline, capa, legendas descritivas em português e preload=none. Sem autoplay ou áudio. O índice do catálogo conduz ao filme, e não ao antigo conceito Aura. As rotas históricas e a rota de revisão continuam existentes: retirar links não implementa restrição de acesso ou senha.

Gravação produzida no navegador da própria implementação, com abertura, quatro focos, retorno ao rosto inteiro e arraste do comparador. O controle de pausa da ferramenta de revisão é ocultado só na gravação. A identificação de simulação permanece visível na experiência e no comparador. O vídeo não representa atendimento ou resultado clínico real.

Fontes: componentes e ativos já documentados em docs/AURA-COMPARACAO-SCROLL.md e public/images/aura-sequence/provenance.json. Nenhum banco de pacientes ou material de terceiros foi utilizado.

Entrega de mídia: public/videos/projects/aura-showcase.mp4, H.264 1440×900, 40,52 s, cerca de 1,5 MB, sem faixa de áudio. Capa WebP de cerca de 75 KB; legendas VTT opcionais. A gravação foi inspecionada na abertura e no comparador em movimento. Não há alegação de resolução 4K.

Validação: lint/build aprovados; 17 cenários distintos aprovados (com repetição do comparador para acrescentar teste de toque). Abrangem comparação por teclado/mouse/toque, reprodução H.264 e metadados no navegador, seis cartões, ausência de link da Aura para landing, preload=none, hero preservada, scroll regional, mobile, pausa, ausência de JS, catálogo com 20 entradas e âncoras/WhatsApp oficiais. Cartão em desktop e celular e comparador final inspecionados em docs/preview/aura-showcase. A gravação não registrou erros de execução. Não houve deploy nem alteração de autenticação.

## Comparador com percurso pelo scroll

A seção fica sticky durante um percurso de 240svh: começa dividida ao meio, recolhe a camada depois até exibir o antes inteiro, mantém um breve intervalo e revela o depois inteiro. O percurso é reversível e suavizado por requestAnimationFrame, sem loop quando a posição já estabilizou. A legenda da parte oculta desaparece nos extremos.

Arraste, toque e teclado interrompem o movimento automático e mantêm a posição escolhida; o automático só retoma ao voltar a rolar. Pausa global e preferência de movimento reduzido desativam o trecho sticky/automático e preservam o controle manual. Layout compacto mantém o comparador dentro da janela. O filme do portfólio é regravado para mostrar a varredura automática e depois o ajuste manual.

Validação do percurso automático: lint/build aprovados e 12 cenários aprovados, incluindo os dois extremos pelo scroll, retorno, controle manual sem reposicionamento enquanto parado, retomada ao rolar, toque/teclado e preferência de movimento reduzido. A medição do teste aguarda a câmera inicial carregar antes de calcular a posição da seção. Capturas scroll-before.png e scroll-after.png inspecionadas. Filme atualizado: 37.00 s, 1.28 MiB, sem erros na gravação.

Revisão comercial: o filme passa a terminar na oferta de site para donos de clínicas, sem agendamento de paciente. O cartão tem CTA externo ao player, com mensagem contextual e contato oficial de Gabriel. Diagnóstico e verificação em AURA-AUDITORIA-CONVERSAO.md.

## Regravação de 11/11/2026, sem avisos

O usuário pediu para tirar todos os avisos dos projetos, inclusive a palavra “simulação” dos rótulos antes/depois da Aura. As descrições acima sobre identificação de simulação são históricas.

- Os filmes da Aura e da Orla foram regravados com `scripts/capture-project-films.mjs`.
- Rótulos agora: “Antes”, “Depois” e “Antes → Depois”.
- O capítulo da legenda passou a se chamar “Antes e depois”, sem o complemento “Imagens geradas, sem resultados clínicos”.
- O rodapé da Orla é “© 2026 Orla Residências. Site por Gabriel Batista Digital”, e o roteiro local não mostra mais “Nada é enviado”.
- O manifesto continua registrando `patientResults: false`, porque nenhuma imagem é de paciente real.
