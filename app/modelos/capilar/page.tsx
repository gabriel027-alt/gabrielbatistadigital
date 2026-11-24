import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { StickyCall } from "@/components/brand/StickyCall";
import { Arrow } from "@/components/ui/icons";
import { after, before, doctor, faq, steps } from "@/lib/fio";
import { FioMark } from "./FioMark";
import { HeadMap } from "./HeadMap";
import styles from "./fio.module.css";

/** Space Grotesk: technical, masculine titles. IBM Plex Sans: plain, easy reading. A pair new to the portfolio. */
const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "700"], variable: "--fio-display", display: "swap" });
const text = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--fio-text", display: "swap" });

export const metadata: Metadata = {
  title: "Fio | Transplante capilar",
  description: "Transplante capilar quando a avaliação indica, e tratamento quando ele é o melhor caminho. Avaliação com Daniel Arruda, médico.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/capilar" },
};

const book = "#fio-interesse";
const photo = (name: string) => `/images/fio/${name}.webp`;
/** The front hairline: the curve of the mark, under titles and between sections (elemento-assinatura). */
const Line = () => <svg className={styles.line} viewBox="0 0 240 24" preserveAspectRatio="none" aria-hidden="true"><path d="M2 20 C20 6 50 4 80 12 C100 4 140 4 160 12 C190 4 220 6 238 20" /></svg>;

/**
 * Fio (docs/PROJETOS-ESTATICOS.md), the third static brand: no scene follows the scroll. The identity is the cold
 * backlight that draws the hair's outline, the front hairline as a line and the head map.
 */
export default function FioPage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="fio" id="fio-inicio">
    <a className={styles.skip} href="#fio-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#fio-inicio"><FioMark size={30} /><span>Fio<small>Transplante capilar</small></span></a>
      <nav aria-label="Navegação principal"><a href="#mapa">Onde incomoda</a><a href="#antes">Antes de operar</a><a href="#como-funciona">Como funciona</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar avaliação</a>
    </header>

    <main id="fio-conteudo">
      {/* The cap: a man in profile against a cold, overcast sky that draws the outline of his hair. */}
      <section className={styles.hero} aria-labelledby="fio-titulo">
        <div className={styles.heroPhoto}><Image src={photo("topo")} alt="Homem de perfil numa calçada em dia nublado, segurando o boné acima da cabeça" fill preload sizes="(max-width:700px) 200vw, 100vw" quality={88} /></div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Transplante capilar</p>
          <h1 id="fio-titulo">Tirar o boné sem pensar duas vezes.</h1>
          <Line />
          <p className={styles.heroText}>Transplante capilar quando a avaliação indica, e tratamento quando ele é o melhor caminho.</p>
          <div className={styles.calls} data-hero-calls><a className={styles.primary} href={book}>Agendar avaliação <Arrow size={20} /></a><a className={styles.secondary} href="#mapa">Ver onde incomoda</a></div>
          <a className={styles.who} href="#quem-atende"><Image src={photo("medico")} alt="" width={44} height={44} /><span>Avaliação com <strong>{doctor.name}</strong>, {doctor.role}</span></a>
        </div>
      </section>

      <section className={styles.mapSection} id="mapa" aria-labelledby="mapa-titulo">
        <div className={styles.sectionHead}><h2 id="mapa-titulo">Onde está incomodando?</h2><Line /><p>Escolha a área. Cada uma pede um olhar diferente na avaliação.</p></div>
        <HeadMap />
      </section>

      <section className={styles.wind} aria-labelledby="vento-titulo">
        <figure className={styles.windPhoto}><Image src={photo("vento")} alt="O mesmo homem dirigindo com a janela aberta e o vento no cabelo, sorrindo" fill sizes="(max-width:860px) 100vw, 58vw" quality={88} /></figure>
        <div className={styles.windCopy}>
          <h2 id="vento-titulo">A janela aberta, o vento, e nenhuma preocupação com o cabelo.</h2>
          <p>É disso que a gente fala na primeira conversa: dos momentos em que o cabelo pesa, e do que dá para fazer, com honestidade, no seu caso.</p>
        </div>
      </section>

      <section className={styles.before} id="antes" aria-labelledby="antes-titulo">
        <div className={styles.sectionHead}><h2 id="antes-titulo">Nem todo caso é cirurgia.</h2><Line /><p>Antes de indicar, três perguntas. Saber que a cirurgia ainda não é o caminho também é um resultado da avaliação.</p></div>
        <ol className={styles.beforeList}>{before.map((item, i) => <li key={item.title}><span aria-hidden="true">{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      <section className={styles.mirror} aria-labelledby="espelho-titulo">
        <div className={styles.mirrorCopy}>
          <h2 id="espelho-titulo">A técnica: FUE, fio a fio.</h2>
          <p>Os fios são retirados um a um da área doadora, na nuca e nas laterais, e implantados onde faltam, seguindo a direção natural do cabelo. A técnica e a área são definidas no planejamento, depois da avaliação.</p>
          <a className={styles.primary} href={book}>Saber se é o meu caso <Arrow size={20} /></a>
        </div>
        <figure className={styles.mirrorPhoto}><Image src={photo("espelho")} alt="O mesmo homem de costas, ajeitando o cabelo diante de um espelho redondo, com o boné pendurado na parede" fill sizes="(max-width:860px) 100vw, 50vw" quality={88} /></figure>
      </section>

      <section className={styles.steps} id="como-funciona" aria-labelledby="como-titulo">
        <div className={styles.sectionHead}><h2 id="como-titulo">Como funciona</h2><Line /></div>
        <ol>{steps.map((item, i) => <li key={item.title}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      <section className={styles.after} aria-labelledby="depois-titulo">
        <figure className={styles.afterPhoto}><Image src={photo("fios")} alt="Fios de cabelo em macro contra a luz, sobre um fundo cinza-azulado" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <h2 id="depois-titulo">Depois do procedimento</h2>
          <ul className={styles.afterList}>{after.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ul>
        </div>
      </section>

      <section className={styles.doctor} id="quem-atende" aria-labelledby="medico-titulo">
        <figure className={styles.doctorPhoto}><Image src={photo("medico")} alt="Daniel Arruda, médico, de jaleco, sobre fundo cinza-azulado" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <h2 id="medico-titulo">Uma conversa franca, sem rodeios.</h2>
          <p>Sou o {doctor.first}. Na avaliação, eu olho a área doadora, entendo como a sua queda está evoluindo e digo com franqueza o que dá para fazer agora, o que pode esperar e quando a cirurgia não é o caminho.</p>
          <p className={styles.reception}>A recepção responde às mensagens, marca a avaliação e envia as orientações antes da consulta.</p>
          <a className={styles.primary} href={book}>Agendar avaliação com o {doctor.first} <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.sectionHead}><h2 id="duvidas-titulo">Perguntas antes de decidir</h2><Line /></div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="fio" />
    </main>

    <StickyCall href={book} label="Agendar avaliação" className={styles.stickyCall} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><FioMark size={22} />Fio</p>
      <nav aria-label="Rodapé"><a href="#mapa">Onde incomoda</a><a href="#como-funciona">Como funciona</a><a href={book}>Agendar avaliação</a></nav>
      <p className={styles.credit}>© 2026 Fio. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
