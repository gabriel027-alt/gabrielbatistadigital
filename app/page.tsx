import type { Metadata, Viewport } from "next";
import Image from "next/image";
import { ArtDirectedImage } from "@/components/ArtDirectedImage";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { linePath, onLine, shapes, transformOf, view, type ShapeId } from "@/lib/gb-shapes";
import { GbShape, GbShapeDefs } from "@/components/GbShape";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { brandKits } from "@/lib/brand-kits";
import { Arrow } from "@/components/ui/icons";
import { EditorialAvatarLoop } from "@/components/EditorialAvatarLoop";
import { EditorialMotion } from "@/components/EditorialMotion";
import { EditorialMedia } from "@/components/EditorialMedia";
import { HeroClouds } from "@/components/HeroClouds";
import { CloudTransition } from "@/components/CloudTransition";
import { HandParticles } from "@/components/HandParticles";
import { WorkParticles } from "@/components/WorkParticles";
import { TalkParticles } from "@/components/TalkParticles";
import type { FilmId } from "@/lib/project-films";
import styles from "./editorial.module.css";

/** Monumental words (name, section titles, contact); Manrope stays for reading. Mono only for real brand data. */
// Variable width and weight: the hero name breathes between narrow and wide, as in the reference.
// latin-ext brings the dotless "ı": the red brand dot takes the place of the tittle on both i of the name.
const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], weight: "variable", axes: ["wdth", "opsz"], variable: "--gb-display", display: "swap" });
/** Draws a word of the name with a red tittle (the brand dot) over each "i". */
/** A real "i" whose dot is covered by the red brand dot; `carry` marks the one the scroll picks up and drops into the palm. */
const redI = (carry = false) => <span className={styles.iSlot}>i<span className={`${styles.tittle} ${styles.hookTittle}`} data-hook-tittle={carry ? "carry" : ""} aria-hidden="true" /></span>;
const nameWord = (text: string) => [...text].map((letter, index) => letter === "i" ? <span key={index} className={styles.iSlot}>ı<span className={styles.tittle} data-tittle /></span> : letter);
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--gb-mono", display: "swap" });

// The phone browser bar takes the colour of the dark hero.
export const viewport: Viewport = { themeColor: "#201714" };
export const metadata: Metadata = { title: { absolute: "Gabriel Batista | Sites para clínicas e negócios de alto ticket" }, description: "Design e desenvolvimento de sites com marca própria para clínicas e negócios de alto ticket, do primeiro contato ao agendamento.", alternates: { canonical: "/" } };
const contact = buildWhatsAppUrl("Olá, Gabriel! Vi seu portfólio e quero conversar sobre um site para a minha clínica.");
const sample = (id: string, view: "hero" | "cena") => `/images/projects/brands/${id}-${view}.webp`;
const kit = (id: string) => brandKits.find(item => item.id === id);

type Work = { name: string; sector: string; image: string; film?: FilmId; kit?: string };
const brands: Work[] = [
  { name: "Forma Odontologia", sector: "Odontologia estética", image: sample("forma", "hero"), film: "forma", kit: "forma" },
  { name: "Sutil Cirurgia Plástica", sector: "Cirurgia plástica", image: sample("sutil", "hero"), film: "sutil", kit: "sutil" },
  { name: "Toca Hospital Veterinário", sector: "Hospital veterinário", image: sample("toca", "hero"), film: "toca", kit: "toca" },
  { name: "Casa Brisa", sector: "Hotel boutique", image: sample("brisa", "hero"), film: "brisa", kit: "brisa" },
  { name: "Almeida & Valença", sector: "Família e sucessões", image: sample("almeida", "hero"), film: "almeida", kit: "almeida" },
];
const films: Work[] = [
  { name: "Aura", sector: "Harmonização facial", image: "/images/projects/aura-film-poster.webp", film: "aura" },
  { name: "Orla", sector: "Residências", image: "/images/projects/orla-film-poster.jpg", film: "orla" },
];
const works = [...brands, ...films];
// The services are text only: the projects live in one place, the strip that comes out of the folder.
const services = [
  { title: "Sites & landing pages", text: "Os tratamentos, as dúvidas que mais aparecem e o caminho até o agendamento, numa página que o paciente entende sem esforço." },
  { title: "Identidade na interface", text: "Cores tiradas das suas próprias fotos e uma tipografia escolhida para a sua marca, para o site não parecer o do concorrente." },
  { title: "Movimento & interação", text: "A rolagem mostra o espaço, o tratamento ou a recuperação. Um roteiro curto prepara a primeira conversa." },
  { title: "Design & desenvolvimento", text: "Eu desenho e programo o site, e confiro cada página no celular e no computador." },
];
/** One project of the strip; the second lap of the loop is a decorative copy, clickable but hidden from assistive tech. */
const project = (work: Work, decorative = false) => {
  const data = work.kit ? kit(work.kit) : undefined;
  return <li key={work.name} className={styles.stripItem}><EditorialMedia name={work.name} image={work.image} film={work.film} compact decorative={decorative}/>
    <div className={styles.stripCaption}><div><h3>{work.name}</h3><span>{work.sector}</span></div>
      {data && <dl className={styles.spec}><div><dt className={styles.sr}>Fonte</dt><dd>{data.typography.display}</dd></div><div><dt className={styles.sr}>Cores medidas nas fotos</dt><dd className={styles.swatches}>{Object.values(data.palette).map(hex => <span key={hex} style={{ background: hex }} title={hex}><i>{hex}</i></span>)}</dd></div></dl>}
    </div></li>;
};
// Between the two words of the name: a peach card where "g." assembles in a loop (same story as the scroll scene).
// View box framed around the assembled letter; the stem is painted first so the bowl sits on top of it.
const cardView = "379 321 700 482";
const cardOrder: ShapeId[] = ["stem", "bowl", "hook", "dot"];
const cardParts = cardOrder.map(id => shapes.find(shape => shape.id === id)!);
// Paint order: the line passes behind the stem and in front of the rest.
const backShapes = shapes.filter(shape => shape.id === "frame" || shape.id === "stem");
const frontShapes = shapes.filter(shape => shape.id !== "frame" && shape.id !== "stem");

export default function HomePage() {
  return <EditorialMotion className={`${display.variable} ${mono.variable}`}>
    <a className={styles.skip} href="#editorial-main">Pular para o conteúdo</a>
    <header className={styles.nav} data-editorial-nav><a className={styles.logo} href="#editorial-start">Gabriel<span aria-hidden="true">•</span>Batista</a><nav aria-label="Navegação do portfólio"><a href="#editorial-about">Sobre</a><a href="#editorial-work">Projetos</a><a className={styles.navWhats} href={contact} target="_blank" rel="noopener noreferrer">Conversar</a></nav><a className={styles.navContact} href={contact} target="_blank" rel="noopener noreferrer" data-cursor-label="Vamos conversar">Conversar <Arrow size={15}/></a></header>
    <svg className={styles.defs} aria-hidden="true" focusable="false"><GbShapeDefs /></svg>
    <main id="editorial-main">
      <section id="editorial-start" className={styles.hero} data-editorial-theme="photo">
        {/* Before the first paint: with motion allowed, the portrait waits hidden so the points can form it
            (components/HeroClouds.tsx). Without JS, with reduced motion or saved data, it shows as usual; and the CSS
            shows it after 3 s whatever happens. */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!(navigator.connection&&navigator.connection.saveData))document.documentElement.dataset.heroAssemble=''}catch(e){}" }} />
        <div className={styles.heroPhoto} data-hero-photo><ArtDirectedImage alt="Retrato frontal de Gabriel Batista com luz vermelha" preload desktop={{ src: "/images/hero/gabriel-hero-wide.webp", sizes: "130vw" }} mobile={{ src: "/images/hero/gabriel-hero-mobile.webp", sizes: "150vw" }} /><HeroClouds /></div>
        {/* The brand dot is born as the tittle of "Design": it soaks the phrase in red ink, then drips onto the name. */}
        <p className={styles.heroOffer} data-hero-offer><span className={styles.sr}>Design & desenvolvimento web</span><span aria-hidden="true">Des<span className={styles.iSlot}>ı<span className={`${styles.tittle} ${styles.offerTittle}`} data-offer-tittle /></span>gn &<br/>desenvolvimento web</span><span className={styles.offerInk} data-offer-ink aria-hidden="true" /></p>
        <div className={styles.heroBottom}><h1 data-hero-wordmark><span className={styles.sr}>Gabriel Batista</span><span aria-hidden="true" data-hero-word>{nameWord("Gabriel")}</span><span className={styles.heroSample} data-hero-sample aria-hidden="true"><span className={styles.heroCard} data-hero-card><svg viewBox={cardView}>{cardParts.map(shape => <g key={shape.id} transform={transformOf(shape.final)}><g data-card-part={shape.id}><GbShape id={shape.id} tone="dark" /></g></g>)}</svg></span></span><span aria-hidden="true" data-hero-word>{nameWord("Batista")}</span><span className={styles.heroDot} data-hero-dot aria-hidden="true" /><svg className={styles.heroTrail} aria-hidden="true" focusable="false"><path data-hero-trail pathLength={1} /></svg><span className={styles.heroGlow} data-hero-glow aria-hidden="true" /><span className={styles.heroGlow} data-hero-wave aria-hidden="true" /></h1><p>Sites para clínicas e negócios de alto ticket</p></div>
      </section>
      <CloudTransition from="#editorial-start" />
      <section className={styles.hook} data-editorial-theme="paper" data-hook>
        <h2 data-kinetic aria-label="Do primeiro olhar ao próximo clique, e dele até a sua agenda.">Do pr{redI()}meiro olhar<br/>ao próximo <a href={contact} target="_blank" rel="noopener noreferrer" className={styles.clickWord} data-cursor-label="Começar um projeto" aria-label="clique"><span>cl{redI(true)}que</span> <Arrow size={42}/></a>,<br/>e dele até a sua agenda.</h2>
        {/* "O próximo clique", one stage: the red tittle of "clique" falls into Gabriel's open palm; the dot rises, bursts,
            and the pieces of "g." come out of that spark, float with the peach line and assemble above the hand. */}
        <div className={styles.fusionTrack} data-creation-track data-gb-track>
          <div className={styles.fusionStage} data-fusion-stage>
            {/* The points that formed him at the top pour down from "clique" with the dot and form his hand. */}
            <HandParticles />
            <figure className={styles.palm} data-palm role="img" aria-label="A mão aberta de Gabriel, com a palma para cima, segura o ponto vermelho da marca.">
              <div className={styles.palmBody} data-palm-body>
              <Image src="/images/editorial/mao-palma-braco.webp" alt="" width={5800} height={2701} quality={90} sizes="(max-width:700px) 200vw, 150vw" data-palm-hand />
              <span className={styles.palmRing} data-creation-ring aria-hidden="true" />
              <span className={styles.palmGlow} data-palm-glow aria-hidden="true" />
              <span className={styles.palmShadow} data-palm-shadow aria-hidden="true" />
              <span className={`${styles.tittle} ${styles.palmDot}`} data-creation-dot aria-hidden="true" />
              </div>
            </figure>
            <span className={styles.gShadow} data-g-shadow aria-hidden="true" />
            <div className={styles.fusionField} data-gb-shapes aria-hidden="true"><svg viewBox={`0 0 ${view.w} ${view.h}`} preserveAspectRatio="xMidYMid meet">
              {backShapes.map(shape => <g key={shape.id} data-gb-shape={shape.id} transform={transformOf(shape.final)}><GbShape id={shape.id} /></g>)}
              <path className={styles.gbLine} data-gb-line d={linePath(shapes.filter(shape => onLine(shape.id)).map(shape => shape.final))} pathLength={1} />
              {frontShapes.map(shape => <g key={shape.id} data-gb-shape={shape.id} transform={transformOf(shape.final)}><GbShape id={shape.id} /></g>)}
            </svg></div>
            <div className={styles.palmCopy} data-palm-copy><h2>Feito à mão, do primeiro traço ao último clique.</h2><p>Sem modelo pronto: cada site nasce da marca da sua clínica.</p></div>
          </div>
        </div>
      </section>
      {/* The folder: the brand dot drops onto its tab like a click, the folder opens and the projects come out
          as an endless strip of films. Without motion the folder is shown open with the strip beside it. */}
      <section className={styles.work} id="editorial-work" data-editorial-theme="paper" aria-labelledby="editorial-work-title">
        <div className={styles.workTrack} data-work-track>
          <div className={styles.workStage} data-work-stage>
            <h2 id="editorial-work-title" className={styles.projectsWord} data-work-word>Projetos</h2>
            <div className={styles.strip} data-strip>
              <div className={styles.stripTrack}>
                <ul className={styles.stripList}>{works.map(work => project(work))}</ul>
                <ul className={`${styles.stripList} ${styles.stripCopy}`} aria-hidden="true">{works.map(work => project(work, true))}</ul>
              </div>
            </div>
            <div className={styles.pasta} data-pasta aria-hidden="true">
              <span className={styles.pastaBack}><span className={styles.pastaTab}/></span>
              <span className={styles.pastaSheet} data-pasta-sheet/>
              <span className={styles.pastaFront} data-pasta-front><span>g.</span></span>
              <span className={styles.pastaRing} data-pasta-ring/>
              <span className={`${styles.tittle} ${styles.pastaDot}`} data-pasta-dot/>
            </div>
            {/* The same points pour out of the opening folder and form each project card, in its own colours. */}
            <WorkParticles />
            <p className={styles.workNote} data-work-note>Clique num projeto para ver o filme.</p>
          </div>
        </div>
      </section>
      <section className={styles.services} data-editorial-theme="paper" aria-labelledby="editorial-services-title">
        <p className={styles.sectionNote}>O que eu construo</p><h2 id="editorial-services-title" className={styles.servicesTitle} data-kinetic>Sua clínica tem um jeito próprio de atender.<br/>Vamos dar forma a ele.</h2>
        <div className={styles.serviceList} data-read-list>{services.map(item => <article key={item.title} className={styles.serviceItem} data-read-item><h3><span className={styles.readLine}>{item.title}</span></h3><p>{item.text}</p></article>)}<span className={styles.readTrack} aria-hidden="true"><span className={styles.readFill} data-read-fill /><span className={`${styles.carrierDot} ${styles.readDot}`} data-read-dot /></span></div>
      </section>
      <section className={styles.about} id="editorial-about" data-editorial-theme="photo" aria-labelledby="editorial-about-title">
        <div className={styles.aboutPhoto} data-about-photo><ArtDirectedImage alt="Gabriel Batista" desktop={{ src: "/images/hero/gabriel-sobre.webp", sizes: "300vw" }} mobile={{ src: "/images/hero/gabriel-sobre-mobile.webp", sizes: "260vw" }} /></div>
        <div className={styles.aboutStatement}><h2 id="editorial-about-title" data-kinetic>Uma boa ideia<br/>precisa funcionar.</h2><p>Inclusive no celular de quem procura a sua clínica.</p></div>
        <div className={styles.aboutPrinciples}><p>Sou Gabriel Batista.<br/>Eu mesmo desenho e programo o seu site.</p><h3 className={styles.readAbout} data-read-about><span className={styles.readLine}>Quem desenha<br/>é quem programa.</span><span className={`${styles.carrierDot} ${styles.readDot}`} data-read-dot aria-hidden="true" /></h3><ul><li>Entender o negócio antes de desenhar a página.</li><li>Dar à marca uma linguagem própria.</li><li>Deixar claro, em cada parte da página, o próximo passo do paciente.</li><li>Conferir a experiência no navegador e no celular.</li></ul><a href={contact} target="_blank" rel="noopener noreferrer" className={styles.photoLink}>Conversar sobre o meu site <Arrow size={22}/></a></div>
      </section>
      <section className={styles.contact} id="editorial-contact" data-editorial-theme="paper"><a data-contact-panel href={contact} target="_blank" rel="noopener noreferrer" data-cursor-label="Vamos conversar"><TalkParticles /><div><h2>O próximo site pode ser<br/>o da sua clínica.</h2><p>Conte como a sua clínica atende hoje e o que você quer que o site resolva.</p></div><span className={styles.contactAction}><span className={styles.contactGo}><span>Vamos conversar<span className={styles.contactDot} data-contact-dot aria-hidden="true" /></span><Arrow size={42}/></span><span className={styles.contactWhere}>Abre uma conversa no WhatsApp</span></span></a></section>
    </main>
    <footer id="editorial-footer" className={styles.footer} data-editorial-theme="photo"><EditorialAvatarLoop/><div className={styles.footerTop}><p>Gabriel Batista Digital</p><div><span>Sites para clínicas e negócios de alto ticket</span><p><a href={contact} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp</a></p></div></div><div className={styles.footerName} aria-hidden="true"><span>Gabriel</span><span>Batista</span></div><div className={styles.footerBottom}><span>© 2026 Gabriel Batista Digital. Todos os direitos reservados.</span><a href="#editorial-start">Voltar ao início</a></div></footer>
  </EditorialMotion>;
}
