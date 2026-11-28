import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { EditorialMedia } from "@/components/EditorialMedia";
import { ContactTracking } from "@/components/ContactTracking";
import { ConsentBanner, ConsentPreferences } from "@/components/ConsentBanner";
import { Arrow } from "@/components/ui/icons";
import { privacyCopy } from "@/lib/privacy-copy";
import { DiagnosisQuiz } from "@/components/DiagnosisQuiz";
import { clinicProjects, clinicsContact, clinicsCopy as t, clinicsDiagnosis } from "@/lib/clinics";
import editorial from "@/app/editorial.module.css";
import styles from "./clinicas.module.css";

const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], weight: "variable", axes: ["wdth", "opsz"], variable: "--gb-display", display: "swap" });

export const viewport = { themeColor: "#faf6ef" };
export const metadata: Metadata = {
  title: { absolute: "Sites para clínicas | Gabriel Batista" },
  description: "Sites com a identidade da sua clínica, não de um modelo pronto. Para estética, odontologia, cirurgia plástica, psicologia e outras especialidades.",
  alternates: { canonical: "/clinicas" },
  openGraph: { title: "Sites para clínicas | Gabriel Batista", description: "Um site que faz o paciente certo confiar na sua clínica antes da primeira consulta.", url: "/clinicas", type: "website", locale: "pt_BR" },
};

/**
 * Landing page for clinics (lib/clinics.ts): result first, proof right below the fold, then why, what is included,
 * how it works, investment without a number, questions and the call. One call everywhere: WhatsApp with a message ready.
 */
export default function ClinicsPage() {
  const legal = privacyCopy.pt;
  const talk = (place: string, label: string, primary = true) => <a className={primary ? styles.primary : styles.secondary} href={clinicsContact} target="_blank" rel="noopener noreferrer" data-track-place={place}>{label} <Arrow size={16} /></a>;
  return <div className={`${editorial.page} ${styles.page} ${display.variable}`} data-editorial data-editorial-motion="on" data-editorial-theme="paper">
    <ContactTracking />
    <ConsentBanner copy={legal} />
    <a className={styles.skip} href="#clinicas-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <Link className={styles.logo} href="/">Gabriel<span aria-hidden="true">•</span>Batista</Link>
      <a className={styles.headerCall} href={clinicsContact} target="_blank" rel="noopener noreferrer" data-track-place="clinicas-menu">Conversar <Arrow size={14} /></a>
    </header>
    <main id="clinicas-conteudo">
      {/* A personal introduction, followed by the clinical projects. */}
      <div className={styles.top}>
      <section className={styles.hero} aria-labelledby="clinicas-titulo">
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h1 id="clinicas-titulo">{t.title}</h1>
        <p className={styles.sub}>{t.sub}</p>
        <div className={styles.actions}><a className={styles.primary} href={clinicsContact} target="_blank" rel="noopener noreferrer" data-track-place="clinicas-topo"><span className={styles.long}>{t.talk}</span><span className={styles.short}>{t.talkShort}</span> <Arrow size={16} /></a><a className={styles.secondary} href="#clinicas-projetos">{t.projects} <span aria-hidden="true">↓</span></a></div>
        <p className={styles.who}>{t.who}</p>
      </section>
      <figure className={styles.portrait}>
        <Image src="/images/hero/gabriel-hero-mobile.webp" alt="Gabriel Batista, responsável pelo design, desenvolvimento e criação de conteúdo" fill sizes="(max-width: 700px) 88vw, 42vw" preload />
        <figcaption><strong>Gabriel Batista</strong><span>Do site ao conteúdo, a conversa é direto comigo.</span></figcaption>
      </figure>
      </div>

      <section className={styles.projects} id="clinicas-projetos" aria-labelledby="clinicas-projetos-titulo">
        <div className={styles.sectionHead}><h2 id="clinicas-projetos-titulo">{t.projectsTitle}</h2><p>{t.projectsNote}</p></div>
        <ul className={styles.grid}>
          {clinicProjects.map(project => <li key={project.id}>
            <EditorialMedia name={project.name} image={project.image} film={project.id} compact teaser={false} />
            <div className={styles.caption}><h3>{project.name}</h3><span>{project.sector}</span></div>
          </li>)}
        </ul>
      </section>

      <section className={styles.block} aria-labelledby="clinicas-por-que">
        <h2 id="clinicas-por-que">{t.whyTitle}</h2>
        <ol className={styles.why}>{t.why.map((item, i) => <li key={item.title}><span aria-hidden="true">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      <section className={`${styles.block} ${styles.dark}`} aria-labelledby="clinicas-incluso">
        <h2 id="clinicas-incluso">{t.includedTitle}</h2>
        <ul className={styles.cards}>{t.included.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ul>
        <h3 className={styles.afterTitle}>{t.afterTitle}</h3>
        <p className={styles.serviceNote}>{t.afterNote}</p>
        <ul className={styles.after}>{t.after.map(item => <li key={item.title}><h4>{item.title}</h4><p>{item.text}</p></li>)}</ul>
      </section>

      {/* For the owner who does not know which of these the clinic needs first (22/11/2026). */}
      <section className={styles.block} aria-label="Por onde começar">
        <DiagnosisQuiz copy={clinicsDiagnosis} business="clinica" place="clinicas-diagnostico" callClassName={styles.primary} className={styles.quiz} />
      </section>

      <section className={styles.block} aria-labelledby="clinicas-como">
        <h2 id="clinicas-como">{t.stepsTitle}</h2>
        <ol className={styles.steps}>{t.steps.map((step, i) => <li key={step.title}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
      </section>

      <section className={`${styles.block} ${styles.price}`} aria-labelledby="clinicas-investimento">
        <h2 id="clinicas-investimento">{t.priceTitle}</h2>
        <div><p>{t.priceLead}</p><ul>{t.priceFactors.map(item => <li key={item}>{item}</li>)}</ul><p className={styles.priceClose}>{t.priceClose}</p>{talk("clinicas-investimento", t.priceCall)}</div>
      </section>

      <section className={styles.block} aria-labelledby="clinicas-duvidas">
        <h2 id="clinicas-duvidas">{t.faqTitle}</h2>
        <div className={styles.faq}>{t.faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <section className={styles.final} aria-labelledby="clinicas-final">
        <h2 id="clinicas-final">{t.finalTitle}</h2>
        <p>{t.finalText}</p>
        {talk("clinicas-final", t.finalCall)}
        <p className={styles.note}>{t.finalNote}</p>
      </section>
    </main>
    <footer className={styles.footer}>
      <p>© 2026 Gabriel Batista Digital. Todos os direitos reservados.</p>
      <nav aria-label="Rodapé"><Link href="/">{t.portfolio}</Link><Link href="/privacidade">{legal.footerPrivacy}</Link><ConsentPreferences label={legal.footerCookies} className={styles.prefs} /></nav>
    </footer>
  </div>;
}
