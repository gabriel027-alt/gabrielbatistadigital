import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mulish, Prata } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { StickyCall } from "@/components/brand/StickyCall";
import { WhoAnswers } from "@/components/brand/WhoAnswers";
import { Arrow } from "@/components/ui/icons";
import { faq, pieces, stages } from "@/lib/lavra";
import { LavraMark } from "./LavraMark";
import styles from "./lavra.module.css";

/** Prata: a high-contrast serif with an engraved feel, for titles. Mulish for the text. A pair new to the portfolio. */
const display = Prata({ subsets: ["latin"], weight: "400", variable: "--lavra-display", display: "swap" });
const text = Mulish({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--lavra-text", display: "swap" });

export const metadata: Metadata = {
  title: "Lavra Joalheria | Alianças e joias sob medida",
  description: "Alianças, anéis de noivado e joias de família desenhados e feitos à mão para quem vai usar. Toda joia começa por uma história.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/joalheria" },
};

const book = "#lavra-interesse";
const photo = (name: string) => `/images/lavra/${name}.webp`;
/** The ring of the mark over each section (elemento-assinatura). */
const Ring = () => <span className={styles.ring} aria-hidden="true"><LavraMark size={18} /></span>;

/**
 * Lavra (docs/PROJETOS-ESTATICOS.md), the seventh static brand: nothing follows the scroll. The identity is the single
 * bench lamp over dark wood, the ring of the mark and the path from drawing to piece. The atelier answers.
 */
export default function LavraPage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="lavra" id="lavra-inicio">
    <a className={styles.skip} href="#lavra-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#lavra-inicio"><LavraMark size={22} /><span>Lavra<small>Joalheria sob medida</small></span></a>
      <nav aria-label="Navegação principal"><a href="#pecas">O que fazemos</a><a href="#processo">Do desenho à peça</a><a href="#atelie">O ateliê</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar conversa</a>
    </header>

    <main id="lavra-conteudo">
      {/* The hands at the bench under the lamp; the words in the dark, left. */}
      <section className={styles.hero} aria-labelledby="lavra-titulo">
        <div className={styles.heroPhoto}><Image src={photo("bancada")} alt="Mãos de um ourives seguram com uma pinça uma aliança de ouro sob a lâmpada da bancada" fill preload sizes="(max-width:700px) 200vw, 100vw" quality={88} /></div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Joalheria sob medida</p>
          <h1 id="lavra-titulo">Toda joia começa <em>por uma história.</em></h1>
          <p className={styles.heroText}>Alianças, anéis de noivado e joias de família desenhados e feitos à mão para quem vai usar. O primeiro passo é contar a sua.</p>
          <div className={styles.calls} data-hero-calls><a className={styles.primary} href={book}>Agendar uma conversa no ateliê <Arrow size={20} /></a><a className={styles.secondary} href="#processo">Ver como é feita</a></div>
          <WhoAnswers className={styles.who}>O ateliê responde e marca a sua conversa.</WhoAnswers>
        </div>
      </section>

      <section className={styles.pieces} id="pecas" aria-labelledby="pecas-titulo">
        <div className={styles.sectionHead}><Ring /><h2 id="pecas-titulo">O que pode nascer na bancada.</h2><p>Cada peça é desenhada para uma pessoa e uma história. Nada sai de vitrine.</p></div>
        <ul className={styles.pieceList}>{pieces.map(item => <li key={item.name}><LavraMark size={16} /><h3>{item.name}</h3><p>{item.text}</p></li>)}</ul>
      </section>

      <section className={styles.process} id="processo" aria-labelledby="processo-titulo">
        <div className={styles.sectionHead}><Ring /><h2 id="processo-titulo">Do desenho à peça.</h2><p>Quatro etapas, e em cada uma você vê a peça e decide antes da próxima.</p></div>
        <ol className={styles.stages}>{stages.map((stage, i) => <li key={stage.id}>
          <div className={styles.stagePhoto}><Image src={photo(stage.photo)} alt="" fill sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 25vw" quality={85} style={{ objectPosition: stage.position, transform: "zoom" in stage ? `scale(${stage.zoom})` : undefined, transformOrigin: stage.position }} /></div>
          <span className={styles.stageNo} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
          <h3>{stage.name}</h3><p>{stage.text}</p>
        </li>)}</ol>
        <a className={styles.primary} href={book}>Começar pela sua história <Arrow size={20} /></a>
      </section>

      <section className={styles.proof} aria-labelledby="prova-titulo">
        <figure className={styles.proofPhoto}><Image src={photo("aliancas")} alt="As mãos de um casal sobre a bancada, com alianças de ouro; uma das mãos ajusta a aliança no dedo da outra" fill sizes="100vw" quality={88} /></figure>
        <div className={styles.proofCopy}>
          <h2 id="prova-titulo">A última palavra é da sua mão.</h2>
          <p>Antes do brilho final, você prova a peça. O ajuste é feito na bancada, até ela ficar como deve ficar.</p>
        </div>
      </section>

      <section className={styles.atelier} id="atelie" aria-labelledby="atelie-titulo">
        <figure className={styles.atelierPhoto}><Image src={photo("atelie")} alt="A bancada do ateliê com ferramentas penduradas na parede e uma pessoa de costas trabalhando sob a lâmpada" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <Ring />
          <h2 id="atelie-titulo">Quem responde é o ateliê.</h2>
          <p>A equipe do ateliê responde às mensagens, marca a primeira conversa e acompanha cada etapa com você, do desenho à entrega.</p>
          <p>Cada peça passa pela mesma bancada, com as mesmas mãos, do começo ao fim.</p>
          <a className={styles.primary} href={book}>Falar com o ateliê <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.sectionHead}><Ring /><h2 id="duvidas-titulo">Perguntas antes de começar</h2></div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="lavra" />
    </main>

    <StickyCall href={book} label="Agendar conversa" className={styles.stickyCall} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><LavraMark size={18} />Lavra Joalheria</p>
      <nav aria-label="Rodapé"><a href="#processo">Do desenho à peça</a><a href="#atelie">O ateliê</a><a href={book}>Agendar conversa</a></nav>
      <p className={styles.credit}>© 2026 Lavra Joalheria. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
