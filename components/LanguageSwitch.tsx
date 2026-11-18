import { localeInfo, locales, type Locale } from "@/lib/i18n";
import styles from "@/app/editorial.module.css";

/**
 * Language by flag, the user's choice (17/11/2026): Brazil for Portuguese, the United States for English, Mexico for
 * Spanish (Latin American Spanish, the larger market, chosen with him; it was Spain at first). Plain links between the three pages (each language has its own address). On a computer the three flags sit
 * in a pill, as in his reference; on a phone the current flag opens the other two, so the header keeps its room. Groups, not <nav>: the header styles every <nav> inside it as the main menu.
 * Simplified flags drawn here, round, 24 px. Each copy of a flag has its own clip id: a clip inside the hidden pill (on phones)
 * would leave the visible flags square.
 */
function Flag({ locale, place }: { locale: Locale; place: string }) {
  return <svg className={styles.flag} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <defs><clipPath id={`flag-${place}-${locale}`}><circle cx="12" cy="12" r="12" /></clipPath></defs>
    <g clipPath={`url(#flag-${place}-${locale})`}>
      {locale === "pt" && <><rect width="24" height="24" fill="#009b3a" /><path d="M12 3.6 22 12 12 20.4 2 12z" fill="#fedf00" /><circle cx="12" cy="12" r="4.6" fill="#002776" /><path d="M7.6 11.2c2.9-.6 6.1-.1 8.7 1.4" stroke="#fff" strokeWidth=".8" fill="none" /></>}
      {locale === "en" && <><rect width="24" height="24" fill="#fff" />{[0, 2, 4, 6, 8, 10, 12].map(i => <rect key={i} y={i * 24 / 13} width="24" height={24 / 13} fill="#b22234" />)}<rect width="11" height={24 * 7 / 13} fill="#3c3b6e" />{[[2.2, 2.2], [5.5, 2.2], [8.8, 2.2], [3.8, 4.8], [7.1, 4.8], [2.2, 7.4], [5.5, 7.4], [8.8, 7.4], [3.8, 10], [7.1, 10]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r=".55" fill="#fff" />)}</>}
      {locale === "es" && <><rect width="24" height="24" fill="#fff" /><rect width="8" height="24" fill="#006847" /><rect x="16" width="8" height="24" fill="#ce1126" /><ellipse cx="12" cy="12" rx="2.2" ry="2" fill="#8c5a2b" /><path d="M9.6 13.6c1.4 1.3 3.4 1.3 4.8 0" stroke="#3f7a3a" strokeWidth=".7" fill="none" /></>}
    </g>
    <circle cx="12" cy="12" r="11.5" fill="none" stroke="#0000001f" />
  </svg>;
}

export function LanguageSwitch({ current, label }: { current: Locale; label: string }) {
  const link = (place: string) => (locale: Locale) => <a key={locale} href={localeInfo[locale].path} hrefLang={localeInfo[locale].html} lang={localeInfo[locale].html} aria-current={locale === current ? "true" : undefined} title={localeInfo[locale].name} aria-label={localeInfo[locale].name} className={styles.langLink}><Flag locale={locale} place={place} /></a>;
  return <>
    <div className={styles.langPill} role="group" aria-label={label}>{locales.map(link("pill"))}</div>
    <details className={styles.langMenu}>
      <summary aria-label={`${label}: ${localeInfo[current].name}`}><Flag locale={current} place="current" /></summary>
      <div className={styles.langList} role="group" aria-label={label}>{locales.filter(locale => locale !== current).map(link("menu"))}</div>
    </details>
  </>;
}
