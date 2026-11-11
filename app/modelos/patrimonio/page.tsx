import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { ModelIcon } from "@/components/ModelIcon";
import { areas, doubts, faq, inventorySteps, values } from "@/lib/almeida";
import styles from "./almeida.module.css";

/** High-contrast serif used by the reference legal sites, only for this firm's headings. */
const serif = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], weight: ["500", "600"], variable: "--almeida-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Almeida & Valença Advocacia | Inventário e planejamento sucessório",
  description: "Inventário em cartório ou judicial, planejamento sucessório, partilha e testamentos, com custos e etapas explicados desde a primeira conversa.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/patrimonio" },
  openGraph: { title: "Almeida & Valença Advocacia", description: "Inventário e planejamento sucessório.", url: "/modelos/patrimonio", images: [{ url: "/images/models/people/patrimonio.webp", width: 1600, height: 900, alt: "Advogada conversa com uma cliente em seu escritório" }] },
};

const talk = "#almeida-interesse";

export default function AlmeidaPage() {
  return <div className={`${styles.page} ${serif.variable}`} data-model="almeida">
    <a className={styles.skip} href="#almeida-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#almeida-inicio" aria-label="Almeida & Valença Advocacia, início"><span className={styles.monogram} aria-hidden="true">A<i>&amp;</i>V</span><span>Almeida &amp; Valença<small>Advocacia</small></span></a>
      <nav aria-label="Navegação principal"><a href="#inventario">Inventário</a><a href="#atuacao">Atuação</a><a href="#escritorio">O escritório</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={talk}>Falar com a advogada</a>
    </header>

    <main id="almeida-conteudo">
      <section className={styles.hero} id="almeida-inicio" aria-labelledby="almeida-titulo">
        <Image className={styles.heroImage} src="/images/models/people/patrimonio.webp" alt="Advogada conversa com uma cliente, em seu escritório com estante de livros e luminária dourada" fill sizes="100vw" preload />
        <svg className={styles.swoosh} viewBox="0 0 1440 800" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 760C420 700 760 520 980 40" /><path d="M-40 790C460 735 820 560 1040 40" /></svg>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Família e sucessões</p>
          <h1 id="almeida-titulo">Inventário e planejamento sucessório <em>conduzidos com clareza.</em></h1>
          <p>Orientamos famílias em inventários em cartório ou judiciais, partilhas e planejamento do patrimônio, com custos e etapas explicados desde a primeira conversa.</p>
          <div className={styles.heroActions}>
            <a className={styles.gold} href={talk}>Falar com a advogada</a>
            <a className={styles.lightLink} href="#inventario">Entender o inventário</a>
          </div>
          <ul className={styles.trust} aria-label="Como atendemos">
            <li><ModelIcon name="video" />Presencial e online</li>
            <li><ModelIcon name="scroll" />Cartório ou judicial</li>
            <li><ModelIcon name="document" />Custos por escrito</li>
          </ul>
        </div>
      </section>

      <section className={styles.doubts} id="inventario" aria-labelledby="duvidas-inventario">
        <h2 id="duvidas-inventario">Você está com dúvidas sobre <em>como funciona o inventário?</em></h2>
        <div className={styles.doubtGrid}>{doubts.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        <div className={styles.center}><a className={styles.navyButton} href={talk}>Tirar minhas dúvidas</a></div>
      </section>

      <section className={styles.areas} id="atuacao" aria-labelledby="atuacao-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Áreas de atuação</p>
          <h2 id="atuacao-titulo">Cada família tem uma história. <em>Cada patrimônio, um caminho.</em></h2>
        </div>
        <div className={styles.areaGrid}>{areas.map(area => <article key={area.title}><ModelIcon name={area.icon} size={30} /><h3>{area.title}</h3><p>{area.text}</p></article>)}</div>
      </section>

      <section className={styles.office} id="escritorio" aria-labelledby="escritorio-titulo">
        <figure className={styles.officePhoto}>
          <Image src="/images/models/patrimonio.webp" alt="Mesa de madeira do escritório, com pastas de couro, estante de livros e luz da tarde" fill sizes="(max-width:900px) 92vw, 44vw" />
          <figcaption className={styles.seal}><ModelIcon name="scale" size={26} />Atendimento individual e reservado</figcaption>
        </figure>
        <div className={styles.officeCopy}>
          <p className={styles.kicker}>Quem vai cuidar do seu processo</p>
          <h2 id="escritorio-titulo">Um escritório para <em>um momento delicado.</em></h2>
          <p>A perda de alguém próximo já é difícil o bastante. Nosso trabalho é organizar o inventário com cuidado, explicar cada decisão e evitar que o processo se arraste por falta de informação.</p>
          <ul className={styles.values}>{values.map(value => <li key={value.title}><span className={styles.valueIcon}><ModelIcon name={value.icon} size={20} /></span><div><strong>{value.title}</strong><span>{value.text}</span></div></li>)}</ul>
        </div>
      </section>

      <section className={styles.steps} aria-labelledby="passos-titulo">
        <div className={styles.centerHead}>
          <h2 id="passos-titulo">O passo a passo <em>de um inventário</em></h2>
          <p>Um caminho organizado, para que a família saiba o que esperar em cada etapa.</p>
        </div>
        <ol>{inventorySteps.map(step => <li key={step.title}><strong>{step.title}</strong><span>{step.text}</span></li>)}</ol>
        <div className={styles.center}><a className={styles.gold} href={talk}>Começar pela primeira conversa</a></div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="faq-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Perguntas frequentes</p>
          <h2 id="faq-titulo">O que as famílias <em>mais perguntam</em></h2>
        </div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="almeida" />
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><span className={styles.monogram} aria-hidden="true">A<i>&amp;</i>V</span>Almeida &amp; Valença Advocacia</p>
      <nav aria-label="Rodapé"><a href="#inventario">Inventário</a><a href="#atuacao">Atuação</a><a href={talk}>Falar com a advogada</a></nav>
      <p className={styles.credit}>Projeto conceitual de <Link href="/#modelos">Gabriel Batista Digital</Link>. Escritório, pessoas e imagens criados para esta demonstração; conteúdo informativo, sem promessa de resultado.</p>
    </footer>
  </div>;
}
