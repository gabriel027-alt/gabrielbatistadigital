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
];
