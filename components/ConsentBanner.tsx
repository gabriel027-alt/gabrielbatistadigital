"use client";

import { useEffect, useState } from "react";
import { analytics, analyticsEnabled, CONSENT_KEY } from "@/lib/analytics";
import type { PrivacyCopy } from "@/lib/privacy-copy";
import styles from "./consent.module.css";

/**
 * Cookie consent for Google Analytics and Google Ads (18/11/2026). Nothing from Google loads before "Accept"; "Decline"
 * is as easy as accepting; the choice is kept in this browser and can be changed from the footer ("gb:consent-open").
 * Ad personalization stays off (no remarketing). Renders nothing while no ID is configured (lib/analytics.ts).
 */
type Gtag = (...args: unknown[]) => void;
type Win = Window & { dataLayer?: unknown[]; gtag?: Gtag; __gbGtag?: boolean };

function loadGoogle() {
  const win = window as Win;
  if (win.__gbGtag) return;
  win.__gbGtag = true;
  win.dataLayer = win.dataLayer || [];
  // gtag must push the arguments object itself.
  win.gtag = function gtag() { win.dataLayer!.push(arguments); } as Gtag;
  win.gtag("consent", "default", { ad_storage: "granted", analytics_storage: "granted", ad_user_data: "granted", ad_personalization: "denied" });
  win.gtag("js", new Date());
  if (analytics.ga) win.gtag("config", analytics.ga);
  if (analytics.ads) win.gtag("config", analytics.ads);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.ga || analytics.ads)}`;
  document.head.append(script);
}

/** On withdrawal: tell Google, and remove its cookies from this site. */
function forgetGoogle() {
  const win = window as Win;
  win.gtag?.("consent", "update", { ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^(_ga|_gid|_gcl|_gac)/.test(name)) continue;
    const host = location.hostname;
    for (const domain of ["", `; domain=${host}`, `; domain=.${host.replace(/^www\./, "")}`]) document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
  }
}

export function ConsentBanner({ copy }: { copy: PrivacyCopy }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!analyticsEnabled) return;
    let choice: string | null = null;
    try { choice = localStorage.getItem(CONSENT_KEY); } catch { /* Storage blocked: ask every visit, load nothing until accepted. */ }
    if (choice === "granted") loadGoogle();
    // Shown after the first paint, so the server and the browser render the same page.
    else if (choice !== "denied") queueMicrotask(() => setOpen(true));
    const reopen = () => setOpen(true);
    document.addEventListener("gb:consent-open", reopen);
    return () => document.removeEventListener("gb:consent-open", reopen);
  }, []);
  if (!analyticsEnabled || !open) return null;
  const decide = (granted: boolean) => {
    try { localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied"); } catch { /* Kept for this page only. */ }
    if (granted) loadGoogle(); else forgetGoogle();
    setOpen(false);
  };
  return <div className={styles.banner} role="dialog" aria-live="polite" aria-label={copy.banner.policy} data-consent-banner>
    <p>{copy.banner.text} <a href={copy.path}>{copy.banner.policy}</a></p>
    <div className={styles.actions}>
      <button type="button" onClick={() => decide(false)} data-consent="reject">{copy.banner.reject}</button>
      <button type="button" onClick={() => decide(true)} data-consent="accept">{copy.banner.accept}</button>
    </div>
  </div>;
}

/** Footer link that reopens the choice. */
export function ConsentPreferences({ label, className }: { label: string; className?: string }) {
  if (!analyticsEnabled) return null;
  return <button type="button" className={className} onClick={() => document.dispatchEvent(new Event("gb:consent-open"))}>{label}</button>;
}
