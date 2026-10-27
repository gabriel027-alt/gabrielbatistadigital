import { siteConfig } from "./site";
export function buildWhatsAppUrl(message?: string): string {
  return message
    ? `${siteConfig.whatsappBaseUrl}?text=${encodeURIComponent(message)}`
    : siteConfig.whatsappBaseUrl;
}
