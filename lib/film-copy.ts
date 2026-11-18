import { films, type FilmId } from "@/lib/project-films";
import type { Locale } from "@/lib/i18n";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * The film dialog's words in European Portuguese, English and Spanish (Brazilian Portuguese stays in
 * lib/project-films.ts). The films themselves show the brands' sites as they are, in Brazilian Portuguese; only the
 * label, the call and the WhatsApp message change.
 */
const names: Record<FilmId, string> = { forma: "Forma Odontologia", sutil: "Sutil Cirurgia Plástica", toca: "Toca Hospital Veterinário", brisa: "Casa Brisa", almeida: "Almeida & Valença", aura: "Aura", orla: "Orla" };
const business: Record<Exclude<Locale, "pt">, Record<FilmId, string>> = {
  "pt-PT": { forma: "a minha clínica dentária", sutil: "a minha clínica de cirurgia plástica", toca: "o meu hospital veterinário", brisa: "o meu hotel", almeida: "o meu escritório", aura: "a minha clínica", orla: "a minha imobiliária" },
  en: { forma: "my dental clinic", sutil: "my plastic surgery clinic", toca: "my veterinary hospital", brisa: "my hotel", almeida: "my law firm", aura: "my clinic", orla: "my real estate business" },
  es: { forma: "mi clínica dental", sutil: "mi clínica de cirugía plástica", toca: "mi hospital veterinario", brisa: "mi hotel", almeida: "mi despacho", aura: "mi clínica", orla: "mi inmobiliaria" },
};

export function filmText(id: FilmId, locale: Locale) {
  if (locale === "pt") return { label: films[id].label, action: films[id].action, contact: films[id].contact };
  const name = names[id], what = business[locale][id];
  if (locale === "pt-PT") return { label: `${name}: filme do site, do início ao fim`, action: `Quero um site para ${what}`, contact: buildWhatsAppUrl(`Olá, Gabriel! Vi o filme da ${name} no seu portefólio e gostava de falar sobre um site para ${what}.`) };
  return locale === "en"
    ? { label: `${name}: film of the website, start to finish`, action: `I want a website for ${what}`, contact: buildWhatsAppUrl(`Hi Gabriel! I watched the ${name} film in your portfolio and I'd like to talk about a website for ${what}.`) }
    : { label: `${name}: video del sitio, de principio a fin`, action: `Quiero un sitio para ${what}`, contact: buildWhatsAppUrl(`¡Hola, Gabriel! Vi el video de ${name} en tu portafolio y quiero conversar sobre un sitio para ${what}.`) };
}
