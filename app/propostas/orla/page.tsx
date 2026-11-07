import { BrandInquiry } from "@/components/BrandInquiry";
import type { Metadata } from "next";
import Image from "next/image";
import { Arrow } from "@/components/ui/icons";
import { OrlaMotion } from "@/components/OrlaMotion";
import styles from "./orla.module.css";

export const metadata: Metadata = {
  title: "Orla | Residências",
  description: "Arquitetura, paisagem e espaço para viver. O olhar da Orla sobre o morar.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/propostas/orla" },
};

export default function OrlaPage() {
  return <div className={styles.page} id="orla-inicio" data-orla>
    <a className={styles.skip} href="#orla-conteudo">Pular para o conteúdo</a>
    <OrlaMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#orla-inicio" aria-label="Orla, início">orla<span>residências</span></a>
      <nav aria-label="Navegação Orla"><a href="#orla-percurso">Os espaços</a><a href="#orla-olhar">Nosso olhar</a><a href="#orla-interesse">Encontrar meu imóvel</a></nav>
    </header>
    <main id="orla-conteudo">
      <section className={styles.hero} data-orla-hero aria-labelledby="orla-title">
        <div className={styles.heroPhoto} data-orla-hero-photo><Image src="/images/models/imoveis.webp" alt="Arquitetura costeira, piscina e terraço voltados para o mar ao entardecer" fill sizes="(max-width:700px) 1700px, 100vw" preload /></div>
        <div className={styles.heroCopy} data-orla-hero-copy>
          <h1 id="orla-title">Uma casa.<br />Todo um horizonte.</h1>
          <p>Arquitetura que abre espaço<br />para a vida lá fora.</p>
        </div>
        <div className={styles.heroBottom}><p>Entre a casa<br />e a paisagem.</p><div className={styles.heroActions}><a className={styles.inquiryLink} href="#orla-interesse">Encontrar meu imóvel <Arrow size={18}/></a><a className={styles.explore} href="#orla-percurso">Conhecer os espaços <Arrow size={22} /></a></div></div>
      </section>
      <section className={styles.journey} id="orla-percurso" data-orla-journey aria-labelledby="orla-journey-title">
        <div className={styles.stage} data-orla-stage>
          <div className={styles.journeyHeading}><h2 id="orla-journey-title">O que faz você<br />querer ficar?</h2><div className={styles.journeyNav} data-orla-tabs hidden aria-label="Ir para uma fotografia"><button type="button" data-orla-jump="0">A paisagem</button><button type="button" data-orla-jump="1">O convívio</button></div></div>
          <div className={styles.galleryViewport}>
            <div className={styles.galleryRail} data-orla-rail>
              <figure className={styles.frame} id="orla-paisagem"><div className={styles.framePhoto}><Image src="/images/models/imoveis.webp" alt="Terraço aberto, materiais naturais e piscina que acompanha a linha do horizonte" fill sizes="(max-width: 700px) 800px, 78vw" /></div><figcaption><h3>A paisagem entra.</h3><p>O terraço prolonga a sala.<br />O mar amplia a vista.</p></figcaption></figure>
              <figure className={styles.frame} id="orla-convivio"><div className={styles.framePhoto}><Image src="/images/models/people/imoveis.webp" alt="Pessoas observam o mar de uma sala com grandes aberturas e materiais naturais" fill sizes="(max-width: 700px) 800px, 78vw" /></div><figcaption><h3>A vida ocupa.</h3><p>Luz, circulação e espaço<br />para estar junto.</p></figcaption></figure>
            </div>
          </div>
          <div className={styles.galleryFoot}><span>Arquitetura para habitar.</span><span className={styles.progress} aria-hidden="true"><i data-orla-progress /></span></div>
        </div>
      </section>
      <section className={styles.outlook} id="orla-olhar" aria-labelledby="orla-outlook-title">
        <p className={styles.outlookLabel}>O olhar Orla</p>
        <div><h2 id="orla-outlook-title">A vista chama.<br />A casa precisa<br />fazer sentido.</h2><p>A orientação da luz. A ligação entre os ambientes. O espaço para receber e para se recolher. É no encontro desses detalhes com a sua rotina que uma casa se torna uma escolha.</p><a href="#orla-percurso" className={styles.back}>Rever os espaços <Arrow size={22} /></a></div>
      </section>
      <BrandInquiry brand="orla" />
    </main>
    <footer className={styles.footer}><a href="#orla-inicio" aria-label="Orla, voltar ao início">orla</a><div><span>Entre a casa e a paisagem.</span><p>Estudo autoral. Imagens geradas.<br />Sem oferta de imóveis ou atendimento imobiliário.</p></div></footer>
  </div>;
}
