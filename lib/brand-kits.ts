/**
 * Brand kits of the portfolio's brand projects (docs/DESIGN-SYSTEM.md, layer 2).
 * Every brand fills the same fields; tests/e2e/brand-kits.spec.ts enforces that no two brands share
 * a display typeface, a palette, a signature graphic or a signature motion.
 */
export type BrandKit = {
  id: string;
  route: string;
  niche: string;
  concept: string;
  mark: string;
  palette: Record<string, string>;
  material: string;
  typography: { display: string; text: string };
  photo: string;
  signatureGraphic: string;
  signatureMotion: string;
  hero: string;
  status: "aprovado" | "em construção" | "proposto";
};

export const brandKits: BrandKit[] = [
  { id: "paddock", route: "/modelos/automoveis", niche: "Automóveis", concept: "Você vê o laudo antes de ver o preço.", mark: "Duas linhas de pista formando um P",
    palette: { pneu: "#010101", epoxi: "#e9eef0", menta: "#8bf2dc", aco: "#b8bcbf", softbox: "#eceeed" },
    material: "Instrumentos de inspeção, registros do laudo e linhas do tablet de diagnóstico", typography: { display: "Unbounded", text: "Sora" },
    photo: "Macros de pintura, pneu, suspensão e scanner iluminados durante a inspeção de carros sem logotipo",
    signatureGraphic: "Linha de leitura com marcações de pintura, quilometragem, revisões e histórico", signatureMotion: "A dúvida no escuro dá lugar ao laudo: a leitura deixa verificações no carro e se desfaz no retorno",
    hero: "Todo seminovo parece perfeito no escuro. Nós acendemos a luz.", status: "aprovado" },
  {
    id: "arrimo", route: "/modelos/previdenciario", niche: "Advocacia previdenciária",
    concept: "Cada ano trabalhado conta.", mark: "Duas vigas se apoiam e uma travessa forma o A da Arrimo",
    palette: { preto: "#080808", carvao: "#1f1f1f", papel: "#efefef", ouro: "#b49a62", carimbo: "#943c35" },
    material: "Papel de registros de trabalho, tinta de carimbo e fotografia documental em preto e branco",
    typography: { display: "Barlow Condensed", text: "Barlow" },
    photo: "Retrato frontal de autoridade com luz dura; mãos calejadas com documentos, preto e branco de fotojornalismo",
    signatureGraphic: "Régua dos períodos de trabalho, com lacunas e carimbo de análise",
    signatureMotion: "O tempo se soma: vínculos entram, lacunas recebem ligações em ouro e NEGADO vira EM ANÁLISE",
    hero: "Retrato preto e branco à direita, título condensado de autoridade sobre o carvão à esquerda", status: "aprovado",
  },
  {
    id: "vanguard", route: "/propostas/vanguard", niche: "Arquitetura",
    concept: "A rolagem é o lápis.", mark: "Logotipo em caixa baixa com complemento",
    palette: { papel: "#dddbd5", tinta: "#1d1c1a", linha: "#2a2926", cinza: "#57554f", luz: "#f4f1ea" },
    material: "Papel mineral", typography: { display: "Manrope", text: "Manrope" },
    photo: "Arquitetura, terreno e maquete no mesmo enquadramento",
    signatureGraphic: "Linhas medidas sobre a fotografia",
    signatureMotion: "Desenho técnico que vira fotografia; terreno, traço, maquete e casa",
    hero: "Folha em branco que recebe o desenho", status: "em construção",
  },
  {
    // Seventh static brand (docs/PROJETOS-ESTATICOS.md, 24/11/2026): bespoke jeweller; palette measured on the photos.
    id: "lavra", route: "/modelos/joalheria", niche: "Joalheria sob medida",
    concept: "Toda joia começa por uma história.", mark: "Um aro visto de lado: elipse fina com um pequeno corte de buril",
    palette: { ebano: "#120c08", ouro: "#d29b4f", papel: "#ece2d3", cera: "#466534", bancada: "#5e3418" },
    material: "Ouro bruto, cera verde de escultura, papel de desenho e ferramentas gastas sob a lâmpada de bancada",
    typography: { display: "Prata", text: "Mulish" },
    photo: "Macro de mãos e metal sob uma única lâmpada de bancada, quente e pontual, com tudo o mais no escuro",
    signatureGraphic: "O aro: a elipse do símbolo abre as seções e o corte de buril marca a etapa",
    signatureMotion: "Estático: do desenho à peça, em quatro etapas lado a lado",
    hero: "As mãos do ourives com o anel sob a lâmpada nos dois terços da direita, com o título no escuro à esquerda", status: "em construção",
  },
  {
    // Sixth static brand (docs/PROJETOS-ESTATICOS.md, 24/11/2026): architecture and interiors; palette measured on the photos.
    id: "vao", route: "/modelos/arquitetura", niche: "Arquitetura e interiores",
    concept: "A casa começa pela rotina.", mark: "Duas linhas verticais e uma verga: um vão de porta visto de frente",
    palette: { travertino: "#c69f77", cal: "#f5efe6", freijo: "#723806", mostarda: "#9d6420", tinta: "#342312" },
    material: "Amostras de travertino, freijó, linho cru e cal sob a luz baixa do fim da tarde",
    typography: { display: "Gilda Display", text: "Hanken Grotesk" },
    photo: "Interiores em perspectiva central, verticais retas e sol baixo do fim da tarde riscando piso e paredes",
    signatureGraphic: "As amostras: quadrados de material marcam as seções, como uma prancha de materiais",
    signatureMotion: "Estático: a planta da rotina, com um momento do dia em cada ambiente",
    hero: "A sala em perspectiva central na luz da tarde à direita, com o título na coluna de cal à esquerda", status: "aprovado",
  },
  {
    // Fifth static brand (docs/PROJETOS-ESTATICOS.md, 24/11/2026): orthopedics; palette measured on the user's five photos.
    id: "eixo", route: "/modelos/ortopedia", niche: "Ortopedia",
    concept: "Subir a escada sem pensar nela.", mark: "Linha vertical com três pontos (quadril, joelho e tornozelo), fora do prumo no joelho",
    palette: { concreto: "#c8c7c5", cal: "#f2f1ee", grafite: "#2d303f", cimento: "#5f574d", cobalto: "#0f3bb6" },
    material: "Concreto aparente, sombra dura de meio-dia e linhas de arquitetura",
    typography: { display: "Archivo", text: "Instrument Sans" },
    photo: "Movimento de todo dia ao sol duro de meio-dia, de teleobjetiva: a escadaria, o tênis no degrau, a horta, a quadra de areia",
    signatureGraphic: "O eixo: a linha com três pontos separa as seções e acende a região de cada assunto",
    signatureMotion: "Estático de verdade: a escada do tratamento, em degraus do mais simples ao mais complexo",
    hero: "A mulher subindo a escadaria de concreto no terço direito, com o título sobre o concreto liso à esquerda", status: "aprovado",
  },
  {
    // Fourth static brand (docs/PROJETOS-ESTATICOS.md, 23/11/2026): reproductive medicine, the strictest in content.
    id: "elo", route: "/modelos/fertilidade", niche: "Medicina reprodutiva",
    concept: "Um passo de cada vez.", mark: "Dois anéis finos que se cruzam",
    palette: { areia: "#e4cfbc", folha: "#808a45", musgo: "#575f26", madeira: "#8b6644", terra: "#362815" },
    material: "Papel de caderno e luz de manhã filtrada por folhas, em filme analógico pastel",
    typography: { display: "Newsreader", text: "Nunito Sans" },
    photo: "Figuras pequenas na paisagem em filme analógico pastel: o casal na trilha, as mãos na mesa, o banco da praça; nunca bebê",
    signatureGraphic: "O elo: os dois anéis do símbolo marcam as paradas do caminho e abrem as seções",
    signatureMotion: "Estático: o caminho de cinco paradas, que se acendem ao toque",
    hero: "O casal pequeno na trilha arborizada, com o título num painel de papel sobre a folhagem desfocada", status: "aprovado",
  },
  {
    // Third static brand (docs/PROJETOS-ESTATICOS.md, 23/11/2026): hair transplant, cold backlight, men of 28 to 50.
    id: "fio", route: "/modelos/capilar", niche: "Transplante capilar",
    concept: "Tirar o boné.", mark: "Uma linha única que desenha a curva da linha frontal do cabelo",
    palette: { ceu: "#e0e3e9", aco: "#687887", ardosia: "#34393e", grafite: "#1f1e1f", pele: "#897268" },
    material: "Contraluz frio de céu nublado, o halo que desenha o contorno dos fios",
    typography: { display: "Space Grotesk", text: "IBM Plex Sans" },
    photo: "Contraluz frio de céu nublado; o homem de perfil e de costas: o boné, o vento no carro, o espelho; macro dos fios",
    signatureGraphic: "A linha frontal: a curva do símbolo sob os títulos",
    signatureMotion: "Estático: o mapa da cabeça vista de cima, com as áreas que acendem ao toque",
    hero: "Homem de perfil contra o céu nublado, segurando o boné, com o título no céu à esquerda", status: "aprovado",
  },
  {
    // Second static brand (docs/PROJETOS-ESTATICOS.md, 23/11/2026): refractive surgery, first-person high-key photography.
    id: "nitida", route: "/modelos/oftalmologia", niche: "Cirurgia refrativa",
    concept: "Acordar e já ver.", mark: "Dois círculos como uma íris, o de dentro levemente fora do centro",
    palette: { branco: "#f0f0f1", nevoa: "#dde2e6", tinta: "#24201f", iris: "#8e512c", agua: "#108693" },
    material: "Vidro e lente, com o reflexo circular de luz no lugar de degradê",
    typography: { display: "Red Hat Display", text: "Red Hat Text" },
    photo: "Ponto de vista de quem acorda, em luz branca muito clara; macro da íris; mergulho de olhos abertos; óculos na gaveta",
    signatureGraphic: "A tabela de leitura: títulos em maiúsculas cujas linhas diminuem como as de um exame de vista",
    signatureMotion: "Estático: o foco ao toque, fotos que saem do desfoque ao tocar ou passar o mouse",
    hero: "O quarto ao amanhecer visto da cama, com o despertador e o óculos, e o título na parede branca", status: "aprovado",
  },
  {
    // First static brand (docs/PROJETOS-ESTATICOS.md, 23/11/2026): the signature is a composition, not a scroll scene.
    id: "cerne", route: "/modelos/implantes", niche: "Implantes e reabilitação oral",
    concept: "Voltar à mesa.", mark: "Círculo cheio com uma mordida que o transforma num C",
    palette: { tinta: "#452a1b", maca: "#b53621", folha: "#778615", linho: "#c8b39f", farinha: "#e3c8af" },
    material: "Linho de mesa, miolo de pão e a casca vermelha da maçã, sob flash direto",
    typography: { display: "Schibsted Grotesk", text: "Literata" },
    photo: "Almoço de família com flash direto, como editorial de gastronomia: mesa vista de cima, mordida na maçã, risada à mesa",
    signatureGraphic: "A mordida: três marcas de dente em arco recortadas do canto das fotos e dos cartões",
    signatureMotion: "Estático: o cardápio de tratamentos com o que cada um devolve, e sinais que se acendem ao toque",
    hero: "Cartão arredondado com a mesa vista de cima, título sobre o linho e a mordida no canto", status: "aprovado",
  },
  {
    id: "forma", route: "/modelos/odontologia", niche: "Odontologia estética e implantes",
    concept: "O sorriso é uma proporção.", mark: "Incisivo em linha única que forma um F",
    // Harmonised on 2026-11-11: palette and material come from the clinic photos (the user found ice blue clashed with them).
    palette: { porcelana: "#faf7f5", linho: "#f1e9e5", tinta: "#2a1a1c", vinho: "#6b1d2a", vinhoEscuro: "#4c1420" },
    material: "Cerâmica quente sobre travertino", typography: { display: "Lora", text: "Manrope" },
    photo: "Consultório quente em travertino e nogueira, foto larga e retrato vertical",
    signatureGraphic: "Grade de proporção com marcas de medida",
    signatureMotion: "A rolagem planeja o sorriso: grade, contornos em proporção áurea, cerâmica",
    hero: "Foto larga do consultório com o texto sobre a parede de pedra", status: "aprovado",
  },
  {
    id: "almeida", route: "/modelos/patrimonio", niche: "Advocacia de família e sucessões",
    concept: "O patrimônio passa de mãos.", mark: "Lacre de cera com A&V em relevo",
    // 2026-11-11: palette taken from the current office photos (user chose to keep them), not from the paper/bottle-green proposal.
    palette: { noite: "#151a22", nogueira: "#4b3221", conhaque: "#8a4f2e", latao: "#c49a6c", marfim: "#f5ecdf" },
    material: "Nogueira e latão escovado", typography: { display: "Cormorant Garamond", text: "Source Sans 3" },
    photo: "Escritório em azul-noite, nogueira, couro e luminária de latão",
    signatureGraphic: "Linha de latão com nós, como árvore genealógica",
    signatureMotion: "A partilha se desenha: do patrimônio, uma linha que se divide até os herdeiros",
    hero: "Escritório noturno com o título sublinhado por uma linha de latão e o lacre", status: "aprovado",
  },
  {
    id: "brisa", route: "/modelos/hotelaria", niche: "Hotel boutique",
    concept: "A chegada já é parte da estadia.", mark: "Sol nascendo sobre a linha do horizonte, dentro de um arco",
    // Palette measured on the tour video (k-means over every 12th frame): lime wash, sand, roof tile, olive garden, walnut.
    palette: { cal: "#f6efe2", areia: "#e7d7bf", telha: "#9a4c2b", oliva: "#55552f", nogueira: "#33261a" },
    material: "Cal, telha de barro e madeira de nogueira", typography: { display: "Marcellus", text: "Karla" },
    photo: "Tour contínuo em vídeo, do alto da baía à suíte e à piscina",
    signatureGraphic: "Trajeto do sol sobre a linha do horizonte, marcando os capítulos",
    signatureMotion: "Tour contínuo quadro a quadro: da baía à porta, à recepção, à suíte e à piscina",
    hero: "Vista aérea da baía em tela cheia, com o nome sobre o céu", status: "aprovado",
  },
  {
    id: "sutil", route: "/modelos/cirurgia-plastica", niche: "Cirurgia plástica",
    concept: "A decisão mais importante vem antes da cirurgia.", mark: "Um S desenhado por uma linha contínua de sutura",
    // Palette measured on the user's photos: plaster wall, travertine, curtain sage, blouse sage, graphite trousers.
    palette: { gesso: "#efebe6", travertino: "#c8bfb5", salvia: "#9ba191", salviaProfunda: "#4a5044", grafite: "#2a2a27" },
    material: "Gesso, travertino e linho sálvia", typography: { display: "Bodoni Moda", text: "Figtree" },
    photo: "Consultório de gesso e travertino com luz lateral, cirurgiã em sálvia e branco",
    signatureGraphic: "Régua de dias da recuperação, com marcos",
    signatureMotion: "A recuperação dia a dia: a régua avança, o contador de dias sobe e a luz da janela atravessa a sala",
    hero: "Consulta em tela cheia, cirurgiã à direita e título sobre a parede de gesso", status: "aprovado",
  },
  {
    id: "toca", route: "/modelos/veterinaria", niche: "Hospital veterinário",
    concept: "O cuidado começa na altura deles.", mark: "A entrada de uma toca com duas orelhas que formam um T",
    // Palette measured on the user's photos: glazed tile (deepened for text), mustard blanket, oak, wall, graphite trousers.
    palette: { azulejo: "#4a787c", petroleo: "#24474b", mostarda: "#b8894f", carvalho: "#bba085", parede: "#ece9e4" },
    material: "Azulejo esmaltado, carvalho e feltro mostarda", typography: { display: "Fraunces", text: "DM Sans" },
    photo: "Câmera na altura do animal, azulejo petróleo e madeira clara",
    signatureGraphic: "Placas de sinalização hospitalar numeradas, em mostarda",
    signatureMotion: "Chave Cão / Gato que muda a página e portas do hospital que se abrem sala a sala com a rolagem",
    hero: "Veterinária ajoelhada com o cão (ou sentada com o gato), título sobre a parede clara e a chave Cão / Gato", status: "aprovado",
  },
  {
    id: "lume", route: "/modelos/psicologia", niche: "Psicologia",
    concept: "O peso sai dos ombros.", mark: "Uma janela num traço só, que se abre e deixa entrar a luz",
    // Measured on the user's photos (19/11/2026): kitchen at night, the same kitchen in the morning, clay studio portrait.
    palette: { noite: "#1f1914", manha: "#eceeed", argila: "#b26a58", argilaEscura: "#8f4c3d", cacau: "#3d1d13" },
    material: "Grão de filme sobre luz de tungstênio e luz fria da manhã", typography: { display: "Young Serif", text: "Public Sans" },
    photo: "Documental em câmera fixa: a mesma cozinha às 23h e às 7h; retrato de estúdio sobre fundo argila",
    signatureGraphic: "O cone de luz do pendente, que apaga quando a manhã chega",
    signatureMotion: "As cobranças se soltam: frases de cobrança caem com a rolagem enquanto a noite vira manhã",
    hero: "Título de dor coberto por frases de cobrança ao lado da cozinha às 23h, que vira 7h", status: "aprovado",
  },
  {
    id: "talhao", route: "/modelos/agro", niche: "Advocacia do agro",
    concept: "Safra frustrada não precisa virar terra perdida.", mark: "Um quadrado de lavoura cujas fileiras formam um T",
    // Measured on the user's photos (20/11/2026): soy, red soil, straw, sky, porch wood.
    palette: { soja: "#295419", terraRoxa: "#a54c33", palha: "#dbb38c", ceu: "#6cacec", tronco: "#2a1a10" },
    material: "Terra roxa e palha sob sol do meio-dia", typography: { display: "Zilla Slab", text: "Work Sans" },
    photo: "Aérea zenital da fazenda e retratos ambientais ao meio-dia, céu limpo, sem dourado",
    signatureGraphic: "Contornos de talhão como mapa de GPS de colheita, com a legenda do mapa",
    signatureMotion: "Os talhões se acendem: a câmera passa de talhão em talhão sobre a foto aérea e cada um acende com uma situação",
    hero: "Foto aérea da fazenda em tela cheia com a legenda do mapa carregando o título", status: "aprovado",
  },
];
