import type { Metadata, Viewport } from "next";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Holding page shown in production while the portfolio is being rebuilt (see SITE_OFFLINE in next.config.js). */
export const metadata: Metadata = {
  title: { absolute: "Gabriel Batista | Site em atualização" },
  description: "Sites para clínicas, escritórios e negócios de alto ticket.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#201714" };

const contact = buildWhatsAppUrl("Olá, Gabriel! Quero conversar sobre um site para o meu negócio.");

export default function HoldingPage() {
  return <main className="nf-page">
    <p className="nf-code nf-name">Gabriel Batista<span aria-hidden="true">.</span></p>
    <h1>Site em atualização.</h1>
    <p className="nf-text">Sites para clínicas, escritórios e negócios de alto ticket. Enquanto isso, fale comigo pelo WhatsApp.</p>
    <a href={contact} className="nf-button" target="_blank" rel="noopener noreferrer">Conversar no WhatsApp</a>
  </main>;
}
