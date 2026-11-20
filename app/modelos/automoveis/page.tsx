import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sora, Unbounded } from "next/font/google";
import { Arrow } from "@/components/ui/icons";
import { chapters } from "@/lib/paddock";
import { PaddockTour } from "./PaddockTour";
import { PaddockStock } from "./PaddockStock";
import styles from "./paddock.module.css";
const display = Unbounded({ subsets: ["latin"], weight: ["500", "600"], variable: "--paddock-display", display: "swap" });
const body = Sora({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--paddock-body", display: "swap" });
export const metadata: Metadata = { title: "Paddock Automóveis", description: "A luz apresenta o carro. Do farol ao desenho inteiro, explore os detalhes e as carrocerias.", robots: { index: false, follow: true }, alternates: { canonical: "/modelos/automoveis" } };
function Mark(){return <svg width="31" height="32" viewBox="0 0 31 32" fill="none" aria-hidden="true"><path d="M3 29V3h18l7 7-7 7H10" stroke="currentColor" strokeWidth="3"/><path d="M10 29V10h11" stroke="currentColor" strokeWidth="2"/></svg>}
export default function PaddockPage(){return <div className={`${styles.page} ${display.variable} ${body.variable}`} data-model="paddock">
  <a className={styles.skip} href="#paddock-conteudo">Pular para o conteúdo</a><PaddockTour/>
  <header className={styles.header}><a href="#paddock-inicio" className={styles.logo} aria-label="Paddock Automóveis, início"><Mark/><span>Paddock<small>Automóveis</small></span></a><a href="#paddock-estoque">Explorar estoque <Arrow size={16}/></a></header>
  <main id="paddock-conteudo"><section id="paddock-inicio" className={styles.tour} data-paddock-tour aria-labelledby="paddock-titulo">
    <div className={styles.stage} data-tour-stage><picture><source media="(max-aspect-ratio: 4/5)" srcSet="/videos/paddock/m/0001.webp"/><Image className={styles.poster} src="/videos/paddock/d/0001.webp" alt="Detalhe do farol de um sedã grafite no escuro" fill sizes="100vw" preload/></picture><canvas className={styles.canvas} data-tour-canvas aria-hidden="true"/>
      <div className={styles.hero} data-tour-hero><p className={styles.eyebrow}>Paddock Automóveis</p><h1 id="paddock-titulo">A luz apresenta.</h1><p>Do farol ao desenho inteiro.</p><a href="#paddock-estoque" className={styles.primary}>Explorar estoque <Arrow size={18}/></a><p className={styles.hint}>Role para ver de perto ↓</p></div>
      <ol className={styles.captions} aria-label="Capítulos do tour">{chapters.map(ch => <li key={ch.id} data-tour-caption><h2>{ch.title}</h2><p>{ch.text}</p></li>)}</ol>
      <nav className={styles.marks} aria-label="Ir para um capítulo do tour">{chapters.map(ch => <button key={ch.id} data-tour-mark type="button">{ch.id === "farol" ? "Farol" : ch.id === "lateral" ? "Roda e lateral" : "Carro inteiro"}</button>)}</nav>
    </div>
    <ol className={styles.stills}>{chapters.map(ch => <li key={ch.id}><figure><Image src={`/videos/paddock/d/${String(ch.still).padStart(4,"0")}.webp`} alt={ch.text} width={1280} height={720} sizes="100vw"/><figcaption><h2>{ch.title}</h2><p>{ch.text}</p></figcaption></figure></li>)}</ol>
  </section><PaddockStock/></main>
  <footer className={styles.footer}><span className={styles.logo}><Mark/>Paddock</span><a href="#paddock-inicio">Voltar ao início ↑</a><p>© 2026 Paddock. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p></footer>
</div>;}
