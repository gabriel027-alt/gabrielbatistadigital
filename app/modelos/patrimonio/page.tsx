import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { ModelIcon } from "@/components/ModelIcon";
import { areas, doubts, faq, partitionSteps, values } from "@/lib/almeida";
import { AlmeidaMotion } from "./AlmeidaMotion";
import { AlmeidaSeal } from "./AlmeidaSeal";
import { EstateTree } from "./EstateTree";
import styles from "./almeida.module.css";

/** Kit: Cormorant Garamond (the tradition of legal documents) for headings, Source Sans 3 for reading. */
const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--almeida-serif", display: "swap" });
const sans = Source_Sans_3({ subsets: ["latin"], variable: "--almeida-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Almeida & Valença Advocacia | Inventário e planejamento sucessório",
  description: "Inventário em cartório ou judicial, planejamento sucessório, partilha e testamentos, com custos e etapas explicados desde a primeira conversa.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/patrimonio" },
  openGraph: { title: "Almeida & Valença Advocacia", description: "Inventário e planejamento sucessório.", url: "/modelos/patrimonio", images: [{ url: "/images/models/people/patrimonio.webp", width: 1600, height: 900, alt: "Advogada conversa com uma cliente em seu escritório" }] },
};

const talk = "#almeida-interesse";

export default function AlmeidaPage() {
  return <div className={`${styles.page} ${serif.variable} ${sans.variable}`} data-model="almeida">
    <a className={styles.skip} href="#almeida-conteudo">Pular para o conteúdo</a>
    <AlmeidaMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#almeida-inicio" aria-label="Almeida & Valença Advocacia, início"><AlmeidaSeal size={40} className={styles.logoSeal} /><span>Almeida &amp; Valença<small>Advocacia de família e sucessões</small></span></a>
      <nav aria-label="Navegação principal"><a href="#inventario">Inventário</a><a href="#partilha">A partilha</a><a href="#atuacao">Atuação</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={talk}>Falar com a advogada</a>
    </header>

    <main id="almeida-conteudo">
      <section className={styles.hero} id="almeida-inicio" aria-labelledby="almeida-titulo">
        <Image className={styles.heroImage} src="/images/models/people/patrimonio.webp" alt="Advogada conversa com uma cliente, em seu escritório com estante de livros e luminária de latão" fill sizes="100vw" preload />
        <div className={styles.heroCopy}>
          <p className={styles.section}>Família e sucessões</p>
          <h1 id="almeida-titulo">Inventário e planejamento sucessório conduzidos com clareza.</h1>
          <svg className={styles.inkLine} viewBox="0 0 520 24" preserveAspectRatio="none" aria-hidden="true"><path d="M2 14 C120 4 220 20 330 10 S470 8 518 13" pathLength={1} data-hero-ink /></svg>
          <p className={styles.lead}>Orientamos famílias em inventários em cartório ou judiciais, partilhas e planejamento do patrimônio, com custos e etapas explicados desde a primeira conversa.</p>
          <div className={styles.actions}>
            <a className={styles.brass} href={talk}>Falar com a advogada</a>
            <a className={styles.lightLink} href="#partilha">Ver como funciona a partilha</a>
          </div>
          <ul className={styles.trust} aria-label="Como atendemos">
            <li><ModelIcon name="video" />Presencial e online</li>
            <li><ModelIcon name="scroll" />Cartório ou judicial</li>
            <li><ModelIcon name="document" />Custos por escrito</li>
          </ul>
        </div>
        <AlmeidaSeal size={112} className={styles.heroSeal} />
      </section>

      <section className={styles.clauses} id="inventario" aria-labelledby="duvidas-inventario">
        <h2 id="duvidas-inventario">Três dúvidas que quase toda família tem sobre o inventário</h2>
        <div className={styles.clauseGrid}>{doubts.map((item, index) => <article key={item.title}>
          <span className={styles.clauseMark}>§ {index + 1}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>)}</div>
        <a className={styles.inkButton} href={talk}>Tirar minhas dúvidas</a>
      </section>

      {/* Brand signature: the estate drawn from the family's assets down to the heirs. */}
      <section className={styles.partition} id="partilha" aria-labelledby="partilha-titulo" data-almeida-partition>
        <div className={styles.partitionStage}>
          <div className={styles.partitionText}>
            <p className={styles.section}>Como funciona</p>
            <h2 id="partilha-titulo">A partilha, passo a passo.</h2>
            <ol className={styles.partitionSteps}>{partitionSteps.map((step, index) => <li key={step.title} data-partition-step>
              <span>{index + 1}</span><strong>{step.title}</strong><p>{step.text}</p>
            </li>)}</ol>
          </div>
          <figure className={styles.treeFigure}>
            <EstateTree className={styles.tree} />
          </figure>
        </div>
      </section>

      <section className={styles.index} id="atuacao" aria-labelledby="atuacao-titulo">
        <div className={styles.indexHead}>
          <p className={styles.section}>Áreas de atuação</p>
          <h2 id="atuacao-titulo">Cada família tem uma história. Cada patrimônio, um caminho.</h2>
        </div>
        <ol className={styles.indexList}>{areas.map((area, index) => <li key={area.title}>
          <details>
            <summary><span className={styles.indexNumber}>{["I", "II", "III", "IV"][index]}</span><span className={styles.indexTitle}>{area.title}</span><span className={styles.leader} aria-hidden="true" /><span className={styles.indexMore}>Ler</span></summary>
            <p>{area.text}</p>
          </details>
        </li>)}</ol>
      </section>

      <section className={styles.office} id="escritorio" aria-labelledby="escritorio-titulo">
        <figure className={styles.officePhoto}>
          <Image src="/images/models/patrimonio.webp" alt="Mesa de nogueira do escritório, com pastas de couro, estante de livros e luz da tarde" fill sizes="(max-width:900px) 92vw, 46vw" />
        </figure>
        <div className={styles.officeCopy}>
          <p className={styles.section}>Quem vai cuidar do seu processo</p>
          <h2 id="escritorio-titulo">Um escritório para um momento delicado.</h2>
          <p>A perda de alguém próximo já é difícil o bastante. Nosso trabalho é organizar o inventário com cuidado, explicar cada decisão e evitar que o processo se arraste por falta de informação.</p>
          <dl className={styles.values}>{values.map(value => <div key={value.title}><dt><ModelIcon name={value.icon} size={20} />{value.title}</dt><dd>{value.text}</dd></div>)}</dl>
          <a className={styles.inkButton} href={talk}>Começar pela primeira conversa</a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="faq-titulo">
        <h2 id="faq-titulo">O que as famílias mais perguntam</h2>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="almeida" />
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><AlmeidaSeal size={44} className={styles.logoSeal} />Almeida &amp; Valença Advocacia</p>
      <nav aria-label="Rodapé"><a href="#inventario">Inventário</a><a href="#partilha">A partilha</a><a href={talk}>Falar com a advogada</a></nav>
      <p className={styles.credit}>© 2026 Almeida &amp; Valença Advocacia. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
