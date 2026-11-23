import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Literata, Schibsted_Grotesk } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { Arrow } from "@/components/ui/icons";
import { before, faq, steps, team, treatments } from "@/lib/cerne";
import { CerneMark } from "./CerneMark";
import { CerneSigns } from "./CerneSigns";
import { CerneStickyCall } from "./CerneStickyCall";
import styles from "./cerne.module.css";

/** Schibsted Grotesk: firm, newspaper-like titles. Literata: a serif made for long reading, set large for readers of 50+. */
const display = Schibsted_Grotesk({ subsets: ["latin"], weight: ["500", "700", "800"], variable: "--cerne-display", display: "swap" });
const text = Literata({ subsets: ["latin"], weight: ["400", "600"], variable: "--cerne-text", display: "swap" });

export const metadata: Metadata = {
  title: "Cerne Implantes | Voltar a comer o que você gosta",
  description: "Implantes e prótese fixa para quem perdeu dentes ou usa prótese removível. Avaliação, plano por escrito e decisão no seu tempo.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/implantes" },
};

const book = "#cerne-interesse";
const photo = (name: string) => `/images/cerne/${name}.webp`;

/**
 * Cerne Implantes (docs/PROJETOS-ESTATICOS.md), the first static brand: no scene follows the scroll. The identity is
 * the bite (an arc with three teeth marks cut from a corner of the pictures and cards), the menu of treatments and
 * flash-lit table photography. No name, registration, numbers, testimonials, prices, deadlines or promise of outcome.
 */
export default function CernePage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="cerne" id="cerne-inicio">
    <a className={styles.skip} href="#cerne-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#cerne-inicio" aria-label="Cerne Implantes, início"><CerneMark size={30} /><span>Cerne<small>Implantes e reabilitação oral</small></span></a>
      <nav aria-label="Navegação principal"><a href="#antes-de-vir">Antes de vir</a><a href="#tratamentos">Tratamentos</a><a href="#como-funciona">Como funciona</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar avaliação</a>
    </header>

    <main id="cerne-conteudo">
      {/* The table seen from above, in a card with the bite cut from its lower right corner. */}
      <section className={styles.hero} aria-labelledby="cerne-titulo">
        <div className={`${styles.heroCard} ${styles.bite}`}>
          <div className={styles.heroMedia}><Image className={styles.heroPhoto} src={photo("mesa")} alt="Mesa de almoço vista de cima, com pão, salada, frutas e as mãos de um casal; ela segura um pão mordido" fill preload sizes="(max-width:700px) 180vw, 60vw" quality={88} /></div>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Implantes e reabilitação oral</p>
            <h1 id="cerne-titulo">Voltar a comer o que você gosta, com dentes fixos.</h1>
            <p className={styles.heroText}>Para quem perdeu dentes ou usa prótese removível. A primeira consulta começa por uma pergunta: o que você deixou de comer?</p>
            <div className={styles.heroCalls} data-cerne-hero-calls><a className={styles.primary} href={book}>Agendar uma avaliação <Arrow size={20} /></a><a className={styles.secondary} href="#tratamentos">Ver os tratamentos</a></div>
          </div>
        </div>
      </section>

      <section className={styles.before} id="antes-de-vir" aria-labelledby="antes-titulo">
        <h2 id="antes-titulo">Antes de vir, saiba como é.</h2>
        <ol>{before.map((item, i) => <li key={item.title}><span aria-hidden="true">{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      <section className={styles.signs} id="sinais" aria-labelledby="sinais-titulo">
        <div className={styles.signsHead}><h2 id="sinais-titulo">Isso acontece com você?</h2><p>Toque na frase que mais parece com o seu dia.</p></div>
        <div className={styles.signsGrid}>
          <CerneSigns />
          <figure className={`${styles.signsPhoto} ${styles.bite}`}><Image src={photo("mordida")} alt="Mulher de cerca de 60 anos mordendo uma maçã vermelha, em close do queixo e da boca" fill sizes="(max-width:700px) 100vw, 40vw" quality={88} /></figure>
        </div>
      </section>

      {/* The manifesto: what the treatment gives back is the table, not the tooth. */}
      <section className={styles.manifesto} aria-labelledby="mesa-titulo">
        <figure className={`${styles.manifestoPhoto} ${styles.biteTop}`}><Image src={photo("risada")} alt="Casal de cerca de 60 anos rindo num almoço de família; ela segura uma maçã mordida" fill sizes="(max-width:700px) 200vw, 100vw" quality={88} /></figure>
        <div className={styles.manifestoCopy}>
          <h2 id="mesa-titulo">Voltar à mesa.</h2>
          <p>O implante não é sobre o dente. É sobre o almoço de domingo, a maçã inteira e a risada sem a mão na frente da boca.</p>
          <a className={styles.primary} href={book}>Contar o que você quer voltar a comer <Arrow size={20} /></a>
        </div>
      </section>

      {/* Signature composition: the treatments as a menu, each one with what it gives back. */}
      <section className={styles.menu} id="tratamentos" aria-labelledby="tratamentos-titulo">
        <figure className={`${styles.menuPhoto} ${styles.bite}`}><Image src={photo("detalhe")} alt="Implante de titânio e coroa de cerâmica sobre um guardanapo de linho, ao lado de migalhas de pão" fill sizes="(max-width:700px) 100vw, 36vw" quality={88} /></figure>
        <div className={styles.menuBody}>
          <h2 id="tratamentos-titulo">O que dá para fazer</h2>
          <p className={styles.menuLead}>Cada tratamento, com o que ele devolve. O plano de cada pessoa sai da avaliação.</p>
          <ul className={styles.menuList}>{treatments.map(item => <li key={item.name}>
            <h3><span>{item.name}</span><i aria-hidden="true" /><em>{item.gives}</em></h3>
            <p>{item.text}</p>
          </li>)}</ul>
          <a className={styles.secondary} href={book}>Entender qual é o meu caso <Arrow size={18} /></a>
        </div>
      </section>

      <section className={styles.steps} id="como-funciona" aria-labelledby="como-titulo">
        <h2 id="como-titulo">Como funciona</h2>
        <ol>{steps.map((item, i) => <li key={item.title}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
      </section>

      <section className={styles.team} id="quem-recebe" aria-labelledby="equipe-titulo">
        <figure className={`${styles.teamPhoto} ${styles.bite}`}><Image src={photo("dentista")} alt="Dentista de jaleco segurando um modelo de arcada com quatro implantes e a prótese fixa" fill sizes="(max-width:700px) 100vw, 40vw" quality={88} /></figure>
        <div className={styles.teamBody}>
          <h2 id="equipe-titulo">O plano, explicado com o modelo na mão.</h2>
          <p>Na avaliação, o dentista mostra num modelo como os implantes seguram os dentes, o que muda no seu caso e o que fica igual. Você sai sabendo cada etapa.</p>
          <ul>{team.map(item => <li key={item.role}><strong>{item.role}</strong><span>{item.text}</span></li>)}</ul>
          <a className={styles.primary} href={book}>Agendar uma avaliação <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <h2 id="duvidas-titulo">Perguntas de quem está decidindo</h2>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="cerne" />
    </main>

    {/* On phones the call stays at the thumb (the Nova Odonto idea, as the brand's own journey). */}
    <CerneStickyCall href={book} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><CerneMark size={24} id="cerne-bite-rodape" />Cerne Implantes</p>
      <nav aria-label="Rodapé"><a href="#tratamentos">Tratamentos</a><a href="#como-funciona">Como funciona</a><a href={book}>Agendar avaliação</a></nav>
      <p className={styles.credit}>© 2026 Cerne Implantes. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
