import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { localeInfo, locales } from "@/lib/i18n";

/** The homepage in its three languages, each listing the others (hreflang). */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.domain}${path === "/" ? "" : path}`;
  const languages = Object.fromEntries(locales.map(locale => [localeInfo[locale].html, url(localeInfo[locale].path)]));
  return locales.map(locale => ({ url: url(localeInfo[locale].path), changeFrequency: "monthly", priority: locale === "pt" ? 1 : .9, alternates: { languages } }));
}
