import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gilda_Display, Hanken_Grotesk } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { StickyCall } from "@/components/brand/StickyCall";
import { Arrow } from "@/components/ui/icons";
import { architect, faq, materials, steps } from "@/lib/vao";
import { RoutinePlan } from "./RoutinePlan";
import { VaoMark } from "./VaoMark";
import styles from "./vao.module.css";

/** Gilda Display: an architecture-poster serif for titles. Hanken Grotesk for the text. A pair new to the portfolio. */
const display = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--vao-display", display: "swap" });
const text = Hanken_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--vao-text", display: "swap" });

export const metadata: Metadata = {
  title: "Vão Arquitetura e Interiores",
  description: "Projetos de interiores e reformas para quem quer morar do próprio jeito. A casa começa pela rotina.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/arquitetura" },
};

const book = "#vao-interesse";
const photo = (name: string) => `/images/vao/${name}.webp`;
/** The material samples (elemento-assinatura) that open each section, like a materials board. */
const Samples = () => <span className={styles.samples} aria-hidden="true">{materials.map(m => <i key={m.name} style={{ background: m.tone }} />)}</span>;

/**
 * Vão (docs/PROJETOS-ESTATICOS.md), the sixth static brand: nothing follows the scroll. The identity is the home in
 * the low afternoon light, the opening of the mark, the material samples and the routine plan.
 */
export default function VaoPage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="vao" id="vao-inicio">
    <a className={styles.skip} href="#vao-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#vao-inicio"><VaoMark size={30} /><span>Vão<small>Arquitetura e interiores</small></span></a>
      <nav aria-label="Navegação principal"><a href="#rotina">A rotina</a><a href="#materiais">Materiais</a><a href="#como-funciona">Como funciona</a><a href="#arquiteta">Quem desenha</a></nav>
      <a className={styles.headerCta} href={book}>Agendar conversa</a>
    </header>

    <main id="vao-conteudo">
      {/* The living room in the afternoon light; the words on the plaster, left. */}
      <section className={styles.hero} aria-labelledby="vao-titulo">
        <div className={styles.heroPhoto}><Image src={photo("sala")} alt="Sala de estar com piso de travertino, painel de madeira, sofá de linho e uma poltrona mostarda, na luz baixa da tarde" fill preload sizes="(max-width:700px) 200vw, 100vw" quality={88} /></div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Arquitetura e interiores</p>
          <h1 id="vao-titulo">A casa começa <em>pela rotina.</em></h1>
          <p className={styles.heroText}>Projetos de interiores e reformas para quem quer morar do próprio jeito. O primeiro passo é uma conversa sobre o seu dia.</p>
          <div className={styles.calls} data-hero-calls><a className={styles.primary} href={book}>Agendar a primeira conversa <Arrow size={20} /></a><a className={styles.secondary} href="#rotina">Ver a planta da rotina</a></div>
          <a className={styles.who} href="#arquiteta"><Image src={photo("clara")} alt="" width={44} height={44} /><span>Primeira conversa com <strong>a {architect.role} da Vão</strong></span></a>
        </div>
      </section>

      <section className={styles.routine} id="rotina" aria-labelledby="rotina-titulo">
        <div className={styles.sectionHead}><Samples /><h2 id="rotina-titulo">Antes do acabamento, o seu dia.</h2><p>Na planta, cada ambiente leva um momento da rotina em vez do nome do cômodo. Ao lado, o que o projeto resolve em cada um.</p></div>
        <RoutinePlan />
      </section>

      <section className={styles.rooms} aria-labelledby="ambientes-titulo">
        <h2 id="ambientes-titulo" className={styles.roomsTitle}>Cada ambiente com o seu porquê.</h2>
        <figure className={styles.room}>
          <div className={styles.roomPhoto}><Image src={photo("cozinha")} alt="Cozinha com ilha de travertino e armários de madeira; ao fundo, uma mulher de costas prepara café" fill sizes="(max-width:860px) 100vw, 60vw" quality={88} /></div>
          <figcaption><h3>A cozinha</h3><p>A ilha é o centro da casa: café de manhã, conversa à noite. Os armários sem puxadores deixam a madeira falar.</p></figcaption>
        </figure>
        <figure className={`${styles.room} ${styles.roomFlip}`}>
          <div className={styles.roomPhoto}><Image src={photo("quarto")} alt="Quarto com cama de linho, cabeceira de madeira, poltrona mostarda e luminária de piso, na luz da tarde" fill sizes="(max-width:860px) 100vw, 60vw" quality={88} /></div>
          <figcaption><h3>O quarto</h3><p>Pouca coisa, cada uma no lugar: a poltrona perto da janela, a luz de leitura e o armário inteiro numa parede.</p></figcaption>
        </figure>
      </section>

      <section className={styles.board} id="materiais" aria-labelledby="materiais-titulo">
        <figure className={styles.boardPhoto}><Image src={photo("materiais")} alt="Vista de cima de amostras de madeira, travertino, linho, tecido mostarda e cal ao lado de uma planta desenhada a lápis" fill sizes="(max-width:860px) 100vw, 42vw" quality={88} /></figure>
        <div>
          <div className={styles.sectionHead}><Samples /><h2 id="materiais-titulo">Poucos materiais, escolhidos pelo uso.</h2></div>
          <ul className={styles.materialList}>{materials.map(m => <li key={m.name}><i style={{ background: m.tone }} aria-hidden="true" /><div><h3>{m.name}</h3><p>{m.text}</p></div></li>)}</ul>
        </div>
      </section>

      <section className={styles.steps} id="como-funciona" aria-labelledby="como-titulo">
        <div className={styles.sectionHead}><Samples /><h2 id="como-titulo">Do primeiro café à obra pronta.</h2><p>Cinco etapas, cada uma decidida com você antes da próxima.</p></div>
        <ol className={styles.stepList}>{steps.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
        <a className={styles.primary} href={book}>Começar pela conversa <Arrow size={20} /></a>
      </section>

      <section className={styles.architect} id="arquiteta" aria-labelledby="arquiteta-titulo">
        <figure className={styles.architectPhoto}><Image src={photo("clara")} alt="A arquiteta da Vão, em pé junto a uma mesa com plantas e amostras de material" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <h2 id="arquiteta-titulo">Quem desenha a sua casa.</h2>
          <p>Sou arquiteta. Começo perguntando como você vive, não o que está na moda. Desenho cada ambiente a partir disso, e você acompanha cada decisão antes de ela virar obra.</p>
          <p className={styles.note}>A própria arquiteta responde às mensagens e marca a primeira conversa.</p>
          <a className={styles.primary} href={book}>Conversar com a {architect.role} <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.sectionHead}><Samples /><h2 id="duvidas-titulo">Perguntas antes de começar</h2></div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="vao" />
    </main>

    <StickyCall href={book} label="Agendar conversa" className={styles.stickyCall} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><VaoMark size={24} />Vão Arquitetura e Interiores</p>
      <nav aria-label="Rodapé"><a href="#rotina">A rotina</a><a href="#materiais">Materiais</a><a href={book}>Agendar conversa</a></nav>
      <p className={styles.credit}>© 2026 Vão Arquitetura e Interiores. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
