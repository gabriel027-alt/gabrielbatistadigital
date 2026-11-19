import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Public_Sans, Young_Serif } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { faq, howItWorks, psychologist, signs, week, weights } from "@/lib/lume";
import { LumeMark } from "./LumeMark";
import { LumeMotion } from "./LumeMotion";
import styles from "./lume.module.css";

/** Young Serif: soft, upright, a conversational voice with no italic. Public Sans for reading. */
const display = Young_Serif({ subsets: ["latin"], weight: "400", variable: "--lume-display", display: "swap" });
const sans = Public_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--lume-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Lume Psicologia | Para quem cuida de todo mundo",
  description: "Psicoterapia presencial e online para mulheres sobrecarregadas, que cuidam de todo mundo e não conseguem parar.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/psicologia" },
};

const book = "#lume-interesse";

/**
 * Lume Psicologia (docs/NOVOS-PROJETOS-REGISTROS.md): the demands fall away while the kitchen turns from 23h to 7h,
 * the self-check, a week with one hour that is hers, the psychologist on her own clay backdrop, questions and the
 * local booking journey. No name, CRP, numbers, testimonials or promise of outcome.
 */
export default function LumePage() {
  return <div className={`${styles.page} ${display.variable} ${sans.variable}`} data-model="lume">
    <a className={styles.skip} href="#lume-conteudo">Pular para o conteúdo</a>
    <LumeMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#lume-inicio" aria-label="Lume Psicologia, início"><LumeMark size={30} /><span>Lume<small>Psicologia</small></span></a>
      <nav aria-label="Navegação principal"><a href="#lume-sinais">É pra você?</a><a href="#como-funciona">Como funciona</a><a href="#psicologa">Quem atende</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar conversa</a>
    </header>

    <main id="lume-conteudo">
      {/* Signature: the demands weigh on the headline and fall away with the scroll. */}
      <section className={styles.hero} id="lume-inicio" aria-labelledby="lume-titulo" data-lume-hero>
        <div className={styles.stage}>
          <span className={styles.lamp} data-lume-lamp aria-hidden="true" />
          <div className={styles.copy}>
            <p className={styles.lead}>Psicologia para mulheres que cuidam de todo mundo e não conseguem parar.</p>
            <div className={styles.titleBox}>
              <h1 id="lume-titulo" data-lume-title>Você não precisa carregar tudo sozinha.</h1>
              <ul className={styles.weights} aria-label="O que costuma pesar">
                {weights.map(item => <li key={item.text} data-lume-weight style={{ "--top": `${item.top}%`, "--left": `${item.left}%`, "--turn": `${item.turn}deg` } as CSSProperties}>{item.text}</li>)}
              </ul>
            </div>
            <p className={styles.sub} data-lume-after>Um espaço de escuta para entender o que está pesando e aprender a dividir esse peso. Atendimento presencial e online.</p>
            <div className={styles.actions} data-lume-after>
              <a className={styles.primary} href={book}>Agendar uma primeira conversa</a>
              <a className={styles.textLink} href="#lume-sinais">Ver se é pra você</a>
            </div>
            {/* Who listens, from the first screen. */}
            <a className={styles.signature} href="#psicologa" data-lume-after>
              <span className={styles.thumb}><Image src="/images/lume/retrato.webp" alt="" fill sizes="56px" /></span>
              <span>Com <strong>{psychologist.name}</strong>, {psychologist.role.toLowerCase()}</span>
            </a>
          </div>
          {/* The same kitchen at 23h and at 7h: the morning comes in as the demands fall. */}
          <figure className={styles.scene} data-lume-scene>
            <Image src="/images/lume/cozinha-noite.webp" alt="Uma mulher à mesa da cozinha às onze da noite, com a mão na testa, diante do notebook, de contas e de uma lancheira infantil" fill sizes="(max-width:900px) 200vw, 90vw" quality={88} preload />
            <Image className={styles.morning} data-lume-morning src="/images/lume/cozinha-manha.webp" alt="A mesma cozinha de manhã, com a mesa arrumada; ela segura um café e olha pela janela" fill sizes="(max-width:900px) 200vw, 90vw" quality={88} />
          </figure>
        </div>
      </section>

      <section className={styles.signs} id="lume-sinais" aria-labelledby="sinais-titulo">
        <div className={styles.signsHead}>
          <h2 id="sinais-titulo">Talvez você esteja aqui porque…</h2>
          <p>Marque o que se parece com você.</p>
        </div>
        <ul className={styles.signList}>
          {signs.map((sign, i) => <li key={sign}>
            <label><input type="checkbox" name={`sinal-${i}`} /><span>{sign}</span></label>
          </li>)}
        </ul>
        <div className={styles.signsEnd}>
          <p className={styles.signsNote}>Se alguma frase pareceu sua, uma conversa já ajuda a organizar o que está acontecendo.</p>
          <a className={styles.primary} href={book}><span data-when="none">Agendar uma primeira conversa</span><span data-when="some">Quero falar sobre isso</span></a>
        </div>
      </section>

      {/* How it works, read along a week: one hour of it lights up like the pendant did. */}
      <section className={styles.how} id="como-funciona" aria-labelledby="como-titulo">
        <h2 id="como-titulo">Uma hora da semana só sua.</h2>
        <div className={styles.week} aria-hidden="true" data-lume-week>
          {week.map((day, i) => <div key={day} className={styles.day}><span>{day}</span>{i === 3 && <i className={styles.hour} data-lume-hour />}</div>)}
        </div>
        <ul className={styles.howList}>
          {howItWorks.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}
        </ul>
      </section>

      {/* The psychologist stands on the section itself: its colour is her studio backdrop. */}
      <section className={styles.about} id="psicologa" aria-labelledby="psicologa-titulo">
        <figure className={styles.portrait}>
          <Image src="/images/lume/retrato.webp" alt={`${psychologist.name}, psicóloga da Lume, de camisa de seda cacau, olhando para a câmera`} fill sizes="(max-width:900px) 130vw, 46vw" quality={88} />
        </figure>
        <div className={styles.aboutCopy}>
          <p className={styles.aboutLead}>Quem escuta você</p>
          <h2 id="psicologa-titulo">{psychologist.name}</h2>
          <p className={styles.role}>{psychologist.role}, fundadora da Lume</p>
          <p>Sou a {psychologist.first}. Atendo mulheres adultas que seguram a casa, o trabalho e as pessoas ao redor, e que se esqueceram de si no meio disso.</p>
          <p>Na terapia, a gente olha com calma para o que pesa: a culpa de parar, o cansaço que não passa, a dificuldade de dizer não. Sem julgamento e no seu tempo.</p>
          <ul className={styles.facts}>
            <li>Mulheres adultas</li>
            <li>Presencial e online</li>
            <li>Sessões semanais</li>
          </ul>
          <a className={styles.darkButton} href={book}>Agendar uma primeira conversa</a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <h2 id="duvidas-titulo">Antes de marcar, pergunte o que quiser.</h2>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="lume" />
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><LumeMark size={24} />Lume Psicologia</p>
      <nav aria-label="Rodapé"><a href="#como-funciona">Como funciona</a><a href="#psicologa">Quem atende</a><a href={book}>Agendar conversa</a></nav>
      <p className={styles.credit}>© 2026 Lume Psicologia. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
