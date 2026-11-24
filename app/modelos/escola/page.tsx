import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fredoka, Lexend } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { StickyCall } from "@/components/brand/StickyCall";
import { WhoAnswers } from "@/components/brand/WhoAnswers";
import { Arrow } from "@/components/ui/icons";
import { ages, day, faq, visit } from "@/lib/ponte";
import { Bridge, PonteMark } from "./PonteMark";
import styles from "./ponte.module.css";

/** Fredoka: rounded and friendly without being a cartoon, for titles. Lexend, drawn for easy reading, for the text. */
const display = Fredoka({ subsets: ["latin"], weight: ["500", "600"], variable: "--ponte-display", display: "swap" });
const text = Lexend({ subsets: ["latin"], weight: ["400", "600"], variable: "--ponte-text", display: "swap" });

export const metadata: Metadata = {
  title: "Ponte Escola Bilíngue | Educação infantil e fundamental",
  description: "Educação infantil e fundamental para crianças de 2 a 10 anos, que vivem o dia em português e em inglês. Duas línguas, um mesmo dia.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/escola" },
};

const book = "#ponte-interesse";
const photo = (name: string) => `/images/ponte/${name}.webp`;

/**
 * Ponte (docs/PROJETOS-ESTATICOS.md), the eighth static brand and the first with a typographic top (design system,
 * "Topo e conjunto de fotos", 24/11/2026): the greeting in two languages is the protagonist, over a strip of six
 * overhead squares of the day. No portrait: the school office answers in words.
 */
export default function PontePage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="ponte" id="ponte-inicio">
    <a className={styles.skip} href="#ponte-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#ponte-inicio"><PonteMark size={22} /><span>Ponte<small>Escola bilíngue</small></span></a>
      <nav aria-label="Navegação principal"><a href="#o-dia">O dia</a><a href="#idades">As idades</a><a href="#visita">A visita</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar visita</a>
    </header>

    <main id="ponte-conteudo">
      <section className={styles.hero} aria-labelledby="ponte-titulo">
        <div className={styles.heroTop}>
          <p className={styles.greeting}><span>Bom dia.</span><span className={styles.bridgeLine}><Bridge /></span><span lang="en">Good morning.</span></p>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Escola bilíngue · 2 a 10 anos</p>
            <h1 id="ponte-titulo">Duas línguas, um mesmo dia.</h1>
            <p className={styles.heroText}>Educação infantil e fundamental para crianças que vivem o dia em português e em inglês, da chegada à saída. O primeiro passo é conhecer a escola.</p>
            <div className={styles.calls} data-hero-calls><a className={styles.primary} href={book}>Agendar uma visita <Arrow size={20} /></a><a className={styles.secondary} href="#o-dia">Ver um dia na escola</a></div>
            <WhoAnswers className={styles.who}>A secretaria responde e marca a sua visita.</WhoAnswers>
          </div>
        </div>
        <ol className={styles.strip} aria-label="Um dia na escola, da chegada à saída">{day.map(moment => <li key={moment.id}>
          <Image src={photo(moment.photo)} alt="" fill sizes="(max-width:700px) 34vw, 17vw" quality={82} style={{ objectPosition: moment.position }} />
          <span>{moment.label}</span>
        </li>)}</ol>
      </section>

      <section className={styles.daySection} id="o-dia" aria-labelledby="dia-titulo">
        <div className={styles.sectionHead}><PonteMark size={26} /><h2 id="dia-titulo">O dia em duas línguas.</h2><p>Seis momentos, e a frase que a criança ouve em cada um. O inglês não é uma aula a mais: é a língua de metade do dia.</p></div>
        <ol className={styles.dayList}>{day.map(moment => <li key={moment.id}>
          <div className={styles.dayHead}><span className={styles.thumb}><Image src={photo(moment.photo)} alt="" fill sizes="64px" quality={75} style={{ objectPosition: moment.position }} /></span><h3>{moment.label}</h3></div>
          <p className={styles.pt}>{moment.pt}</p>
          <span className={styles.dayBridge}><Bridge /></span>
          <p className={styles.en} lang="en">{moment.en}</p>
          <p className={styles.dayText}>{moment.text}</p>
        </li>)}</ol>
      </section>

      <section className={styles.ages} id="idades" aria-labelledby="idades-titulo">
        <div className={styles.sectionHead}><PonteMark size={26} /><h2 id="idades-titulo">O que muda em cada idade.</h2></div>
        <ul className={styles.ageList}>{ages.map(age => <li key={age.range}><h3>{age.range}</h3><p>{age.text}</p></li>)}</ul>
      </section>

      <section className={styles.visit} id="visita" aria-labelledby="visita-titulo">
        <div className={styles.sectionHead}><PonteMark size={26} /><h2 id="visita-titulo">Como é a visita.</h2><p>Nenhuma decisão antes de você conhecer a escola com calma.</p></div>
        <ol className={styles.visitList}>{visit.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
        <a className={styles.primary} href={book}>Agendar uma visita <Arrow size={20} /></a>
      </section>

      <section className={styles.office} aria-labelledby="secretaria-titulo">
        <span className={styles.officeBridge}><Bridge /></span>
        <h2 id="secretaria-titulo">Quem responde é a secretaria.</h2>
        <p>Ela responde às mensagens, marca a visita e tira as primeiras dúvidas sobre horários, adaptação e alimentação. Na visita, você conhece a coordenação e as professoras.</p>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.sectionHead}><PonteMark size={26} /><h2 id="duvidas-titulo">Perguntas das famílias</h2></div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="ponte" />
    </main>

    <StickyCall href={book} label="Agendar visita" className={styles.stickyCall} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><PonteMark size={18} />Ponte Escola Bilíngue</p>
      <nav aria-label="Rodapé"><a href="#o-dia">O dia</a><a href="#visita">A visita</a><a href={book}>Agendar visita</a></nav>
      <p className={styles.credit}>© 2026 Ponte Escola Bilíngue. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
