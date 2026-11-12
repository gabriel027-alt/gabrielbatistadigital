import type { Metadata } from "next";
import Image from "next/image";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { linePath, shapes, transformOf, view, type ShapeId } from "@/lib/gb-shapes";
import { GbShape, GbShapeDefs } from "@/components/GbShape";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { brandKits } from "@/lib/brand-kits";
import { Arrow } from "@/components/ui/icons";
import { EditorialAvatarLoop } from "@/components/EditorialAvatarLoop";
import { EditorialMotion } from "@/components/EditorialMotion";
import { EditorialMedia } from "@/components/EditorialMedia";
import styles from "./editorial.module.css";

/** Monumental words (name, section titles, contact); Manrope stays for reading. Mono only for real brand data. */
// Variable width and weight: the hero name breathes between narrow and wide, as in the reference.
// latin-ext brings the dotless "ı": the red brand dot takes the place of the tittle on both i of the name.
const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], weight: "variable", axes: ["wdth", "opsz"], variable: "--gb-display", display: "swap" });
/** Draws a word of the name with a red tittle (the brand dot) over each "i". */
const nameWord = (text: string) => [...text].map((letter, index) => letter === "i" ? <span key={index} className={styles.iSlot}>ı<span className={styles.tittle} data-tittle /></span> : letter);
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--gb-mono", display: "swap" });

export const metadata: Metadata = { title: { absolute: "Gabriel Batista | Design e desenvolvimento web" }, description: "Sites, páginas e experiências digitais com identidade e um caminho claro até o contato.", alternates: { canonical: "/" } };
const contact = buildWhatsAppUrl("Olá, Gabriel! Conheci seu portfólio e quero conversar sobre um projeto para meu negócio.");
const sample = (id: string, view: "hero" | "cena") => `/images/projects/brands/${id}-${view}.webp`;
const kit = (id: string) => brandKits.find(item => item.id === id);

type Work = { name: string; sector: string; image: string; film?: "aura" | "orla"; href?: string; kit?: string };
const brands: Work[] = [
  { name: "Forma Odontologia", sector: "Odontologia estética", image: sample("forma", "hero"), href: "/modelos/odontologia", kit: "forma" },
  { name: "Sutil Cirurgia Plástica", sector: "Cirurgia plástica", image: sample("sutil", "hero"), href: "/modelos/cirurgia-plastica", kit: "sutil" },
  { name: "Toca Hospital Veterinário", sector: "Hospital veterinário", image: sample("toca", "hero"), href: "/modelos/veterinaria", kit: "toca" },
  { name: "Casa Brisa", sector: "Hotel boutique", image: sample("brisa", "hero"), href: "/modelos/hotelaria", kit: "brisa" },
  { name: "Almeida & Valença", sector: "Família e sucessões", image: sample("almeida", "hero"), href: "/modelos/patrimonio", kit: "almeida" },
];
const films: Work[] = [
  { name: "Aura", sector: "Harmonização facial", image: "/images/projects/aura-film-poster.webp", film: "aura" },
  { name: "Orla", sector: "Residências", image: "/images/projects/orla-film-poster.jpg", film: "orla" },
];
const works = [...films, ...brands];
const scene = (id: string, name: string, href: string): Work => ({ name, sector: "", image: sample(id, "cena"), href });
// Each service shows the projects that explain it best; no project image repeats across the rows.
const rows = [
  { title: "Sites & landing pages", text: "A oferta, os serviços e o próximo passo. Uma estrutura pensada para quem chega ao seu negócio.", items: [brands[0], brands[4], brands[2]] },
  { title: "Identidade na interface", text: "Tipografia, fotografia e composição trabalhando com a linguagem de cada marca.", items: [brands[1], brands[3], scene("forma", "Forma Odontologia", "/modelos/odontologia#planejamento")] },
  { title: "Movimento & interação", text: "O scroll revela os detalhes. As escolhas respondem. O visitante entende como continuar.", items: [scene("brisa", "Casa Brisa", "/modelos/hotelaria"), scene("toca", "Toca Hospital Veterinário", "/modelos/veterinaria#percurso"), scene("sutil", "Sutil Cirurgia Plástica", "/modelos/cirurgia-plastica#recuperacao")] },
  { title: "Design & desenvolvimento", text: "Da composição ao navegador, com atenção à leitura, à navegação e ao uso em telas diferentes.", items: [films[0], films[1], scene("almeida", "Almeida & Valença", "/modelos/patrimonio")] },
];
// Between the two words of the name: a peach card where "g." assembles in a loop (same story as the scroll scene).
// View box framed around the assembled letter; the stem is painted first so the bowl sits on top of it.
const cardView = "379 321 700 482";
const cardOrder: ShapeId[] = ["stem", "bowl", "hook", "dot"];
const cardParts = cardOrder.map(id => shapes.find(shape => shape.id === id)!);
// Paint order: the line passes behind the stem and in front of the rest.
const backShapes = shapes.filter(shape => shape.id === "stem");
const frontShapes = shapes.filter(shape => shape.id !== "stem");

export default function HomePage() {
  return <EditorialMotion className={`${display.variable} ${mono.variable}`}>
    <a className={styles.skip} href="#editorial-main">Pular para o conteúdo</a>
    <header className={styles.nav} data-editorial-nav><a className={styles.logo} href="#editorial-start">Gabriel<span aria-hidden="true">•</span>Batista</a><nav aria-label="Navegação do portfólio"><a href="#editorial-about">Sobre</a><a href="#editorial-work">Projetos</a><a className={styles.navWhats} href={contact} target="_blank" rel="noopener noreferrer">Conversar</a></nav><a className={styles.navContact} href={contact} target="_blank" rel="noopener noreferrer" data-cursor-label="Vamos conversar">Conversar <Arrow size={15}/></a></header>
    <svg className={styles.defs} aria-hidden="true" focusable="false"><GbShapeDefs /></svg>
    <main id="editorial-main">
      <section id="editorial-start" className={styles.hero} data-editorial-theme="photo">
        <div className={styles.heroPhoto} data-hero-photo><Image src="/images/hero/gabriel-approved-red-framed.webp" alt="Retrato frontal de Gabriel Batista com luz vermelha" fill preload sizes="(max-width:700px) 1800px, 100vw" /></div>
        <p className={styles.heroOffer} data-hero-offer>Design &<br/>desenvolvimento web</p>
        <div className={styles.heroBottom}><h1 data-hero-wordmark><span className={styles.sr}>Gabriel Batista</span><span aria-hidden="true" data-hero-word>{nameWord("Gabriel")}</span><span className={styles.heroSample} data-hero-sample aria-hidden="true"><span className={styles.heroCard} data-hero-card><svg viewBox={cardView}>{cardParts.map(shape => <g key={shape.id} transform={transformOf(shape.final)}><g data-card-part={shape.id}><GbShape id={shape.id} tone="dark" /></g></g>)}</svg></span></span><span aria-hidden="true" data-hero-word>{nameWord("Batista")}</span><span className={styles.heroDot} data-hero-dot aria-hidden="true" /></h1><p>Sites, páginas e experiências digitais</p></div>
      </section>
      <section className={styles.hook} data-editorial-theme="paper" data-hook>
        <h2 data-kinetic>Do primeiro olhar<br/>ao próximo <a href={contact} target="_blank" rel="noopener noreferrer" className={styles.clickWord} data-cursor-label="Começar um projeto">clique <Arrow size={42}/></a>.<br/>Cada detalhe conta.</h2>
        <div className={styles.shapesTrack} data-gb-track><div className={styles.shapes} data-gb-shapes aria-hidden="true"><svg viewBox={`0 0 ${view.w} ${view.h}`} preserveAspectRatio="xMidYMid slice">
          {backShapes.map(shape => <g key={shape.id} data-gb-shape={shape.id} transform={transformOf(shape.final)}><GbShape id={shape.id} /></g>)}
          <path className={styles.gbLine} data-gb-line d={linePath(shapes.map(shape => shape.final))} pathLength={1} />
          {frontShapes.map(shape => <g key={shape.id} data-gb-shape={shape.id} transform={transformOf(shape.final)}><GbShape id={shape.id} /></g>)}
        </svg></div></div>
      </section>
      <section className={styles.services} data-editorial-theme="paper" aria-labelledby="editorial-services-title">
        <p className={styles.sectionNote}>O que podemos construir</p><h2 id="editorial-services-title" className={styles.servicesTitle} data-kinetic>Seu negócio tem uma história.<br/>Vamos dar forma a ela.</h2>
        {rows.map(row => <article key={row.title} className={styles.service}><div className={styles.serviceCopy}><h3>{row.title}</h3><p>{row.text}</p></div><div className={styles.samples} data-sample-row role="region" aria-label={`Exemplos de ${row.title}`} tabIndex={0}>{row.items.map(work => <EditorialMedia key={work.image} name={work.name} image={work.image} film={work.film} href={work.href} compact />)}</div></article>)}
      </section>
      <section className={styles.work} data-editorial-theme="paper">
        <details id="editorial-work" className={styles.workFolder}>
          <summary><span className={styles.workWord} aria-hidden="true">Projetos</span><span className={styles.folderCaption}>Veja os projetos de perto.</span><span className={styles.folder} data-folder aria-hidden="true"><span className={styles.folderBack}/><span className={styles.folderSheet}>forma / sutil / toca / brisa</span><span className={styles.folderFront}><span>g.</span></span></span><span className={styles.folderAction}>Abrir seleção <Arrow size={18}/></span></summary>
          <div className={styles.selectedGrid}>{works.map(work => {
            const data = work.kit ? kit(work.kit) : undefined;
            return <figure key={work.name}><EditorialMedia name={work.name} image={work.image} film={work.film} href={work.href}/><figcaption><div><h3>{work.name}</h3><span>{work.sector}</span></div>
              {data && <dl className={styles.spec}><div><dt>Fonte</dt><dd>{data.typography.display}</dd></div><div><dt>Cores medidas nas fotos</dt><dd className={styles.swatches}>{Object.values(data.palette).map(hex => <span key={hex} style={{ background: hex }} title={hex}><i>{hex}</i></span>)}</dd></div></dl>}
            </figcaption></figure>;
          })}</div>
        </details>
      </section>
      <section className={styles.about} id="editorial-about" data-editorial-theme="photo" aria-labelledby="editorial-about-title">
        <div className={styles.aboutPhoto} data-about-photo><Image src="/images/hero/gabriel-approved-red.png" alt="Gabriel Batista" fill sizes="(max-width:700px) 1800px, 100vw" /></div>
        <div className={styles.aboutStatement}><h2 id="editorial-about-title" data-kinetic>Uma boa ideia<br/>precisa funcionar.</h2><p>No visual. No conteúdo. No uso.</p></div>
        <div className={styles.aboutPrinciples}><p>Sou Gabriel Batista.<br/>Cuido do design e do desenvolvimento do seu site.</p><h3>Um olhar.<br/>Do início ao fim.</h3><ul><li>Entender o negócio antes de desenhar a página.</li><li>Dar à marca uma linguagem própria.</li><li>Definir o papel de cada seção e de cada ação.</li><li>Conferir a experiência no navegador e no celular.</li></ul><a href={contact} target="_blank" rel="noopener noreferrer" className={styles.photoLink}>Conversar sobre meu projeto <Arrow size={22}/></a></div>
      </section>
      <section className={styles.contact} id="editorial-contact" data-editorial-theme="paper"><a data-contact-panel href={contact} target="_blank" rel="noopener noreferrer" data-cursor-label="Vamos conversar"><div><h2>O próximo projeto<br/>pode ser o seu.</h2><p>Conte sobre seu negócio e o que você precisa construir.</p></div><span className={styles.contactAction}><Arrow size={42}/><span>Vamos conversar</span></span></a></section>
    </main>
    <footer id="editorial-footer" className={styles.footer} data-editorial-theme="photo"><EditorialAvatarLoop/><div className={styles.footerTop}><p>Gabriel Batista Digital</p><div><span>Construído com</span><p>Next.js<br/>React<br/>GSAP<br/>Lenis</p></div></div><div className={styles.footerName} aria-hidden="true"><span>Gabriel</span><span>Batista</span></div><div className={styles.footerBottom}><span>Design e desenvolvimento web</span><a href="#editorial-start">Voltar ao início</a></div></footer>
  </EditorialMotion>;
}
