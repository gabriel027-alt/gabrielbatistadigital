import { auraFilmContact } from "@/lib/aura-contact";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const projectFilms = {
  aura: {
    id: "aura", name: "Aura", sector: "HARMONIZAÇÃO FACIAL", slug: "aura-aesthetics",
    description: "Expressão, movimento e um caminho para a avaliação.",
    source: "/videos/projects/aura-showcase.mp4", mobileSource: "/videos/projects/aura-showcase-mobile.mp4", captions: "/videos/projects/aura-showcase.pt.vtt",
    poster: "/images/projects/aura-film-poster.webp",
    label: "Aura: vídeo da experiência de harmonização facial",
    action: "Quero um site para minha clínica", contact: auraFilmContact,
  },
  orla: {
    id: "orla", name: "Orla", sector: "RESIDÊNCIAS", slug: "imoveis",
    description: "Da paisagem aos critérios de uma nova casa.",
    source: "/videos/projects/orla-showcase.mp4", mobileSource: "/videos/projects/orla-showcase-mobile.mp4", captions: "/videos/projects/orla-showcase.pt.vtt",
    poster: "/images/projects/orla-film-poster.jpg",
    label: "Orla: vídeo da experiência de residências",
    action: "Quero um site para minha imobiliária",
    contact: buildWhatsAppUrl("Olá, Gabriel! Vi o filme da Orla no seu portfólio e quero conversar sobre um site para meu negócio imobiliário."),
  },
} as const;

// Approved brands are shown only as films (the sites themselves are not public): a top-to-bottom walkthrough
// recorded in Full HD by scripts/capture-brand-films.mjs, with a vertical cut for phones and a short loop for the card.
const brandFilm = (id: string, name: string, label: string, niche: string) => ({
  id, name, source: `/videos/projects/brands/${id}-desktop.mp4`, mobileSource: `/videos/projects/brands/${id}-mobile.mp4`,
  loop: `/videos/projects/brands/${id}-loop.mp4`, label: `${name}: vídeo do site, do início ao fim`,
  action: `Quero um site para ${label}`,
  contact: buildWhatsAppUrl(`Olá, Gabriel! Vi o filme da ${name} no seu portfólio e quero conversar sobre um site para ${niche}.`),
});
export const brandFilms = {
  fio: brandFilm("fio", "Fio", "minha clínica de transplante capilar", "a minha clínica de transplante capilar"),
  nitida: brandFilm("nitida", "Nítida", "minha clínica de oftalmologia", "a minha clínica de oftalmologia"),
  cerne: brandFilm("cerne", "Cerne Implantes", "minha clínica de implantes", "a minha clínica de implantes"),
  talhao: brandFilm("talhao", "Talhão Advocacia do Agro", "meu escritório", "o meu escritório de advocacia do agro"),
  paddock: brandFilm("paddock", "Paddock — Seminovos com o laudo aberto", "minha loja de seminovos", "a minha loja de seminovos"),
  arrimo: brandFilm("arrimo", "Arrimo Advocacia Previdenciária", "meu escritório", "o meu escritório de advocacia previdenciária"),
  lume: brandFilm("lume", "Lume Psicologia", "minha clínica de psicologia", "a minha clínica de psicologia"),
  forma: brandFilm("forma", "Forma Odontologia", "minha clínica", "a minha clínica odontológica"),
  sutil: brandFilm("sutil", "Sutil Cirurgia Plástica", "minha clínica", "a minha clínica de cirurgia plástica"),
  toca: brandFilm("toca", "Toca Hospital Veterinário", "meu hospital veterinário", "o meu hospital veterinário"),
  brisa: brandFilm("brisa", "Casa Brisa", "meu hotel", "o meu hotel"),
  almeida: brandFilm("almeida", "Almeida & Valença", "meu escritório", "o meu escritório"),
};
export type FilmId = keyof typeof projectFilms | keyof typeof brandFilms;
export const films: Record<FilmId, { source: string; mobileSource?: string; captions?: string; loop?: string; label: string; action: string; contact: string }> = { ...projectFilms, ...brandFilms };
export type ProjectFilm = (typeof projectFilms)[keyof typeof projectFilms];
