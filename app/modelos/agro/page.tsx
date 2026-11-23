import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Work_Sans, Zilla_Slab } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { caseSteps, faq, lawyer, mapSize, plots, signs } from "@/lib/talhao";
import { TalhaoMark } from "./TalhaoMark";
import { TalhaoMotion } from "./TalhaoMotion";
import styles from "./talhao.module.css";
import { BrandScrollGuide } from "@/components/brand/BrandScrollGuide";
import { Gesture, GestureText } from "@/components/brand/Gesture";

/** Zilla Slab: a square serif with the voice of machinery and farm signs. Work Sans for reading. */
const display = Zilla_Slab({ subsets: ["latin"], weight: ["500", "700"], variable: "--talhao-display", display: "swap" });
const sans = Work_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--talhao-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Talhão Advocacia do Agro | Dívida rural e safra frustrada",
  description: "Advocacia para o produtor rural: crédito rural, safra frustrada, máquina penhorada, arrendamento e terra em garantia.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/agro" },
};

const book = "#talhao-interesse";

/**
 * Pilot (20/11/2026): the farm seen from above. The scroll draws the outline of each plot like a GPS harvest map and
 * lights it with one situation, while the map legend tells it. The rest of the page comes after the pilot is approved.
 */
export default function TalhaoPage() {
  return <div className={`${styles.page} ${display.variable} ${sans.variable}`} data-model="talhao">
    <a className={styles.skip} href="#talhao-conteudo">Pular para o conteúdo</a>
    <TalhaoMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#talhao-inicio"><TalhaoMark size={30} /><span>Talhão<small>Advocacia do agro</small></span></a>
      <nav aria-label="Navegação principal"><a href="#sinais">É pra você?</a><a href="#como-analisa">Como analisa</a><a href="#marina">A {lawyer.first}</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}><span className={styles.ctaLong}>Conversar com a {lawyer.first}</span><span className={styles.ctaShort}>Conversar</span></a>
    </header>

    <main id="talhao-conteudo">
      <section className={styles.hero} id="talhao-inicio" aria-labelledby="talhao-titulo" data-talhao-hero>
        <div className={styles.stage}>
          {/* The farm from above, with every plot measured on the photo. */}
          <div className={styles.mapFrame} aria-hidden="true">
            <div className={styles.map} data-talhao-map>
              <Image src="/images/talhao/mapa-zenital.webp" alt="" fill sizes="(max-width:900px) 330vw, 120vw" quality={88} preload />
              <svg className={styles.plots} viewBox={`0 0 ${mapSize.w} ${mapSize.h}`} preserveAspectRatio="none">
                {/* Spotlight: the farm darkens and only the current plot stays lit (a hole in the shade). */}
                <defs>
                  <mask id="talhao-spot" maskUnits="userSpaceOnUse" x="0" y="0" width={mapSize.w} height={mapSize.h}>
                    <rect width={mapSize.w} height={mapSize.h} fill="#fff" />
                    {plots.map(plot => plot.shape.kind === "rect"
                      ? <rect key={plot.id} data-hole={plot.id} x={plot.shape.x} y={plot.shape.y} width={plot.shape.w} height={plot.shape.h} rx="6" fill="#000" />
                      : <circle key={plot.id} data-hole={plot.id} cx={plot.shape.cx} cy={plot.shape.cy} r={plot.shape.r} fill="#000" />)}
                  </mask>
                </defs>
                <rect className={styles.shade} width={mapSize.w} height={mapSize.h} mask="url(#talhao-spot)" data-talhao-shade />
                {/* Arrival: every outline is drawn once, quickly, then fades, so the map reads as alive. */}
                <g className={styles.ghosts} data-talhao-ghosts>
                  {plots.map(plot => plot.shape.kind === "rect"
                    ? <rect key={plot.id} x={plot.shape.x} y={plot.shape.y} width={plot.shape.w} height={plot.shape.h} rx="6" pathLength={1} data-ghost />
                    : <circle key={plot.id} cx={plot.shape.cx} cy={plot.shape.cy} r={plot.shape.r} pathLength={1} data-ghost />)}
                </g>
                {plots.map((plot, i) => <g key={plot.id} data-plot={plot.id}>
                  {plot.shape.kind === "rect"
                    ? <rect x={plot.shape.x} y={plot.shape.y} width={plot.shape.w} height={plot.shape.h} rx="6" pathLength={1} data-plot-line />
                    : <circle cx={plot.shape.cx} cy={plot.shape.cy} r={plot.shape.r} pathLength={1} data-plot-line />}
                  <g className={styles.marker} transform={`translate(${plot.marker.x} ${plot.marker.y})`} data-plot-marker>
                    <circle r="26" />
                    <text dy="9" textAnchor="middle">{i + 1}</text>
                  </g>
                </g>)}
              </svg>
            </div>
            <p className={styles.hint} data-talhao-hint data-guide-hint><Gesture /> <GestureText desktop="Role para ver cada talhão" phone="Deslize para ver cada talhão" /></p>
          </div>

          {/* The map legend carries the message, the five situations and the call. */}
          <div className={styles.legend}>
            <p className={styles.place}>Advocacia para quem vive da terra</p>
            <h1 id="talhao-titulo">Safra frustrada não precisa virar terra perdida.</h1>
            <p className={styles.sub}>O crédito rural prevê caminhos quando a safra se perde por algo que você não controla. A {lawyer.first} mostra quais existem para a sua fazenda.</p>
            <ol className={styles.steps} aria-label="Situações que chegam ao escritório">
              {plots.map((plot, i) => <li key={plot.id} data-step={plot.id}>
                <span className={styles.stepNo} aria-hidden="true">{i + 1}</span>
                <span><strong>{plot.title}</strong><em>{plot.line}</em></span>
              </li>)}
            </ol>
            <div className={styles.actions}>
              <a className={styles.primary} href={book}>Conversar sobre a minha fazenda</a>
            </div>
            <a className={styles.signature} href="#marina">
              <span className={styles.thumb}><Image src="/images/talhao/marina-rosto.webp" alt="" fill sizes="48px" /></span>
              <span>Com <strong>{lawyer.name}</strong>, advogada do agro</span>
            </a>
          </div>
        </div>
      </section>

      {/* The farmer recognises himself: concrete signs, then the call. */}
      <section className={styles.signs} id="sinais" aria-labelledby="sinais-titulo">
        <div className={styles.signsCopy}>
          <h2 id="sinais-titulo">É hora de conversar se…</h2>
          <ul className={styles.signList}>{signs.map(sign => <li key={sign}>{sign}</li>)}</ul>
          <p className={styles.signsNote}>Quanto antes a situação é olhada, mais caminhos costumam estar abertos.</p>
          <a className={styles.primary} href={book}>Conversar com a {lawyer.first}</a>
        </div>
        <figure className={styles.signsImage}>
          <Image src="/images/talhao/colheitadeira.webp" alt="Colheitadeira parada no galpão da fazenda, com a luz do meio-dia entrando pela porta" fill sizes="(max-width:900px) 100vw, 45vw" />
        </figure>
      </section>

      {/* Close to the ground: the field film runs with the scroll, from the road down into the soy rows. */}
      <section className={styles.field} aria-labelledby="perto-titulo" data-talhao-field>
        <div className={styles.fieldStage}>
          <Image className={styles.fieldStill} src="/images/talhao/lavoura.webp" alt="Estrada de terra roxa entre a soja e a palha do milho colhido, ao meio-dia" fill sizes="100vw" quality={85} />
          <canvas className={styles.fieldCanvas} data-field-canvas aria-hidden="true" />
          <div className={styles.fieldCopy}>
            <h2 id="perto-titulo">De perto, não é um número no contrato.</h2>
            <p className={styles.fieldLine} data-field-line="0">Da estrada de terra até a última fileira,</p>
            <p className={styles.fieldLine} data-field-line="1">é a terra que você trabalhou safra após safra.</p>
          </div>
        </div>
      </section>

      <section className={styles.case} id="como-analisa" aria-labelledby="caso-titulo">
        <div className={styles.caseHead}>
          <h2 id="caso-titulo">Antes de qualquer caminho, a leitura do seu caso.</h2>
          <figure className={styles.caseImage}>
            <Image src="/images/talhao/terra.webp" alt="Mãos de um produtor rural segurando um punhado de terra roxa, com a soja ao fundo" fill sizes="(max-width:900px) 100vw, 46vw" />
          </figure>
        </div>
        <ol className={styles.road}>
          {caseSteps.map((step, i) => <li key={step.title}><span className={styles.roadNo} aria-hidden="true">{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}
        </ol>
      </section>

      <section className={styles.lawyer} id="marina" aria-labelledby="marina-titulo">
        <figure className={styles.lawyerPhoto}>
          <Image src="/images/talhao/conversa-varanda.webp" alt={`${lawyer.name} explica um documento a um produtor rural na varanda da sede da fazenda`} fill sizes="(max-width:900px) 100vw, 55vw" />
        </figure>
        <div className={styles.lawyerCopy}>
          <p className={styles.place}>Quem vai até a fazenda</p>
          <h2 id="marina-titulo">{lawyer.name}</h2>
          <p className={styles.role}>{lawyer.role}</p>
          <p>Sou a {lawyer.first}. Atendo produtores rurais que estão com a safra, a máquina ou a terra em jogo por causa de uma dívida. Antes de falar em processo, eu sento com você, leio os contratos e explico o que a lei permite e o que não permite.</p>
          <ul className={styles.facts}>
            <li>Crédito rural</li>
            <li>Contratos agrários</li>
            <li>Atendimento na fazenda ou online</li>
          </ul>
          <a className={styles.primary} href={book}>Conversar com a {lawyer.first}</a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <h2 id="duvidas-titulo">Perguntas de quem está na lavoura.</h2>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="talhao" />
    </main>
    <BrandScrollGuide />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><TalhaoMark size={24} />Talhão Advocacia do Agro</p>
      <nav aria-label="Rodapé"><a href="#talhao-inicio">Situações</a><a href="#marina">A {lawyer.first}</a><a href={book}>Conversar</a></nav>
      <p className={styles.credit}>© 2026 Talhão Advocacia do Agro. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
