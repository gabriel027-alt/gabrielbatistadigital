import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { StickyCall } from "@/components/brand/StickyCall";
import { Arrow } from "@/components/ui/icons";
import { doctor, exams, faq, moments, steps, techniques } from "@/lib/nitida";
import { FocusPhoto } from "./FocusPhoto";
import { NitidaMark } from "./NitidaMark";
import styles from "./nitida.module.css";

/** Red Hat Display and Text: one family drawn for legibility at small and large sizes, which is the whole subject. */
const display = Red_Hat_Display({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--nitida-display", display: "swap" });
const text = Red_Hat_Text({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--nitida-text", display: "swap" });

export const metadata: Metadata = {
  title: "Nítida | Cirurgia refrativa",
  description: "Cirurgia refrativa para reduzir ou eliminar a dependência dos óculos, quando os exames indicam. Avaliação com Beatriz Sallum, oftalmologista.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/oftalmologia" },
};

const book = "#nitida-interesse";
const photo = (name: string) => `/images/nitida/${name}.webp`;

/** A title set like the rows of an eye chart: each line a little smaller than the one above (elemento-assinatura). */
function Chart({ lines, id, as: Tag = "h2" }: { lines: string[]; id: string; as?: "h1" | "h2" }) {
  return <Tag id={id} className={styles.chart} aria-label={lines.join(" ")}>{lines.map((line, i) => <span key={line} aria-hidden="true" data-row={i}>{line}</span>)}</Tag>;
}

/**
 * Nítida (docs/PROJETOS-ESTATICOS.md), the second static brand: no scene follows the scroll. The identity is the
 * first-person photography in high-key light, the eye-chart titles and the focus at a touch.
 */
export default function NitidaPage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="nitida" id="nitida-inicio">
    <a className={styles.skip} href="#nitida-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#nitida-inicio"><NitidaMark size={28} /><span>Nítida<small>Cirurgia refrativa</small></span></a>
      <nav aria-label="Navegação principal"><a href="#quando">Quando atrapalha</a><a href="#antes">Antes de operar</a><a href="#tecnicas">Técnicas</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar avaliação</a>
    </header>

    <main id="nitida-conteudo">
      {/* First person: waking up, the clock and the glasses on the bedside table. The picture comes into focus on arrival. */}
      <section className={styles.hero} aria-labelledby="nitida-titulo">
        <div className={styles.heroPhoto}><Image src={photo("topo")} alt="Visto de quem acorda: um despertador marcando sete horas e um óculos dobrado sobre a mesinha de cabeceira branca" fill preload sizes="100vw" quality={88} /></div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Cirurgia refrativa</p>
          <Chart as="h1" id="nitida-titulo" lines={["Acordar", "e já ver", "as horas."]} />
          <p className={styles.heroText}>Para reduzir ou eliminar a dependência dos óculos, quando os exames indicam. Nem todo olho pode operar, e a avaliação diz.</p>
          <div className={styles.calls} data-hero-calls><a className={styles.primary} href={book}>Agendar avaliação <Arrow size={20} /></a><a className={styles.secondary} href="#antes">Ver se é o meu caso</a></div>
          <a className={styles.who} href="#quem-atende"><Image src={photo("medica")} alt="" width={44} height={44} /><span>Avaliação com <strong>{doctor.name}</strong>, {doctor.role}</span></a>
        </div>
      </section>

      <section className={styles.moments} id="quando" aria-labelledby="quando-titulo">
        <div className={styles.momentsHead}>
          <Chart id="quando-titulo" lines={["Quando", "o óculos", "atrapalha?"]} />
          <FocusPhoto className={styles.momentsPhoto} src={photo("mergulho")} alt="Homem saindo da água de uma piscina, de olhos abertos e rindo" sizes="(max-width:860px) 100vw, 44vw" />
        </div>
        <ol className={styles.momentList}>{moments.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      {/* Before any indication: what the evaluation looks at. "Not a candidate" is an answer too. */}
      <section className={styles.exams} id="antes" aria-labelledby="antes-titulo">
        <FocusPhoto className={styles.irisPhoto} src={photo("iris")} alt="Olho castanho em close, com a íris nítida e o reflexo de um anel de luz" sizes="(max-width:860px) 100vw, 40vw" />
        <div>
          <Chart id="antes-titulo" lines={["Nem todo olho", "pode operar,", "e a avaliação diz."]} />
          <p className={styles.lead}>Antes de qualquer indicação, quatro coisas são olhadas com cuidado. Saber que o seu olho não é candidato também é um resultado da avaliação.</p>
          <ul className={styles.examList}>{exams.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ul>
          <a className={styles.primary} href={book}>Fazer a avaliação <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.techniques} id="tecnicas" aria-labelledby="tecnicas-titulo">
        <Chart id="tecnicas-titulo" lines={["Três técnicas,", "uma escolha", "pelos exames."]} />
        <ul>{techniques.map(item => <li key={item.name}><h3>{item.name}</h3><p>{item.text}</p></li>)}</ul>
        <p className={styles.note}>A técnica certa depende do grau, da córnea e da sua rotina. A Beatriz explica a indicação e o porquê.</p>
      </section>

      <section className={styles.drawer} aria-labelledby="gaveta-titulo">
        <figure className={styles.drawerPhoto}><Image src={photo("gaveta")} alt="Gaveta aberta com vários óculos de grau antigos, estojos e um paninho de limpeza" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div className={styles.drawerCopy}>
          <h2 id="gaveta-titulo">A gaveta de óculos conta uma história.</h2>
          <p>Cada armação é um grau que mudou, uma lente que arranhou, um par reserva para não ficar sem. A avaliação começa por essa história: há quanto tempo, quanto mudou e o que mais atrapalha hoje.</p>
        </div>
      </section>

      <section className={styles.steps} id="como-funciona" aria-labelledby="como-titulo">
        <h2 id="como-titulo">Como funciona</h2>
        <ol>{steps.map((item, i) => <li key={item.title}><span aria-hidden="true">{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      <section className={styles.doctor} id="quem-atende" aria-labelledby="medica-titulo">
        <figure className={styles.doctorPhoto}><Image src={photo("medica")} alt="Beatriz Sallum, oftalmologista, de jaleco, ao lado do aparelho de exame" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <h2 id="medica-titulo">Quem examina é quem explica.</h2>
          <p>Sou a {doctor.first}. Na avaliação, eu mostro os exames na tela, explico o que cada um diz sobre o seu olho e digo com clareza se a cirurgia é indicada. Quando não é, explico por quê.</p>
          <p className={styles.reception}>A recepção responde às mensagens, marca a avaliação e orienta a pausa da lente de contato antes dos exames.</p>
          <a className={styles.primary} href={book}>Agendar avaliação com a {doctor.first} <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <h2 id="duvidas-titulo">Perguntas antes de decidir</h2>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="nitida" />
    </main>

    <StickyCall href={book} label="Agendar avaliação" className={styles.stickyCall} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><NitidaMark size={22} />Nítida</p>
      <nav aria-label="Rodapé"><a href="#tecnicas">Técnicas</a><a href="#como-funciona">Como funciona</a><a href={book}>Agendar avaliação</a></nav>
      <p className={styles.credit}>© 2026 Nítida. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
