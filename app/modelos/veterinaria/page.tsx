import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DM_Sans, Fraunces } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { ModelIcon } from "@/components/ModelIcon";
import { faq, features, firstVisit, heroText, lifeStages, rooms, specialties } from "@/lib/toca";
import { SpeciesSwitch } from "./SpeciesSwitch";
import { TocaMark } from "./TocaMark";
import { TocaMotion } from "./TocaMotion";
import styles from "./toca.module.css";

/** Fraunces: a soft, warm serif with a true italic; DM Sans for reading. */
const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"], variable: "--toca-display", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--toca-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Toca Hospital Veterinário | Cães e gatos, da consulta à internação",
  description: "Hospital veterinário para cães e gatos: consulta, exames, cirurgia e internação, com espera separada para gatos.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/veterinaria" },
};

const book = "#toca-interesse";

export default function TocaPage() {
  return <div className={`${styles.page} ${display.variable} ${sans.variable}`} data-model="toca" data-species="cao">
    <a className={styles.skip} href="#toca-conteudo">Pular para o conteúdo</a>
    <TocaMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#toca-inicio" aria-label="Toca Hospital Veterinário, início"><TocaMark size={32} /><span>Toca<small>Hospital veterinário</small></span></a>
      <nav aria-label="Navegação principal"><a href="#percurso">O hospital</a><a href="#especialidades">Especialidades</a><a href="#veterinaria">A veterinária</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar consulta</a>
    </header>

    <main id="toca-conteudo">
      <section className={styles.hero} id="toca-inicio" aria-labelledby="toca-titulo">
        <Image className={styles.heroImage} data-only="cao" src="/images/toca/hero-cao.webp" alt="Veterinária ajoelhada no chão acaricia um cão caramelo" fill sizes="100vw" preload />
        <Image className={styles.heroImage} data-only="gato" src="/images/toca/hero-gato.webp" alt="Veterinária sentada no chão com um gato cinza no colo, sobre uma manta mostarda" fill sizes="100vw" />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Hospital veterinário para cães e gatos</p>
          <h1 id="toca-titulo">O cuidado começa <em>na altura deles.</em></h1>
          <p data-only="cao">{heroText.cao}</p>
          <p data-only="gato">{heroText.gato}</p>
          <SpeciesSwitch />
          <div className={styles.heroActions}>
            <a className={styles.primary} href={book}>Agendar uma consulta</a>
            <a className={styles.textLink} href="#percurso">Conhecer o hospital</a>
          </div>
          <ul className={styles.trust} aria-label="Como atendemos">
            <li><ModelIcon name="heart" />Manejo calmo</li>
            <li><ModelIcon name="home" />Espera separada para gatos</li>
            <li><ModelIcon name="document" />Plano explicado</li>
          </ul>
        </div>
      </section>

      <section className={styles.features} aria-labelledby="diferenciais-titulo">
        <h2 id="diferenciais-titulo">Como cuidamos de quem chega</h2>
        <ul>{features.map(item => <li key={item.title}><ModelIcon name={item.icon} /><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>
      </section>

      {/* Brand signature: the route through the hospital, door by door. */}
      <section className={styles.route} id="percurso" aria-labelledby="percurso-titulo" data-toca-route>
        <div className={styles.routeStage}>
          {rooms.map(room => <figure key={room.id} className={styles.room} data-route-room>
            <Image src={`/images/toca/${room.image}.webp`} alt={room.alt} fill sizes="100vw" />
            <figcaption className={styles.caption} data-route-caption>
              <span className={styles.plate}>{room.number}</span>
              <h3>{room.name}</h3>
              <p data-only="cao">{room.text.cao}</p>
              <p data-only="gato">{room.text.gato}</p>
            </figcaption>
          </figure>)}
          <div className={styles.doors} aria-hidden="true">
            <div className={styles.door} data-door="left">
              {rooms.map(room => <span key={room.id} className={styles.doorSign} data-door-sign><b>{room.number}</b>{room.name}</span>)}
            </div>
            <div className={styles.door} data-door="right" />
          </div>
          <div className={styles.wayfinding}>
            <h2 className={styles.wayTitle} id="percurso-titulo">O percurso</h2>
            <ol>{rooms.map(room => <li key={room.id} data-route-mark><b>{room.number}</b>{room.name}</li>)}</ol>
          </div>
        </div>
      </section>

      <section className={styles.specialties} id="especialidades" aria-labelledby="especialidades-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Especialidades</p>
          <h2 id="especialidades-titulo">Do check-up à cirurgia, <em>no mesmo lugar.</em></h2>
        </div>
        <ol className={styles.wings}>
          {specialties.map((item, index) => <li key={item.id} data-specialty={item.id}>
            <span className={styles.plate}>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.name}</h3>
            <p>{item.text}</p>
          </li>)}
        </ol>
        <div className={styles.center}><a className={styles.primary} href={book}>Agendar uma avaliação</a></div>
      </section>

      <section className={styles.about} id="veterinaria" aria-labelledby="veterinaria-titulo">
        <figure className={styles.aboutPhoto}>
          <Image src="/images/toca/retrato.webp" alt="Veterinária de pijama cirúrgico verde em pé no corredor do hospital" fill sizes="(max-width:900px) 92vw, 40vw" />
          <figcaption><span className={styles.plate}>Toca</span>Atende cães e gatos</figcaption>
        </figure>
        <div className={styles.aboutCopy}>
          <p className={styles.kicker}>Conheça a veterinária</p>
          <h2 id="veterinaria-titulo">Paciência é <em>parte do tratamento.</em></h2>
          <p>Na Toca, a consulta começa pelo animal: ele cheira a sala, se acomoda e só então é examinado. Você acompanha tudo e sai sabendo o que foi visto e o que vem depois.</p>
          <ul className={styles.checks}>
            <li>Exame no ritmo do animal</li>
            <li>O tutor acompanha o exame</li>
            <li>Plano por escrito, com valores</li>
          </ul>
          <a className={styles.textLink} href="#fases">Ver os cuidados por fase</a>
        </div>
      </section>

      <section className={styles.stages} id="fases" aria-labelledby="fases-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Cuidados por fase da vida</p>
          <h2 id="fases-titulo"><span data-only="cao">Cada fase do seu cão</span><span data-only="gato">Cada fase do seu gato</span> <em>pede um cuidado.</em></h2>
        </div>
        {(["cao", "gato"] as const).map(species => <ol key={species} className={styles.stageList} data-only={species}>
          {lifeStages[species].map(stage => <li key={stage.title}><h3>{stage.title}</h3><p>{stage.text}</p></li>)}
        </ol>)}
      </section>

      <section className={styles.visit} id="primeira-consulta" aria-labelledby="visita-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>A primeira consulta</p>
          <h2 id="visita-titulo">Uma visita <em>sem pressa.</em></h2>
        </div>
        <ol className={styles.visitSteps}>
          {firstVisit.map((step, index) => <li key={step.title}><span className={styles.plate}>{String(index + 1).padStart(2, "0")}</span><strong>{step.title}</strong><p>{step.text}</p></li>)}
        </ol>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Dúvidas frequentes</p>
          <h2 id="duvidas-titulo">Antes de vir, <em>o que saber.</em></h2>
        </div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="toca" />
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><TocaMark size={28} />Toca Hospital Veterinário</p>
      <nav aria-label="Rodapé"><a href="#especialidades">Especialidades</a><a href="#percurso">O hospital</a><a href={book}>Agendar consulta</a></nav>
      <p className={styles.credit}>© 2026 Toca Hospital Veterinário. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
