import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/icons";
import { VanguardMotion } from "@/components/VanguardMotion";
import styles from "./vanguard.module.css";

export const metadata: Metadata = {
  title: "Vanguard | Arquitetura",
  description: "Luz, matéria e espaço negativo. Estudos de arquitetura que partem do lugar.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/propostas/vanguard" },
};

/** Edges of the Casa Horizonte photograph, measured as percentages of its width (x) and height (y). */
const lines: [number, number][][] = [
  [[0, 74], [44, 71.5]],                     // Edge of the reflecting pool.
  [[38, 63], [100, 66]],                     // Terrace floor.
  [[40, 13], [40, 40], [63, 31]],            // Cantilever: left edge and underside.
  [[40, 13], [63, 3]],                       // Cantilever: top edge.
  [[63, 0], [63, 31], [100, 34]],            // Cantilever: front corner and lower edge.
  [[60, 66], [60, 44], [86, 40], [86, 65]],  // Stone pillar.
  [[38, 62], [38, 46], [60, 47]],            // Glass opening.
];
const toPath = (points: [number, number][]) => points.map(([x, y], i) => `${i ? "L" : "M"}${x * 15} ${y * 10}`).join(" ");

/** Notes point at the same measured features. */
const notes = [
  { x: 52, y: 36, title: "Volume em balanço", text: "Sombra para o pátio.", side: "right" },
  { x: 48, y: 55, title: "Abertura", text: "A paisagem atravessa a casa.", side: "right" },
  { x: 72, y: 84, title: "Espelho d'água", text: "Repete o volume e a luz.", side: "left", wide: true },
] as const;

/** The route walked through the house, in the same photo coordinates, and where the camera stops at each step. */
const route: [number, number][] = [[29, 86], [44, 73], [60, 66], [52, 62], [49, 56]];
const steps = [
  { title: "Água", text: "O percurso começa no espelho d'água, que repete o volume e a luz.", camera: [34, 78, 1.6] },
  { title: "Sombra", text: "Sob o balanço, a luz baixa e o passo desacelera.", camera: [56, 42, 1.7] },
  { title: "Abertura", text: "No fim do caminho, a paisagem atravessa a casa.", camera: [49, 54, 1.9] },
] as const;

/** Peak: how a project starts. The terrain photo shares the house's framing, so the same measured lines draw the future house on it. */
const stages = [
  { title: "Terreno", text: "Tudo começa no lugar: a luz, a vista, a água que já existe." },
  { title: "Conversa", text: "Um primeiro traço, desenhado sobre o terreno, a partir do que você conta." },
  { title: "Estudo", text: "A ideia ganha volume em maquete, antes de qualquer obra." },
  { title: "Casa", text: "O desenho vira lugar." },
] as const;

export default function VanguardPage() {
  return <div className={styles.page} id="vanguard-inicio" data-vanguard>
    <a className={styles.skip} href="#vanguard-conteudo">Pular para o conteúdo</a>
    <VanguardMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#vanguard-inicio" aria-label="Vanguard, início">vanguard<span>arquitetura</span></a>
      <nav aria-label="Navegação Vanguard"><a href="#vg-horizonte">Estudos</a><a href="#vg-estudio">O estúdio</a></nav>
    </header>
    <main id="vanguard-conteudo">
      <section className={styles.opening} data-vg-opening aria-labelledby="vg-title">
        <div className={styles.stage} data-vg-stage>
          <div className={styles.frame} data-vg-frame>
            <div className={styles.photo} data-vg-photo>
              <Image src="/images/concepts/vanguard.webp" alt="Casa Horizonte: volume de concreto em balanço sobre um pátio com espelho d'água, oliveira e abertura de vidro para a montanha" fill sizes="(max-width:700px) 1300px, 150vh" preload />
            </div>
            <span className={styles.shade} data-vg-shade aria-hidden="true" />
            <svg className={styles.drawing} viewBox="0 0 1500 1000" aria-hidden="true" data-vg-drawing>
              {lines.map((points, index) => <path key={index} d={toPath(points)} pathLength={1} data-vg-line />)}
            </svg>
            <ul className={styles.notes} aria-label="Decisões do projeto">
              {notes.map(note => <li key={note.title} className={styles.note} data-side={note.side} data-wide-only={"wide" in note || undefined} style={{ left: `${note.x}%`, top: `${note.y}%` }} data-vg-note>
                <span className={styles.dot} aria-hidden="true" />
                <span className={styles.label}><strong>{note.title}</strong>{note.text}</span>
              </li>)}
            </ul>
          </div>
          <div className={styles.titleBlock} data-vg-title-block>
            <p className={styles.kicker}>Casa Horizonte</p>
            <h1 id="vg-title" data-vg-title>O essencial também ocupa espaço.</h1>
          </div>
          <a className={styles.hint} href="#vg-horizonte" data-vg-hint>Do traço à casa <Arrow size={16} /></a>
        </div>
      </section>

      <section className={styles.study} id="vg-horizonte" aria-labelledby="vg-horizonte-title">
        <div className={styles.studyHead}>
          <p>Estudo 01</p>
          <h2 id="vg-horizonte-title">O pátio como centro.</h2>
        </div>
        <div className={styles.studyBody}>
          <p className={styles.lead}>Uma residência organizada em torno de água, vegetação e luz. O volume em concreto cria sombra e estabelece uma transição lenta entre interior e exterior.</p>
          <dl className={styles.facts}>
            <div><dt>Programa</dt><dd>Residência com pátio</dd></div>
            <div><dt>Materialidade</dt><dd>Concreto, pedra e vidro</dd></div>
            <div><dt>Partido</dt><dd>Continuidade interior e exterior</dd></div>
          </dl>
          <p>O percurso começa no espelho de água e termina na abertura do volume. Primeiro o conjunto, depois as escolhas que organizam a experiência do espaço.</p>
        </div>
      </section>

      <section className={styles.route} data-vg-route aria-labelledby="vg-route-title">
        <div className={styles.routeStage} data-vg-route-stage>
          <div className={styles.routeFrame} data-vg-route-frame>
            <div className={styles.routeCamera} data-vg-camera>
              <Image src="/images/concepts/vanguard.webp" alt="" fill sizes="(max-width:700px) 1300px, 150vh" />
              <svg className={styles.routeDrawing} viewBox="0 0 1500 1000" aria-hidden="true">
                <path d={toPath(route)} pathLength={1} data-vg-route-line />
                {route.filter((_, i) => i === 0 || i === route.length - 1).map(([x, y]) => <circle key={x} cx={x * 15} cy={y * 10} r={7} data-vg-route-point />)}
              </svg>
            </div>
            <span className={styles.routeShade} data-vg-route-shade aria-hidden="true" />
          </div>
          <div className={styles.routeText}>
            <p className={styles.routeKicker} data-vg-route-title>Estudo 01 · Casa Horizonte</p>
            <h2 id="vg-route-title" data-vg-route-title>O percurso</h2>
            <ol className={styles.steps}>
              {steps.map((step, index) => <li key={step.title} data-vg-step data-camera={step.camera.join(",")}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.process} id="vg-processo" data-vg-process aria-labelledby="vg-process-title">
        <div className={styles.processStage} data-vg-process-stage>
          <div className={styles.processFrame}>
            <figure className={styles.layer} data-vg-layer="terreno">
              <Image src="/images/concepts/vanguard-terreno.webp" alt="O terreno antes da casa: oliveira, gramíneas, espelho d'água e montanhas ao fundo" fill sizes="(max-width:700px) 1300px, 150vh" />
            </figure>
            <figure className={styles.layer} data-vg-layer="conversa">
              <Image src="/images/concepts/vanguard-terreno.webp" alt="O mesmo terreno com o primeiro traço da casa desenhado por cima" fill sizes="(max-width:700px) 1300px, 150vh" />
              <svg className={styles.sketch} viewBox="0 0 1500 1000" aria-hidden="true">
                {lines.map((points, index) => <path key={index} d={toPath(points)} pathLength={1} data-vg-sketch />)}
              </svg>
            </figure>
            <figure className={styles.layer} data-vg-layer="maquete">
              <Image src="/images/concepts/vanguard-maquete.webp" alt="Maquete branca de estudo da casa sobre a mesa do ateliê, entre desenhos e lápis" fill sizes="(max-width:700px) 1300px, 150vh" />
            </figure>
            <figure className={styles.layer} data-vg-layer="casa">
              <Image src="/images/concepts/vanguard.webp" alt="Casa Horizonte sobre o mesmo terreno" fill sizes="(max-width:700px) 1300px, 150vh" />
            </figure>
            <span className={styles.processShade} data-vg-process-shade aria-hidden="true" />
          </div>
          <div className={styles.processText}>
            <p className={styles.routeKicker} data-vg-process-title>Como começa um projeto</p>
            <h2 id="vg-process-title" data-vg-process-title>Do terreno à casa, um passo de cada vez.</h2>
            <ol className={styles.stages}>
              {stages.map((stage, index) => <li key={stage.title} data-vg-process-step>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage.title}</strong>
                <p>{stage.text}</p>
              </li>)}
            </ol>
          </div>
          <div className={styles.pencil} aria-hidden="true">
            <span className={styles.pencilLine} data-vg-pencil />
            {stages.map((stage, index) => <span key={stage.title} className={styles.tick} style={{ top: `${index / (stages.length - 1) * 100}%` }} data-vg-tick />)}
          </div>
        </div>
      </section>

      {/* After the peak, so the project's own sequence is not interrupted by other houses. */}
      <section className={styles.others} id="vg-estudio" aria-labelledby="vg-others-title">
        <h2 id="vg-others-title">Cada lugar pede<br />uma resposta.</h2>
        <div className={styles.otherGrid}>
          <figure>
            <div className={styles.otherPhoto}><Image src="/images/concepts/vanguard-pavilhao.webp" alt="Pavilhão Uno: pavilhão de madeira e vidro entre pinheiros" fill sizes="(max-width:700px) 90vw, 44vw" /></div>
            <figcaption><h3>Pavilhão Uno</h3><p>Um intervalo entre árvores.</p></figcaption>
          </figure>
          <figure>
            <div className={styles.otherPhoto}><Image src="/images/concepts/vanguard-refugio.webp" alt="Refúgio Mineral: abrigo de pedra escura com abertura panorâmica sobre a montanha" fill sizes="(max-width:700px) 90vw, 44vw" /></div>
            <figcaption><h3>Refúgio Mineral</h3><p>Abrigar sem interromper.</p></figcaption>
          </figure>
        </div>
      </section>
    </main>
    <footer className={styles.footer}>
      <a href="#vanguard-inicio" aria-label="Vanguard, voltar ao início">vanguard</a>
      <p>© 2026 Vanguard Arquitetura.<br />Site por <Link href="/#modelos">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
