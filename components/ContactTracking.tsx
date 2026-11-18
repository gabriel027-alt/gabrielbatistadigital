"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

/**
 * Counts the clicks on WhatsApp (18/11/2026), ready for whichever analytics tool Gabriel picks; nothing is loaded or
 * sent by this file, and it sets no cookie. On each click on a wa.me link it records where the link is
 * (data-track-place, or the section around it), the page's language and the campaign the visitor came from (utm_*
 * parameters of the landing address, kept for the visit in sessionStorage), and hands that to:
 *   - window.dataLayer ("whatsapp_click"), for Google Tag Manager / GA4 / Google Ads conversions;
 *   - window.gtag, when gtag.js is on the page;
 *   - window.plausible ("WhatsApp click", as props), when Plausible is on the page;
 *   - a "gb:contact" DOM event, for anything else (e.g. Vercel Analytics' track()).
 * How to connect a tool: docs/MEDICAO-CONTATO.md.
 */
type Payload = Record<string, string>;
type Win = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; plausible?: (event: string, options?: { props?: Payload }) => void };
const UTM = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];
const KEY = "gb-campaign";

export function ContactTracking() {
  useEffect(() => {
    // The campaign of the landing address, kept for the rest of the visit.
    let campaign: Payload = {};
    try {
      const params = new URLSearchParams(location.search);
      const found = Object.fromEntries(UTM.filter(name => params.get(name)).map(name => [name, params.get(name)!.slice(0, 120)]));
      if (Object.keys(found).length) sessionStorage.setItem(KEY, JSON.stringify(found));
      campaign = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    } catch { /* Private mode or blocked storage: the click is still counted, without the campaign. */ }
    const click = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>('a[href*="wa.me"]');
      if (!link) return;
      const place = link.dataset.trackPlace || link.closest<HTMLElement>("[data-track-place]")?.dataset.trackPlace || link.closest("section,header,footer,dialog")?.id || "page";
      const payload: Payload = { place, language: document.documentElement.lang, page: location.pathname, ...campaign };
      const win = window as Win;
      (win.dataLayer = win.dataLayer || []).push({ event: "whatsapp_click", ...payload });
      win.gtag?.("event", "whatsapp_click", payload);
      // The Google Ads conversion ("WhatsApp click"), when configured. gtag only exists after consent.
      if (analytics.ads && analytics.adsLabel) win.gtag?.("event", "conversion", { send_to: `${analytics.ads}/${analytics.adsLabel}` });
      win.plausible?.("WhatsApp click", { props: payload });
      document.dispatchEvent(new CustomEvent("gb:contact", { detail: payload }));
    };
    // Capture phase: counted before the link opens WhatsApp in a new tab.
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, []);
  return null;
}
