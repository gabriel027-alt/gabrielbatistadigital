import Image from "next/image";
import { ArtDirectedImage } from "@/components/ArtDirectedImage";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { linePath, onLine, shapes, transformOf, view, type ShapeId } from "@/lib/gb-shapes";
import { GbShape, GbShapeDefs } from "@/components/GbShape";
import { brandKits } from "@/lib/brand-kits";
import { Arrow } from "@/components/ui/icons";
import { EditorialAvatarLoop } from "@/components/EditorialAvatarLoop";
import { EditorialMotion } from "@/components/EditorialMotion";
import { EditorialMedia } from "@/components/EditorialMedia";
import { HeroClouds } from "@/components/HeroClouds";
import { HandParticles } from "@/components/HandParticles";
import { TalkParticles } from "@/components/TalkParticles";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ContactTracking } from "@/components/ContactTracking";
import { ScrollGuide } from "@/components/ScrollGuide";
import { DiagnosisQuiz } from "@/components/DiagnosisQuiz";
import { ConsentBanner, ConsentPreferences } from "@/components/ConsentBanner";
import { privacyCopy } from "@/lib/privacy-copy";
import { contactUrl, homeCopy, localeInfo, type Locale } from "@/lib/i18n";
import type { FilmId } from "@/lib/project-films";
import styles from "@/app/editorial.module.css";

/**
 * The editorial homepage, the same page in each language (app/page.tsx, app/en, app/es). Only the words change: the
 * choreography, the shapes and the films are shared. The words that carry a red tittle keep a real "i" in every
 * language ("Design", "Diseño"; "primeiro/first/primera", "clique/click/clic").
 */
// Monumental words (name, section titles, contact); Manrope stays for reading. Mono only for real brand data.
// Variable width and weight: the hero name breathes between narrow and wide, as in the reference.
// latin-ext brings the dotless "ı": the red brand dot takes the place of the tittle on both i of the name.
const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], weight: "variable", axes: ["wdth", "opsz"], variable: "--gb-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--gb-mono", display: "swap" });
/** A dotless "ı" whose only tittle is the red brand dot (a red dot over a brown one looked doubled, 21/11/2026); `carry` marks the one the scroll picks up and drops into the palm. */
const redI = (carry = false) => <span className={styles.iSlot}>ı<span className={`${styles.tittle} ${styles.hookTittle}`} data-hook-tittle={carry ? "carry" : ""} aria-hidden="true" /></span>;
/** Draws a word of the name with a red tittle (the brand dot) over each "i". */
const nameWord = (text: string) => [...text].map((letter, index) => letter === "i" ? <span key={index} className={styles.iSlot}>ı<span className={styles.tittle} data-tittle /></span> : letter);
const sample = (id: string, kind: "hero" | "cena") => `/images/projects/brands/${id}-${kind}.webp`;
const kit = (id: string) => brandKits.find(item => item.id === id);

type Work = { id: FilmId; name: string; image: string; kit?: string };
const works: Work[] = [
  // First static brand (23/11/2026, approved): high-ticket dentistry leads the selection.
  { id: "cerne", name: "Cerne Implantes", image: sample("cerne", "hero"), kit: "cerne" },
  // Second static brand (23/11/2026, approved): refractive surgery, right after Cerne.
  { id: "nitida", name: "Nítida", image: sample("nitida", "hero"), kit: "nitida" },
  // Third static brand (23/11/2026, approved): hair transplant, right after Nítida.
  { id: "fio", name: "Fio", image: sample("fio", "hero"), kit: "fio" },
  { id: "elo", name: "Elo", image: sample("elo", "hero"), kit: "elo" },
  { id: "eixo", name: "Eixo Ortopedia", image: sample("eixo", "hero"), kit: "eixo" },
  { id: "lume", name: "Lume Psicologia", image: sample("lume", "hero"), kit: "lume" },
  { id: "arrimo", name: "Arrimo Advocacia Previdenciária", image: sample("arrimo", "hero"), kit: "arrimo" },
  { id: "paddock", name: "Paddock", image: sample("paddock", "hero"), kit: "paddock" },
  { id: "talhao", name: "Talhão Advocacia do Agro", image: sample("talhao", "hero"), kit: "talhao" },
  { id: "sutil", name: "Sutil Cirurgia Plástica", image: sample("sutil", "hero"), kit: "sutil" },
  { id: "brisa", name: "Casa Brisa", image: sample("brisa", "hero"), kit: "brisa" },
  { id: "aura", name: "Aura", image: "/images/projects/aura-film-poster.webp" },
  { id: "orla", name: "Orla", image: "/images/projects/orla-film-poster.jpg" },
];
// Between the two words of the name: a peach card where "g." assembles in a loop (same story as the scroll scene).
// View box framed around the assembled letter; the stem is painted first so the bowl sits on top of it.
const cardView = "379 321 700 482";
const cardOrder: ShapeId[] = ["stem", "bowl", "hook", "dot"];
const cardParts = cardOrder.map(id => shapes.find(shape => shape.id === id)!);
// Paint order: the line passes behind the stem and in front of the rest.
const backShapes = shapes.filter(shape => shape.id === "frame" || shape.id === "stem");
const frontShapes = shapes.filter(shape => shape.id !== "frame" && shape.id !== "stem");

/** A rule the brand dot reads (services, around the site, how it works). */
const readTrack = <span className={styles.readTrack} aria-hidden="true"><span className={styles.readFill} data-read-fill /><span className={`${styles.carrierDot} ${styles.readDot}`} data-read-dot /></span>;

export function EditorialHome({ locale }: { locale: Locale }) {
  const t = homeCopy[locale], contact = contactUrl(locale), legal = privacyCopy[locale];
  /** One project of the grid: the top of its site, the film on click and the short preview on hover. */
  const project = (work: Work) => {
    const data = work.kit ? kit(work.kit) : undefined;
    return <li key={work.name} className={styles.stripItem}><EditorialMedia name={work.name} image={work.image} film={work.id} compact locale={locale} teaser="hover"/>
      <div className={styles.stripCaption}><div><h3>{work.name}</h3><span>{t.sectors[work.id]}</span></div>
        {/* What the site does for the business, before the designer's data (22/11/2026). */}
        <p className={styles.benefit}>{t.benefits[work.id]}</p>
        {data && <dl className={styles.spec}><div><dt className={styles.sr}>{t.specFont}</dt><dd>{data.typography.display}</dd></div><div><dt className={styles.sr}>{t.specColors}</dt><dd className={styles.swatches}>{Object.values(data.palette).map(hex => <span key={hex} style={{ background: hex }} title={hex}><i>{hex}</i></span>)}</dd></div></dl>}
      </div></li>;
  };
  return <EditorialMotion className={`${display.variable} ${mono.variable}`} labels={t.motion}>
    {/* The root layout says pt-BR; the other languages correct it before anything is read. */}
    {/* Counts the clicks on WhatsApp for the analytics tool to come; loads and sends nothing by itself. */}
    <ContactTracking />
    <ScrollGuide labels={t.scrollGuide} />
    {/* Cookie consent for Google Analytics and Ads; renders nothing until their IDs are configured (lib/analytics.ts). */}
    <ConsentBanner copy={legal} afterHero />
    {locale !== "pt" && <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(localeInfo[locale].html)}` }} />}
    <a className={styles.skip} href="#editorial-main">{t.skip}</a>
    <header className={styles.nav} data-editorial-nav><a className={styles.logo} href="#editorial-start">Gabriel<span aria-hidden="true">•</span>Batista</a><nav aria-label={t.navLabel}><a href="#editorial-work">{t.nav.work}</a><a href="#editorial-services">{t.nav.services}</a><a href="#editorial-about">{t.nav.about}</a><a className={styles.navWhats} href={contact} target="_blank" rel="noopener noreferrer" data-track-place="menu-celular">{t.nav.talk}</a></nav><div className={styles.navEnd}><LanguageSwitch current={locale} label={t.langLabel} /><a className={styles.navContact} href={contact} target="_blank" rel="noopener noreferrer" data-cursor-label={t.talkCursor} data-track-place="menu">{t.nav.talk} <Arrow size={15}/></a></div></header>
    <svg className={styles.defs} aria-hidden="true" focusable="false"><GbShapeDefs /></svg>
    <main id="editorial-main">
      <section id="editorial-start" className={styles.hero} data-editorial-theme="photo">
        {/* Before the first paint: with motion allowed, the portrait waits hidden so the points can form it
            (components/HeroClouds.tsx). Without JS, with reduced motion or saved data, it shows as usual; and the CSS
            shows it after 3 s whatever happens. */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(navigator.connection&&navigator.connection.saveData))document.documentElement.dataset.heroAssemble=''}catch(e){}" }} />
        <div className={styles.heroPhoto} data-hero-photo><ArtDirectedImage alt={t.heroAlt} preload desktop={{ src: "/images/hero/gabriel-hero-wide.webp", sizes: "130vw" }} mobile={{ src: "/images/hero/gabriel-hero-mobile.webp", sizes: "150vw" }} /><HeroClouds /></div>
        {/* The brand dot is born as the tittle of "Design": it soaks the phrase in red ink, then drips onto the name. */}
        <p className={styles.heroOffer} data-hero-offer><span className={styles.sr}>{t.offer.label}</span><span aria-hidden="true">{t.offer.before}<span className={styles.iSlot}>ı<span className={`${styles.tittle} ${styles.offerTittle}`} data-offer-tittle /></span>{t.offer.after} <br/>{t.offer.line2}</span><span className={styles.offerInk} data-offer-ink aria-hidden="true" /></p>
        {/* Direction A (21/11/2026): the promise comes first, with who it is for and two calls. The face stays clear. */}
        <div className={styles.heroPitch} data-hero-pitch>
          {/* Phones only: the label sits above the promise (on computers it is the offer at the top, where the dot is born). */}
          <p className={styles.heroKickerPhone} aria-hidden="true">{t.offer.label}</p>
          <h1 className={styles.heroTitle}>{t.hero.title}</h1>
          <p className={styles.heroSub}>{t.hero.sub}</p>
          <div className={styles.heroActions}>
            <a className={styles.heroPrimary} href="#editorial-work">{t.hero.projects} <span aria-hidden="true">↓</span></a>
            <a className={styles.heroSecondary} href={contact} target="_blank" rel="noopener noreferrer" data-track-place="topo"><span className={styles.hintDesktop}>{t.hero.talk}</span><span className={styles.hintPhone}>{t.hero.talkShort}</span> <Arrow size={16}/></a>
          </div>
        </div>
        {/* The name is the signature: the dot plants a tittle on each "i" and lands in the "g." between the words. */}
        <div className={styles.heroBottom}><p className={styles.heroName} data-hero-wordmark><span className={styles.sr}>Gabriel Batista</span><span aria-hidden="true" data-hero-word>{nameWord("Gabriel")}</span><span className={styles.heroSample} data-hero-sample aria-hidden="true"><span className={styles.heroCard} data-hero-card><svg viewBox={cardView}>{cardParts.map(shape => <g key={shape.id} transform={transformOf(shape.final)}><g data-card-part={shape.id}><GbShape id={shape.id} tone="dark" /></g></g>)}</svg></span></span><span aria-hidden="true" data-hero-word>{nameWord("Batista")}</span><span className={styles.heroDot} data-hero-dot aria-hidden="true" /><svg className={styles.heroTrail} aria-hidden="true" focusable="false"><path data-hero-trail pathLength={1} /></svg><span className={styles.heroGlow} data-hero-glow aria-hidden="true" /><span className={styles.heroGlow} data-hero-wave aria-hidden="true" /></p></div>
      </section>
      <section className={styles.hook} data-editorial-theme="paper" data-hook>
        {/* Arrives whole (21/11/2026): word by word it read broken while the hero left. */}
        <h2 aria-label={t.hook.label}>{t.hook.first[0]}{redI()}{t.hook.first[1]}<br/>{t.hook.lead}<a href={contact} target="_blank" rel="noopener noreferrer" className={styles.clickWord} data-cursor-label={t.hook.cursor} data-track-place="frase-clique"><span aria-hidden="true">{t.hook.click[0]}{redI(true)}{t.hook.click[1]}</span><span className={styles.sr}>{t.hook.clickLabel}</span> <Arrow size={42}/></a>,<br/>{t.hook.tail}</h2>
        {/* "O próximo clique", one stage: the red tittle of "clique" falls into Gabriel's open palm; the dot rises, bursts,
            and the pieces of "g." come out of that spark, float with the peach line and assemble above the hand. */}
        <div className={styles.fusionTrack} data-creation-track data-gb-track>
          <div className={styles.fusionStage} data-fusion-stage>
            {/* The points that formed him at the top pour down from "clique" with the dot and form his hand. */}
            <HandParticles />
            <figure className={styles.palm} data-palm role="img" aria-label={t.palmLabel}>
              <div className={styles.palmBody} data-palm-body>
              <Image src="/images/editorial/mao-palma-braco.webp" alt="" width={5800} height={2701} quality={90} sizes="(max-width:700px) 200vw, 150vw" data-palm-hand />
              <span className={styles.palmRing} data-creation-ring aria-hidden="true" />
              <span className={styles.palmGlow} data-palm-glow aria-hidden="true" />
              <span className={styles.palmShadow} data-palm-shadow aria-hidden="true" />
              <span className={`${styles.tittle} ${styles.palmDot}`} data-creation-dot aria-hidden="true" />
              </div>
            </figure>
            <span className={styles.gShadow} data-g-shadow aria-hidden="true" />
            <div className={styles.fusionField} data-gb-shapes aria-hidden="true"><svg viewBox={`0 0 ${view.w} ${view.h}`} preserveAspectRatio="xMidYMid meet">
              {backShapes.map(shape => <g key={shape.id} data-gb-shape={shape.id} transform={transformOf(shape.final)}><GbShape id={shape.id} /></g>)}
              <path className={styles.gbLine} data-gb-line d={linePath(shapes.filter(shape => onLine(shape.id)).map(shape => shape.final))} pathLength={1} />
              {frontShapes.map(shape => <g key={shape.id} data-gb-shape={shape.id} transform={transformOf(shape.final)}><GbShape id={shape.id} /></g>)}
            </svg></div>
            <div className={styles.palmCopy} data-palm-copy><h2>{t.palmTitle}</h2><p>{t.palmText}</p></div>
          </div>
        </div>
      </section>
      {/* The folder (shortened 21/11/2026): the brand dot drops onto its tab, the folder opens, and right below it the
          projects sit in a still grid, each showing the top of its site; the short preview plays only on hover. The
          endless strip and the points that formed the cards were removed: they delayed and hid the proof. */}
      <section className={styles.work} id="editorial-work" data-editorial-theme="paper" aria-labelledby="editorial-work-title">
        <div className={styles.workTrack} data-work-track>
          <div className={styles.workStage} data-work-stage>
            <h2 id="editorial-work-title" className={styles.projectsWord} data-work-word>{t.projects}</h2><p className={styles.workProof} data-work-note>{t.workProof}</p>
            <div className={styles.pasta} data-pasta aria-hidden="true">
              <span className={styles.pastaBack}><span className={styles.pastaTab}/></span>
              <span className={styles.pastaSheet} data-pasta-sheet/>
              <span className={styles.pastaFront} data-pasta-front><span>g.</span></span>
              <span className={styles.pastaRing} data-pasta-ring/>
              <span className={`${styles.tittle} ${styles.pastaDot}`} data-pasta-dot/>
            </div>
            <p className={styles.workNote} data-work-note>{t.workNote}</p>
          </div>
        </div>
        <div className={styles.projectGrid} data-strip>
          <ul className={styles.gridList}>{works.map(work => project(work))}</ul>
        </div>
      </section>      <section className={styles.services} id="editorial-services" data-editorial-theme="paper" aria-labelledby="editorial-services-title">
        <p className={styles.sectionNote}>{t.servicesNote}</p><h2 id="editorial-services-title" className={styles.servicesTitle} data-kinetic>{t.servicesTitle[0]}<br/>{t.servicesTitle[1]}</h2>
        <div className={styles.serviceList} data-read-list>{t.services.map(item => <article key={item.title} className={styles.serviceItem} data-read-item><h3><span className={styles.readLine}>{item.title}</span></h3><p>{item.text}</p></article>)}{readTrack}</div>
        {/* Around the site: how the patient finds the clinic and gets to the calendar. Described as work done, with no
            numbers, results or clients (there are none to show yet). */}
        <div className={`${styles.serviceList} ${styles.serviceMore}`} data-read-list><div className={styles.serviceLabel}><h3>{t.supportTitle}</h3><p>{t.supportText}</p></div>{t.support.map(item => <article key={item.title} className={styles.serviceItem} data-read-item><h3><span className={styles.readLine}>{item.title}</span></h3><p>{item.text}</p></article>)}{readTrack}</div>
        {/* For whoever does not know which of these they need (22/11/2026): two questions and where Gabriel would start.
            "Sob medida" is now its last answer, and the old line comes back without JavaScript. */}
        <DiagnosisQuiz copy={{ ...t.diagnosis, fallback: { lead: t.customLead, text: t.customText, href: contact } }} place="diagnostico" />
        {/* How it works, read by the dot like the lists above. Process only: no deadlines or prices until Gabriel sets them. */}
        <h3 className={styles.stepsTitle} id="editorial-steps">{t.stepsTitle}</h3>
        <div className={`${styles.serviceList} ${styles.stepsList}`} data-read-list>{t.steps.map((item, i) => <article key={item.title} className={styles.serviceItem} data-read-item><h3><span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span><span className={styles.readLine}>{item.title}</span></h3><p>{item.text}</p></article>)}{readTrack}</div>
        {/* Right where the process is understood, the first step is one tap away (22/11/2026). */}
        <div className={styles.stepsCta}><a href={contact} target="_blank" rel="noopener noreferrer" data-track-place="como-funciona">{t.stepsCta.label} <Arrow size={16}/></a><span>{t.stepsCta.note}</span></div>
      </section>
      <section className={styles.about} id="editorial-about" data-editorial-theme="photo" aria-labelledby="editorial-about-title">
        <div className={styles.aboutPhoto} data-about-photo><ArtDirectedImage alt={t.aboutAlt} desktop={{ src: "/images/hero/gabriel-sobre.webp", sizes: "300vw" }} mobile={{ src: "/images/hero/gabriel-sobre-mobile.webp", sizes: "260vw" }} /></div>
        <div className={styles.aboutStatement}><h2 id="editorial-about-title" data-kinetic>{t.aboutTitle[0]}<br/>{t.aboutTitle[1]}</h2><p>{t.aboutText}</p></div>
        <div className={styles.aboutPrinciples}><p>{t.aboutIntro[0]}<br/>{t.aboutIntro[1]}</p><h3 className={styles.readAbout} data-read-about><span className={styles.readLine}>{t.aboutClaim[0]}<br/>{t.aboutClaim[1]}</span><span className={`${styles.carrierDot} ${styles.readDot}`} data-read-dot aria-hidden="true" /></h3><ul>{t.principles.map(item => <li key={item}>{item}</li>)}</ul><a href={contact} target="_blank" rel="noopener noreferrer" className={styles.photoLink} data-track-place="sobre">{t.aboutLink} <Arrow size={22}/></a></div>
      </section>
      {/* The questions asked before writing (22/11/2026), answered with Gabriel's own choices; native details/summary. */}
      <section className={styles.faq} id="editorial-faq" data-editorial-theme="paper" aria-labelledby="editorial-faq-title">
        <h2 id="editorial-faq-title">{t.faq.title}</h2>
        <div className={styles.faqList}>{t.faq.items.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true" /></summary><p>{item.a}</p></details>)}</div>
      </section>
      <section className={styles.contact} id="editorial-contact" data-editorial-theme="paper"><a data-contact-panel href={contact} target="_blank" rel="noopener noreferrer" data-cursor-label={t.talkCursor} data-track-place="contato"><TalkParticles /><div><h2>{t.contactTitle[0]}<br/>{t.contactTitle[1]}</h2><p>{t.contactText}</p></div><span className={styles.contactAction}><span className={styles.contactGo}><span>{t.contactGo}<span className={styles.contactDot} data-contact-dot aria-hidden="true" /></span><Arrow size={42}/></span><span className={styles.contactWhere}>{t.contactWhere}</span></span></a></section>
    </main>
    <footer id="editorial-footer" className={styles.footer} data-editorial-theme="photo"><EditorialAvatarLoop alt={t.avatarAlt}/><div className={styles.footerTop}><p>Gabriel Batista Digital</p><div><span>{t.tagline}</span><p><a href={contact} target="_blank" rel="noopener noreferrer" data-track-place="rodape">{t.footerTalk}</a></p></div></div><div className={styles.footerName} aria-hidden="true"><span>Gabriel</span><span>Batista</span></div><div className={styles.footerBottom}><span>{t.rights}</span><span className={styles.footerLegal}><a href={legal.path}>{legal.footerPrivacy}</a><ConsentPreferences label={legal.footerCookies} className={styles.footerPrefs} /></span><a href="#editorial-start">{t.backTop}</a></div></footer>
  </EditorialMotion>;
}
