import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Public_Sans, Young_Serif } from "next/font/google";
import { signs, weights } from "@/lib/lume";
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

const book = "#lume-sinais";

/**
 * Pilot unit (18/11/2026): hero with the signature scene ("as cobranças se soltam") and the self-check.
 * The portrait slot waits for the user's photos; the rest of the page comes after the pilot is approved.
 */
export default function LumePage() {
  return <div className={`${styles.page} ${display.variable} ${sans.variable}`} data-model="lume">
    <a className={styles.skip} href="#lume-conteudo">Pular para o conteúdo</a>
    <LumeMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#lume-inicio" aria-label="Lume Psicologia, início"><LumeMark size={30} /><span>Lume<small>Psicologia</small></span></a>
      <nav aria-label="Navegação principal"><a href="#lume-sinais">É pra você?</a><a href="#lume-sinais">Como funciona</a><a href="#lume-sinais">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar conversa</a>
    </header>

    <main id="lume-conteudo">
      {/* Signature: the demands weigh on the headline and fall away with the scroll. */}
      <section className={styles.hero} id="lume-inicio" aria-labelledby="lume-titulo" data-lume-hero>
        <div className={styles.stage}>
          <span className={styles.curtain} data-lume-curtain aria-hidden="true" />
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
          </div>
          <figure className={styles.portrait} aria-hidden="true" data-lume-portrait>
            <span className={styles.portraitLight} />
            <figcaption>Retrato da psicóloga no consultório (foto a gerar)</figcaption>
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
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><LumeMark size={24} />Lume Psicologia</p>
      <p className={styles.credit}>© 2026 Lume Psicologia. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
