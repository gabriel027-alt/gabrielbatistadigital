import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { previewVersion } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Arrow } from "@/components/ui/icons";
import { EditorialAvatarLoop } from "@/components/EditorialAvatarLoop";
import { EditorialMotion } from "@/components/EditorialMotion";
import { EditorialMedia } from "@/components/EditorialMedia";
import styles from "./editorial.module.css";

export const metadata: Metadata = { title: "Gabriel Batista | Design e desenvolvimento web", description: "Sites, páginas e experiências digitais com identidade e um caminho claro até o contato.", robots: { index: false, follow: false }, alternates: { canonical: "/propostas/portfolio-editorial" } };
const contact = buildWhatsAppUrl("Olá, Gabriel! Conheci seu portfólio e quero conversar sobre um projeto para meu negócio.");
const works = [
  { name: "Aura", sector: "Harmonização facial", image: "/images/projects/aura-film-poster.webp", film: "aura" as const },
  { name: "Orla", sector: "Residências", image: "/images/projects/orla-film-poster.jpg", film: "orla" as const },
  { name: "Vanguard", sector: "Arquitetura", image: `/images/screens/${previewVersion}/vanguard-desktop.webp`, href: "/conceitos/vanguard" },
  { name: "Entre", sector: "Psicologia", image: "/images/models/previews-branded/psicologia.webp", href: "/modelos/psicologia" },
  { name: "Chronos Atelier", sector: "Relojoaria", image: `/images/screens/${previewVersion}/chronos-atelier-desktop.webp`, href: "/conceitos/chronos-atelier" },
  { name: "Raiz", sector: "Direito do agro", image: "/images/models/previews-branded/agro.webp", href: "/modelos/agro" },
];
const rows = [
  { title: "Sites & landing pages", text: "A oferta, os serviços e o próximo passo. Uma estrutura pensada para quem chega ao seu negócio.", items: [works[2], works[0], works[3], works[1], works[4]] },
  { title: "Identidade na interface", text: "Tipografia, fotografia e composição trabalhando com a linguagem de cada marca.", items: [works[5], works[4], works[2], works[3], works[0]] },
  { title: "Movimento & interação", text: "O scroll revela os detalhes. As escolhas respondem. O visitante entende como continuar.", items: [works[1], works[3], works[0], works[5], works[2]] },
  { title: "Design & desenvolvimento", text: "Da composição ao navegador, com atenção à leitura, à navegação e ao uso em telas diferentes.", items: [works[4], works[2], works[5], works[1], works[3]] },
];

export default function EditorialPortfolio() {
  return <EditorialMotion>
    <a className={styles.skip} href="#editorial-main">Pular para o conteúdo</a>
    <header className={styles.nav} data-editorial-nav><a className={styles.logo} href="#editorial-start">Gabriel<span aria-hidden="true">•</span>Batista</a><nav aria-label="Navegação do portfólio"><a href="#editorial-about">Sobre</a><a href="#editorial-work">Projetos</a></nav><a className={styles.navContact} href={contact} target="_blank" rel="noopener noreferrer" data-cursor-label="Vamos conversar">Conversar <Arrow size={15}/></a></header>
    <main id="editorial-main">
      <section id="editorial-start" className={styles.hero} data-editorial-theme="photo">
        <div className={styles.heroPhoto} data-hero-photo><Image src="/images/hero/gabriel-approved-red-framed.webp" alt="Retrato frontal de Gabriel Batista com luz vermelha" fill preload sizes="(max-width:700px) 1800px, 100vw" /></div>
        <p className={styles.heroOffer} data-hero-offer>Design &<br/>desenvolvimento web</p>
        <div className={styles.heroBottom}><h1 data-hero-wordmark><span className={styles.sr}>Gabriel Batista</span><span aria-hidden="true">Gabriel</span><span className={styles.heroSample} data-hero-sample aria-hidden="true"><Image src="/images/projects/orla-film-poster.jpg" alt="" fill sizes="18vw" /></span><span aria-hidden="true">Batista</span></h1><p>Sites, páginas e experiências digitais</p></div>
      </section>
      <section className={styles.hook} data-editorial-theme="paper" data-hook>
        <h2 data-kinetic>Do primeiro olhar<br/>ao próximo <a href={contact} target="_blank" rel="noopener noreferrer" className={styles.clickWord} data-cursor-label="Começar um projeto">clique <Arrow size={42}/></a>.<br/>Cada detalhe conta.</h2>
        <div className={styles.shapes} aria-hidden="true"><div className={`${styles.orb} ${styles.orbOne}`} data-shape="-110"><span>+</span></div><div className={styles.pill} data-shape="80"/><div className={`${styles.orb} ${styles.orbTwo}`} data-shape="-75"/><div className={styles.cube} data-shape="110"><Arrow size={100}/></div><div className={styles.ribbon}/><i className={styles.dot}/><i className={styles.bluePill}/></div>
      </section>
      <section className={styles.services} data-editorial-theme="paper" aria-labelledby="editorial-services-title">
        <p className={styles.sectionNote}>O que podemos construir</p><h2 id="editorial-services-title" className={styles.servicesTitle} data-kinetic>Seu negócio tem uma história.<br/>Vamos dar forma a ela.</h2>
        {rows.map(row => <article key={row.title} className={styles.service}><div className={styles.serviceCopy}><h3>{row.title}</h3><p>{row.text}</p></div><div className={styles.samples} data-sample-row role="region" aria-label={`Exemplos de ${row.title}`} tabIndex={0}>{row.items.map((work, index) => <EditorialMedia key={`${work.name}-${index}`} name={work.name} image={work.image} film={work.film} href={work.href} compact />)}</div></article>)}
      </section>
      <section className={styles.work} data-editorial-theme="paper">
        <details id="editorial-work" className={styles.workFolder}>
          <summary><span className={styles.workWord} aria-hidden="true">Work</span><span className={styles.folderCaption}>Veja os projetos de perto.</span><span className={styles.folder} data-folder aria-hidden="true"><span className={styles.folderBack}/><span className={styles.folderSheet}>aura / orla / vanguard</span><span className={styles.folderFront}><span>gb</span></span></span><span className={styles.folderAction}>Abrir seleção <Arrow size={18}/></span></summary>
          <div className={styles.selectedGrid}>{works.map(work => <figure key={work.name}><EditorialMedia name={work.name} image={work.image} film={work.film} href={work.href}/><figcaption><h3>{work.name}</h3><span>{work.sector}</span></figcaption></figure>)}</div>
          <p className={styles.disclosure}>Projetos autorais de design e desenvolvimento. As marcas foram criadas para estes estudos.</p><Link href="/#modelos" className={styles.catalogLink}>Explorar o catálogo de 20 projetos <Arrow size={18}/></Link>
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
