import { auraFilmContact } from "@/lib/aura-contact";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const projectFilms = {
  aura: {
    id: "aura", name: "Aura", sector: "HARMONIZAÇÃO FACIAL", slug: "aura-aesthetics",
    description: "Expressão, movimento e um caminho para a avaliação.",
    source: "/videos/projects/aura-showcase.mp4", captions: "/videos/projects/aura-showcase.pt.vtt",
    poster: "/images/projects/aura-film-poster.webp",
    label: "Aura: vídeo da experiência de harmonização facial",
    action: "Quero um site para minha clínica", contact: auraFilmContact,
  },
  orla: {
    id: "orla", name: "Orla", sector: "RESIDÊNCIAS", slug: "imoveis",
    description: "Da paisagem aos critérios de uma nova casa.",
    source: "/videos/projects/orla-showcase.mp4", captions: "/videos/projects/orla-showcase.pt.vtt",
    poster: "/images/projects/orla-film-poster.jpg",
    label: "Orla: vídeo da experiência de residências",
    action: "Quero um site para minha imobiliária",
    contact: buildWhatsAppUrl("Olá, Gabriel! Vi o filme da Orla no seu portfólio e quero conversar sobre um site para meu negócio imobiliário."),
  },
} as const;
export type ProjectFilm = (typeof projectFilms)[keyof typeof projectFilms];
