import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Archivo, Instrument_Sans } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { StickyCall } from "@/components/brand/StickyCall";
import { WhoAnswers } from "@/components/brand/WhoAnswers";
import { Arrow } from "@/components/ui/icons";
import { areas, faq, moves, stairs, steps } from "@/lib/eixo";
import { EixoMark } from "./EixoMark";
import styles from "./eixo.module.css";

/** Archivo with its width axis: firm and technical titles. Instrument Sans for the text. A pair new to the portfolio. */
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--eixo-display", display: "swap" });
const text = Instrument_Sans({ subsets: ["latin"], variable: "--eixo-text", display: "swap" });

export const metadata: Metadata = {
  title: "Eixo Ortopedia | Joelho, quadril e coluna",
  description: "Ortopedia de joelho, quadril e coluna para quem quer voltar ao que deixou de fazer. O tratamento começa pelo degrau mais simples.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/ortopedia" },
};

const book = "#eixo-interesse";
const photo = (name: string) => `/images/eixo/${name}.webp`;

/**
 * Eixo (docs/PROJETOS-ESTATICOS.md), the fifth static brand: nothing depends on scroll or touch. The identity is the
 * ordinary movement in hard noon sun, the axis of the body and the treatment staircase. The reception answers.
 */
export default function EixoPage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="eixo" id="eixo-inicio">
    <a className={styles.skip} href="#eixo-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#eixo-inicio"><EixoMark size={36} /><span>Eixo<small>Ortopedia</small></span></a>
      <nav aria-label="Navegação principal"><a href="#o-que-ficou-dificil">O que ficou difícil</a><a href="#escada">Tratamentos</a><a href="#areas">Joelho, quadril e coluna</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar avaliação</a>
    </header>

    <main id="eixo-conteudo">
      {/* The staircase in hard noon sun; the words on the smooth concrete, left. */}
      <section className={styles.hero} aria-labelledby="eixo-titulo">
        <div className={styles.heroPhoto}><Image src={photo("escadaria")} alt="Uma mulher de cabelo grisalho e jaqueta azul sobe uma longa escadaria de concreto ao sol" fill preload sizes="(max-width:700px) 220vw, 100vw" quality={88} /></div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Ortopedia · joelho, quadril e coluna</p>
          <h1 id="eixo-titulo">Subir a escada <em>sem pensar nela.</em></h1>
          <p className={styles.heroText}>Para quem quer voltar ao que deixou de fazer. A avaliação começa pelo movimento, e o tratamento, pelo degrau mais simples.</p>
          <div className={styles.calls} data-hero-calls><a className={styles.primary} href={book}>Agendar avaliação <Arrow size={20} /></a><a className={styles.secondary} href="#escada">Ver os tratamentos</a></div>
          <WhoAnswers className={styles.who}>A recepção responde e marca a sua avaliação.</WhoAnswers>
        </div>
      </section>

      <section className={styles.moves} id="o-que-ficou-dificil" aria-labelledby="dificil-titulo">
        <figure className={styles.movesPhoto}><Image src={photo("tenis")} alt="Mãos amarrando o cadarço de um tênis branco, com o pé apoiado num degrau de concreto" fill sizes="(max-width:860px) 100vw, 38vw" quality={88} /></figure>
        <div>
          <div className={styles.sectionHead}><EixoMark size={34} /><h2 id="dificil-titulo">O que ficou difícil?</h2><p>Quase sempre começa por um movimento comum. Veja o que a avaliação olha em cada um.</p></div>
          <dl className={styles.moveList}>{moves.map(item => <div key={item.move}><dt>{item.move}<span>{item.region}</span></dt><dd>{item.look}</dd></div>)}</dl>
        </div>
      </section>

      <section className={styles.stairsSection} id="escada" aria-labelledby="escada-titulo">
        <div className={styles.sectionHead}><EixoMark size={34} /><h2 id="escada-titulo">Nem toda dor é cirurgia.</h2><p>O tratamento sobe um degrau de cada vez, do mais simples ao mais complexo. A avaliação diz em qual você começa.</p></div>
        <ol className={styles.stairs}>{stairs.map((item, i) => <li key={item.name} style={{ "--step": i } as React.CSSProperties}><span className={styles.stepNo}>Degrau {i + 1}</span><h3>{item.name}</h3><p>{item.text}</p></li>)}</ol>
        <a className={styles.primary} href={book}>Descobrir o meu degrau <Arrow size={20} /></a>
      </section>

      <section className={styles.areas} id="areas" aria-labelledby="areas-titulo">
        <div className={styles.areasCopy}>
          <h2 id="areas-titulo">Joelho, quadril e coluna.</h2>
          <ul className={styles.areaList}>{areas.map(area => <li key={area.id}><EixoMark size={46} lit={area.id} /><div><h3>{area.name}</h3><p>{area.text}</p></div></li>)}</ul>
        </div>
        <figure className={styles.areasPhoto}><Image src={photo("horta")} alt="A mesma mulher agachada numa horta, colhendo alface, diante de um muro de concreto" fill sizes="(max-width:860px) 100vw, 46vw" quality={88} /></figure>
      </section>

      <section className={styles.court} aria-labelledby="quadra-titulo">
        <figure className={styles.courtPhoto}><Image src={photo("quadra")} alt="A mesma mulher, de viseira azul, rebate a bola numa quadra de beach tennis" fill sizes="100vw" quality={88} /></figure>
        <div className={styles.courtCopy}>
          <h2 id="quadra-titulo">O objetivo é o que você deixou de fazer.</h2>
          <p>A escada, o jardim, a quadra. O plano é pensado para a sua rotina, e não só para o exame.</p>
        </div>
      </section>

      <section className={styles.steps} id="avaliacao" aria-labelledby="avaliacao-titulo">
        <div className={styles.sectionHead}><EixoMark size={34} /><h2 id="avaliacao-titulo">Como é a avaliação</h2></div>
        <ol className={styles.stepList}>{steps.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      <section className={styles.reception} id="recepcao" aria-labelledby="recepcao-titulo">
        <figure className={styles.receptionPhoto}><Image src={photo("recepcao")} alt="A recepcionista, de camisa azul, sorri ao atender o telefone atrás de um balcão de concreto e madeira" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <h2 id="recepcao-titulo">Quem responde é a recepção.</h2>
          <p>Ela responde às mensagens, marca a avaliação e explica como funciona o atendimento pelo seu convênio ou pelo reembolso.</p>
          <p>Na avaliação, quem examina é o ortopedista. Depois, a recepção marca os retornos e cada etapa do plano.</p>
          <a className={styles.primary} href={book}>Falar com a recepção <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.sectionHead}><EixoMark size={34} /><h2 id="duvidas-titulo">Dúvidas comuns</h2></div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="eixo" />
    </main>

    <StickyCall href={book} label="Agendar avaliação" className={styles.stickyCall} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><EixoMark size={24} />Eixo Ortopedia</p>
      <nav aria-label="Rodapé"><a href="#escada">Tratamentos</a><a href="#areas">Joelho, quadril e coluna</a><a href={book}>Agendar avaliação</a></nav>
      <p className={styles.credit}>© 2026 Eixo Ortopedia. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
