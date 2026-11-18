import type { Metadata } from "next";
import Link from "next/link";
import { ConsentBanner, ConsentPreferences } from "@/components/ConsentBanner";
import { localeInfo, type Locale } from "@/lib/i18n";
import { privacyCopy } from "@/lib/privacy-copy";
import styles from "./privacy.module.css";

/** The privacy policy in one language (/privacidade, /pt-pt/privacidade, /en/privacy, /es/privacidad). */
export function privacyMetadata(locale: Locale): Metadata {
  const t = privacyCopy[locale];
  return { title: { absolute: `${t.title} | Gabriel Batista` }, alternates: { canonical: t.path }, robots: { index: true, follow: true } };
}

export function PrivacyPage({ locale }: { locale: Locale }) {
  const t = privacyCopy[locale];
  return <main className={styles.page}>
    {locale !== "pt" && <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(localeInfo[locale].html)}` }} />}
    <Link href={t.home} className={styles.logo}>Gabriel<span aria-hidden="true">•</span>Batista</Link>
    <h1>{t.title}</h1>
    <p className={styles.updated}>{t.updated}</p>
    {t.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.body.map(text => <p key={text}>{text}</p>)}</section>)}
    <p className={styles.links}><Link href={t.home}>{t.back}</Link><ConsentPreferences label={t.footerCookies} className={styles.prefs} /></p>
    <ConsentBanner copy={t} />
  </main>;
}
