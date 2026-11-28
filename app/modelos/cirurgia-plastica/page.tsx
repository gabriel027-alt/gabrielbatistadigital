import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bodoni_Moda, Figtree } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { ModelIcon } from "@/components/ModelIcon";
import { faq, features, firstConsult, recovery, recoveryDays, rulerPosition, surgeries } from "@/lib/sutil";
import { SutilMark } from "./SutilMark";
import { SutilMotion } from "./SutilMotion";
import styles from "./sutil.module.css";
import { BrandScrollGuide } from "@/components/brand/BrandScrollGuide";

/** Bodoni Moda: high-contrast, precise display with a true italic; Figtree for reading. */
const display = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500"], variable: "--sutil-display", display: "swap" });
const sans = Figtree({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--sutil-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Sutil Cirurgia Plástica | Consulta, planejamento e recuperação",
  description: "Cirurgia plástica com consulta sem pressa, plano por escrito e recuperação acompanhada, etapa por etapa.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/cirurgia-plastica" },
};

const book = "#sutil-interesse";
const ticks = Array.from({ length: recoveryDays }, (_, i) => i + 1);

export default function SutilPage() {
  return <div className={`${styles.page} ${display.variable} ${sans.variable}`} data-model="sutil">
    <a className={styles.skip} href="#sutil-conteudo">Pular para o conteúdo</a>
    <SutilMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#sutil-inicio"><SutilMark size={30} /><span>Sutil<small>Cirurgia plástica</small></span></a>
      <nav aria-label="Navegação principal"><a href="#cirurgia">A cirurgiã</a><a href="#cirurgias">Cirurgias</a><a href="#recuperacao">Recuperação</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar consulta</a>
    </header>

    <main id="sutil-conteudo">
      {/* Hero, 28/11/2026 ("Gesso" direction): a plaster face in profile under hard light from above; the title rests on
          the plaster wall beside it, and the recovery ruler (the brand's signature) starts here, lit at Dia 0. It replaced
          the consultation photo, which repeated the window-light clinic formula (docs/DESIGN-SYSTEM.md). */}
      <section className={styles.hero} id="sutil-inicio" aria-labelledby="sutil-titulo" data-sutil-hero>
        <Image className={styles.heroImage} src="/images/sutil/gesso.webp" alt="Rosto de gesso em perfil, preso a uma parede de gesso, sob luz dura vinda de cima" fill sizes="(max-width:900px) 160vw, 100vw" quality={90} preload />
        <div className={styles.heroCopy}>
          <div>
            <p className={styles.kicker}>Cirurgia plástica</p>
            <h1 id="sutil-titulo">A decisão mais importante <em>vem antes da cirurgia.</em></h1>
          </div>
          <div className={styles.heroSide}>
            <p>Na primeira consulta, você conta o que deseja e a cirurgiã explica cada etapa, inclusive a recuperação, antes de qualquer decisão.</p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href={book}>Agendar minha consulta</a>
              <a className={styles.textLink} href="#recuperacao">Ver como é a recuperação</a>
            </div>
          </div>
        </div>
        <div className={styles.dayZero} aria-hidden="true">
          <div className={styles.dayTicks} data-hero-ticks>{ticks.map(day => <i key={day} style={{ left: `${rulerPosition(day) * 100}%` }} data-week={day % 7 === 0 || day === 1 ? "" : undefined} />)}</div>
          <span className={styles.dayMarker} data-hero-marker />
          <ol>
            <li data-lit>Dia 0 · a conversa</li>
            <li style={{ left: `${rulerPosition(7) * 100}%` }}>Semana 1</li>
            <li style={{ left: `${rulerPosition(30) * 100}%` }}>1º mês</li>
            <li style={{ left: "100%" }}>3 meses</li>
          </ol>
        </div>
      </section>

      <section className={styles.features} aria-labelledby="diferenciais-titulo">
        <h2 id="diferenciais-titulo">Como cuidamos de cada decisão</h2>
        <ul>{features.map(item => <li key={item.title}><ModelIcon name={item.icon} /><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>
      </section>

      {/* Brand signature, 28/11/2026: the recovery in five phases on one line, all visible at once. The day-by-day
          counter (420svh of pinned scroll for five texts) was replaced at the user's request; the line draws itself
          and lights each phase once when the section arrives, and the text never fades. */}
      <section className={styles.recovery} id="recuperacao" aria-labelledby="recuperacao-titulo" data-sutil-recovery>
        <div className={styles.recoveryHead}>
          <div className={styles.recoveryCopy}>
            <p className={styles.kicker}>A recuperação, fase a fase</p>
            <h2 id="recuperacao-titulo">Você sabe o que esperar <em>antes de começar.</em></h2>
            <p className={styles.note}>Os prazos são aproximados. Cada cirurgia tem o seu cronograma, explicado na consulta.</p>
          </div>
          <figure className={styles.recoveryPhoto}>
            <Image src="/images/sutil/cuidados.webp" alt="Vistos de cima, sobre um lençol de linho: cinta compressiva dobrada, termômetro, porta-comprimidos da semana, folha de orientações e garrafa de água" fill quality={90} sizes="(max-width:900px) 100vw, 55vw" />
          </figure>
        </div>
        <ol className={styles.phases} data-phases>
          {recovery.map(stop => <li key={stop.day} data-phase>
            <span className={styles.phaseDot} aria-hidden="true" data-phase-dot /><span className={styles.phaseLabel}>{stop.label}</span><h3>{stop.title}</h3><p>{stop.text}</p>
          </li>)}
        </ol>
      </section>

      <section className={styles.about} id="cirurgia" aria-labelledby="cirurgia-titulo">
        <figure className={styles.aboutPhoto}>
          <Image src="/images/sutil/cirurgia.webp" alt="Cirurgiã de blusa sálvia, em pé e de frente num corredor de gesso e travertino, sob uma claraboia" fill sizes="(max-width:900px) 160vw, 70vw" />
          <figcaption><SutilMark size={22} />Cada plano começa por ouvir.</figcaption>
        </figure>
        <div className={styles.aboutCopy}>
          <p className={styles.kicker}>Conheça a cirurgiã</p>
          <h2 id="cirurgia-titulo">Clareza sobre o que <em>é possível para você.</em></h2>
          <p>Na Sutil, cada cirurgia começa pelo que você deseja e pelo que faz sentido para o seu corpo. Antes de decidir, você ouve também o que não é indicado no seu caso e como seria cada etapa.</p>
          <ul className={styles.checks}>
            <li>Avaliação completa, sem pressa</li>
            <li>Alternativas explicadas na consulta</li>
            <li>Acompanhamento até a alta</li>
          </ul>
          <a className={styles.textLink} href="#cirurgias">Conhecer as cirurgias</a>
        </div>
      </section>

      <section className={styles.surgeries} id="cirurgias" aria-labelledby="cirurgias-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Cirurgias</p>
          <h2 id="cirurgias-titulo">Cada cirurgia, <em>um plano próprio.</em></h2>
          <p>As principais cirurgias e as etapas de cada uma. A indicação é feita na consulta.</p>
        </div>
        <div className={styles.cards}>
          {surgeries.map((surgery, index) => <article key={surgery.id} className={styles.card} data-surgery={surgery.id}>
            <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
            <h3>{surgery.name}</h3>
            <p>{surgery.summary}</p>
            <details>
              <summary>Como funciona</summary>
              <p className={styles.forWhom}>{surgery.forWhom}</p>
              <ol>{surgery.path.map(step => <li key={step}>{step}</li>)}</ol>
            </details>
          </article>)}
        </div>
        <div className={styles.center}><a className={styles.primary} href={book}>Conversar sobre a minha cirurgia</a></div>
      </section>

      <section className={styles.consult} id="primeira-consulta" aria-labelledby="primeira-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>A primeira consulta</p>
          <h2 id="primeira-titulo">Comece pela <em>conversa.</em></h2>
        </div>
        <ol className={styles.consultSteps}>
          {firstConsult.map(step => <li key={step.title}><strong>{step.title}</strong><span>{step.text}</span></li>)}
        </ol>
        <div className={styles.center}><a className={styles.primary} href={book}>Agendar a primeira consulta</a></div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Dúvidas frequentes</p>
          <h2 id="duvidas-titulo">Antes de decidir, <em>pergunte tudo.</em></h2>
        </div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="sutil" />
    </main>
    <BrandScrollGuide />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><SutilMark size={26} />Sutil Cirurgia Plástica</p>
      <nav aria-label="Rodapé"><a href="#cirurgias">Cirurgias</a><a href="#recuperacao">Recuperação</a><a href={book}>Agendar consulta</a></nav>
      <p className={styles.credit}>© 2026 Sutil Cirurgia Plástica. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
