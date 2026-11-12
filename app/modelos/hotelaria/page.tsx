import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Karla, Marcellus } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { bookingSteps, chapters, faq, stays } from "@/lib/brisa";
import { BrisaMark } from "./BrisaMark";
import { BrisaTour } from "./BrisaTour";
import styles from "./brisa.module.css";

/** Marcellus: carved, lime-plaster capitals for the brand name and titles; Karla for reading. */
const display = Marcellus({ subsets: ["latin"], weight: ["400"], variable: "--brisa-display", display: "swap" });
const sans = Karla({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--brisa-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Casa Brisa | Hotel boutique entre a baía e o campo",
  description: "Uma casa branca de telhado de barro entre a baía e as oliveiras. Suítes, casa inteira e piscina, com reserva confirmada pela equipe.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/hotelaria" },
  openGraph: { title: "Casa Brisa", description: "Hotel boutique entre a baía e o campo.", url: "/modelos/hotelaria", images: [{ url: "/images/casa-brisa/casa.webp", width: 1280, height: 720, alt: "A Casa Brisa com a piscina ao entardecer" }] },
};

const book = "#brisa-interesse";
const stillAlt: Record<string, string> = {
  chegada: "Vista aérea da baía, das oliveiras e das casas brancas ao entardecer",
  fachada: "Fachada branca da Casa Brisa com a porta de madeira aberta",
  recepcao: "Recepção com balcão de madeira e luminárias de palha",
  suite: "Suíte com cama de linho e móveis de madeira",
  janela: "Janela da suíte aberta para o jardim de oliveiras",
  casa: "A casa inteira com a piscina e os montes ao entardecer",
};

export default function BrisaPage() {
  return <div className={`${styles.page} ${display.variable} ${sans.variable}`} data-model="brisa">
    <a className={styles.skip} href="#brisa-conteudo">Pular para o conteúdo</a>
    <BrisaTour />
    <header className={styles.header}>
      <a className={styles.logo} href="#brisa-inicio" aria-label="Casa Brisa, início"><BrisaMark size={26} />Casa Brisa</a>
      <nav aria-label="Navegação principal"><a href="#a-casa">A casa</a><a href="#estadias">Estadias</a><a href="#reserva">Reserva</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Reservar</a>
    </header>

    <main id="brisa-conteudo">
      {/* Brand signature: one continuous camera move, frame by frame with the scroll. */}
      <section className={styles.tour} id="brisa-inicio" aria-labelledby="brisa-titulo" data-brisa-tour>
        <div className={styles.stage} data-tour-stage>
          <Image className={styles.poster} src="/images/casa-brisa/chegada.webp" alt={stillAlt.chegada} fill sizes="100vw" preload />
          <canvas className={styles.canvas} data-tour-canvas aria-hidden="true" />
          <div className={styles.hero} data-tour-hero>
            <p className={styles.kicker}>Hotel boutique entre a baía e o campo</p>
            <h1 id="brisa-titulo">Casa Brisa</h1>
            <p className={styles.heroLine}>A chegada já é parte da estadia.</p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href={book}>Reservar estadia</a>
              <span className={styles.scrollHint} aria-hidden="true">Role para chegar</span>
            </div>
          </div>
          <ol className={styles.captions} aria-label="Capítulos do tour">
            {chapters.map(chapter => <li key={chapter.id} data-tour-caption><h2>{chapter.title}</h2><p>{chapter.text}</p></li>)}
          </ol>
          <nav className={styles.sunPath} aria-label="Ir para um capítulo do tour">
            <svg viewBox="0 0 200 100" aria-hidden="true" focusable="false">
              <path d="M16 92a84 76 0 0 1 168 0" fill="none" />
              <line x1="4" y1="92" x2="196" y2="92" />
              <circle data-tour-sun cx="16" cy="92" r="7" />
            </svg>
            <ol>{chapters.map(chapter => <li key={chapter.id}><button type="button" data-tour-mark>{chapter.id === "recepcao" ? "Recepção" : chapter.id === "suite" ? "Suíte" : chapter.id[0].toUpperCase() + chapter.id.slice(1)}</button></li>)}</ol>
          </nav>
        </div>
        {/* Without JS, with reduced motion or with the tour paused: one photograph per chapter. */}
        <ol className={styles.stills}>
          {chapters.slice(1).map(chapter => <li key={chapter.id}>
            <figure>
              <Image src={`/images/casa-brisa/${chapter.still}.webp`} alt={stillAlt[chapter.still]} width={1280} height={720} sizes="(max-width:900px) 100vw, 60vw" />
              <figcaption><h2>{chapter.title}</h2><p>{chapter.text}</p></figcaption>
            </figure>
          </li>)}
        </ol>
      </section>

      <section className={styles.house} id="a-casa" aria-labelledby="casa-titulo">
        <div className={styles.houseCopy}>
          <p className={styles.kicker}>A casa</p>
          <h2 id="casa-titulo">Poucas suítes, <em>tempo de sobra.</em></h2>
          <p>A Casa Brisa é uma casa de cal e telha de barro, cercada de oliveiras, com a baía a poucos minutos. Tem poucas suítes, para que cada hóspede seja recebido pelo nome.</p>
        </div>
        <ul className={styles.houseList}>
          <li><strong>Cal e madeira</strong><span>Paredes brancas, pisos de pedra e móveis de nogueira.</span></li>
          <li><strong>Jardim de oliveiras</strong><span>Gramado, palmeiras e sombra para a tarde inteira.</span></li>
          <li><strong>Piscina</strong><span>De frente para os montes, com o pôr do sol no fim do dia.</span></li>
        </ul>
      </section>

      <section className={styles.stays} id="estadias" aria-labelledby="estadias-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Estadias</p>
          <h2 id="estadias-titulo">Onde você quer <em>acordar?</em></h2>
        </div>
        <div className={styles.stayCards}>
          {stays.map(stay => <article key={stay.title} className={styles.stay}>
            <div className={styles.stayPhoto}><Image src={`/images/casa-brisa/${stay.still}.webp`} alt={stillAlt[stay.still]} fill sizes="(max-width:900px) 92vw, 30vw" /></div>
            <h3>{stay.title}</h3>
            <p>{stay.text}</p>
            <a className={styles.textLink} href={book}>Consultar datas</a>
          </article>)}
        </div>
      </section>

      <section className={styles.booking} id="reserva" aria-labelledby="reserva-titulo">
        <Image className={styles.bookingImage} src="/images/casa-brisa/casa.webp" alt="" fill sizes="100vw" />
        <div className={styles.bookingInner}>
          <h2 id="reserva-titulo">Como funciona <em>a reserva</em></h2>
          <ol>{bookingSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol>
          <a className={styles.primaryLight} href={book}>Começar minha reserva</a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Dúvidas frequentes</p>
          <h2 id="duvidas-titulo">Antes de vir, <em>o que saber.</em></h2>
        </div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="brisa" />
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><BrisaMark size={26} />Casa Brisa</p>
      <nav aria-label="Rodapé"><a href="#estadias">Estadias</a><a href="#reserva">Reserva</a><a href={book}>Reservar</a></nav>
      <p className={styles.credit}>© 2026 Casa Brisa. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
