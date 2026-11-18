import type { Metadata, Viewport } from "next";
import { homeCopy, languageAlternates, localeInfo, locales, type Locale } from "@/lib/i18n";

/** Title, description, canonical and hreflang of the homepage in one language. */
export function homeMetadata(locale: Locale): Metadata {
  const t = homeCopy[locale], info = localeInfo[locale];
  return {
    title: { absolute: t.metaTitle },
    description: t.metaDescription,
    alternates: { canonical: info.path, languages: languageAlternates },
    openGraph: {
      title: "Gabriel Batista Digital", description: t.metaDescription, url: info.path, siteName: "Gabriel Batista Digital", type: "website",
      locale: info.og, alternateLocale: locales.filter(other => other !== locale).map(other => localeInfo[other].og),
    },
    twitter: { card: "summary_large_image", title: "Gabriel Batista Digital", description: t.metaDescription },
  };
}
// The phone browser bar takes the colour of the dark hero.
export const homeViewport: Viewport = { themeColor: "#201714" };
