import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { periods, stages } from "@/lib/arrimo";
import { ArrimoMark } from "./ArrimoMark";
import { ArrimoMotion } from "./ArrimoMotion";
import styles from "./arrimo.module.css";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--arrimo-display", display: "swap" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--arrimo-body", display: "swap" });
export const metadata: Metadata = {
  title: "Arrimo | Advocacia Previdenciária",
  description: "A decisão do INSS, os documentos e os registros da vida profissional: a análise começa por compreender a sua história.",
  robots: { index: false, follow: true }, alternates: { canonical: "/modelos/previdenciario" },
};

export default function ArrimoPage() {
  return <div className={`${styles.page} ${display.variable} ${body.variable}`} data-model="arrimo">
    <a className={styles.skip} href="#arrimo-conteudo">Pular para o conteúdo</a>
    <ArrimoMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#arrimo-inicio" aria-label="Arrimo Advocacia Previdenciária, início"><ArrimoMark /><span>Arrimo<small>Advocacia Previdenciária</small></span></a>
      <nav aria-label="Navegação principal"><a href="#arrimo-tempo">Como a análise começa <span aria-hidden="true">↓</span></a></nav>
    </header>
    <main id="arrimo-conteudo">
      <section id="arrimo-inicio" className={styles.hero} aria-labelledby="arrimo-titulo">
        <figure className={styles.heroPhoto}><Image src="/images/arrimo/hero.webp" alt="Advogado da Arrimo, de braços cruzados, em um retrato preto e branco com luz lateral" fill sizes="(max-width:760px) 200vw, 120vw" quality={90} preload /></figure>
        <div className={styles.heroCopy}>
          <p className={styles.field} data-arrimo-arrival>Direito previdenciário</p>
          <h1 id="arrimo-titulo" data-arrimo-arrival><span>O INSS negou?</span>{" "}<span>Isso ainda</span>{" "}<span>não é o fim.</span></h1>
          <p className={styles.intro} data-arrimo-arrival>Antes de escolher um caminho, é preciso entender a negativa e conferir os documentos da sua história.</p>
          <a className={styles.primary} href="#arrimo-tempo" data-arrimo-arrival>Entender a análise <span aria-hidden="true">↓</span></a>
          <p className={styles.heroNote} data-arrimo-arrival>Cada ano trabalhado conta.</p>
        </div>
        <span className={styles.heroRule} aria-hidden="true" />
      </section>

      <section id="arrimo-tempo" className={styles.scene} data-arrimo-scene aria-labelledby="arrimo-tempo-titulo">
        <div className={styles.stage}>
          <figure className={styles.hands}><Image data-arrimo-hands src="/images/arrimo/maos.webp" alt="Mãos de um trabalhador segurando uma carteira de trabalho e documentos" fill sizes="(max-width:760px) 150vw, 60vw" quality={90} /></figure>
          <div className={styles.sceneHead}>
            <h2 id="arrimo-tempo-titulo"><span>O tempo</span>{" "}<span>se soma.</span></h2>
            <p className={styles.sceneIntro}>A vida de trabalho nem sempre aparece inteira em um registro. Quando há uma negativa, a leitura começa pelos documentos.</p>
          </div>

          <div className={styles.ruler}>
            <span className={styles.rule} aria-hidden="true"><i data-arrimo-rule /></span>
            <ol className={styles.periods}>
              {periods.map((period, i) => <li key={period.title} className={styles.period} data-arrimo-period>
                <p className={styles.record}>{period.record}</p><h3>{period.title}</h3><p className={styles.periodDetail}>{period.detail}</p>
                <span className={styles.documentLines} aria-hidden="true" /><span className={styles.node} aria-hidden="true" />
                {i < periods.length - 1 && <span className={styles.gap} aria-hidden="true"><i data-arrimo-gap /><b data-arrimo-bridge /></span>}
              </li>)}
            </ol>
          </div>

          <div className={styles.sceneFoot}>
            <ol className={styles.phases} aria-label="Etapas da análise">
              {stages.map(stage => <li key={stage.title} data-arrimo-phase><h3>{stage.title}</h3><p>{stage.text}</p></li>)}
            </ol>
            <div className={styles.decision} role="img" aria-label="Da negativa à análise dos documentos">
              <span className={styles.decisionLabel}>Leitura dos documentos</span>
              <span className={styles.denied} data-arrimo-denied aria-hidden="true">Negado</span>
              <span className={styles.review} data-arrimo-review>Em análise</span>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer className={styles.footer}>
      <span className={styles.footerMark}><ArrimoMark size={24} />Arrimo</span>
      <a href="#arrimo-inicio">Voltar ao início ↑</a>
      <p>© 2026 Arrimo. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
