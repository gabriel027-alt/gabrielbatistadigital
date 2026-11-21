import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Work_Sans, Zilla_Slab } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { lawyer, mapSize, plots } from "@/lib/talhao";
import { TalhaoMark } from "./TalhaoMark";
import { TalhaoMotion } from "./TalhaoMotion";
import styles from "./talhao.module.css";

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
      <a className={styles.logo} href="#talhao-inicio" aria-label="Talhão Advocacia do Agro, início"><TalhaoMark size={30} /><span>Talhão<small>Advocacia do agro</small></span></a>
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
          </div>

          {/* The map legend carries the message, the five situations and the call. */}
          <div className={styles.legend}>
            <p className={styles.place}>Advocacia para quem vive da terra</p>
            <h1 id="talhao-titulo">Safra frustrada não precisa virar terra perdida.</h1>
            <p className={styles.sub}>As regras do crédito rural preveem caminhos, como a prorrogação, quando a safra se perde por algo que você não controla. A {lawyer.first} mostra quais existem para a sua fazenda.</p>
            <ol className={styles.steps} aria-label="Situações que chegam ao escritório">
              {plots.map((plot, i) => <li key={plot.id} data-step={plot.id}>
                <span className={styles.stepNo} aria-hidden="true">{i + 1}</span>
                <span><strong>{plot.title}</strong><em>{plot.line}</em></span>
              </li>)}
            </ol>
            <div className={styles.actions}>
              <a className={styles.primary} href={book}>Conversar sobre a minha fazenda</a>
            </div>
            <a className={styles.signature} href={book}>
              <span className={styles.thumb}><Image src="/images/talhao/marina-rosto.webp" alt="" fill sizes="48px" /></span>
              <span>Com <strong>{lawyer.name}</strong>, advogada do agro</span>
            </a>
          </div>
        </div>
      </section>

      <BrandInquiry brand="talhao" />
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><TalhaoMark size={24} />Talhão Advocacia do Agro</p>
      <p className={styles.credit}>© 2026 Talhão Advocacia do Agro. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
