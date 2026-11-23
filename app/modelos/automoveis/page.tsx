import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sora, Unbounded } from "next/font/google";
import { Arrow } from "@/components/ui/icons";
import { chapters, inspections, reportItems, faq, legalWarranty } from "@/lib/paddock";
import { PaddockTour } from "./PaddockTour";
import { PaddockStock } from "./PaddockStock";
import styles from "./paddock.module.css";
import { WhoAnswers } from "@/components/brand/WhoAnswers";
import { BrandScrollGuide } from "@/components/brand/BrandScrollGuide";
import { Gesture, GestureText } from "@/components/brand/Gesture";
const display = Unbounded({ subsets: ["latin"], weight: ["500", "600"], variable: "--paddock-display", display: "swap" });
const body = Sora({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--paddock-body", display: "swap" });
export const metadata: Metadata = { title: "Paddock — Seminovos com o laudo aberto", description: "Seminovos com o laudo aberto. Conheça o que a Paddock confere antes de cada carro entrar no estoque.", robots: { index: false, follow: true }, alternates: { canonical: "/modelos/automoveis" } };
function Mark(){return <svg width="31" height="32" viewBox="0 0 31 32" fill="none" aria-hidden="true"><path d="M3 29V3h18l7 7-7 7H10" stroke="currentColor" strokeWidth="3"/><path d="M10 29V10h11" stroke="currentColor" strokeWidth="2"/></svg>}
export default function PaddockPage(){return <div className={`${styles.page} ${display.variable} ${body.variable}`} data-model="paddock">
  <a className={styles.skip} href="#paddock-conteudo">Pular para o conteúdo</a><PaddockTour/>
  <header className={styles.header}><a href="#paddock-inicio" className={styles.logo}><Mark/><span>Paddock<small>Automóveis</small></span></a><a href="#paddock-estoque">Estoque com laudo <Arrow size={16}/></a></header>
  <main id="paddock-conteudo"><section id="paddock-inicio" className={styles.tour} data-paddock-tour aria-labelledby="paddock-titulo">
    <div className={styles.stage} data-tour-stage><picture><source media="(max-aspect-ratio: 4/5)" srcSet="/videos/paddock/m/0001.webp"/><Image className={styles.poster} src="/videos/paddock/d/0001.webp" alt="Detalhe do farol de um sedã grafite no escuro" fill sizes="100vw" preload/></picture><canvas className={styles.canvas} data-tour-canvas aria-hidden="true"/>
      <div className={styles.hero} data-tour-hero><h1 id="paddock-titulo">Todo seminovo parece perfeito no escuro. <span>Nós acendemos a luz.</span></h1><p>Você vê o que foi conferido antes de falar em preço.</p><a href="#paddock-estoque" className={styles.primary}>Ver carros e laudos <Arrow size={18}/></a><WhoAnswers>A equipe da loja responde e mostra o laudo do carro que você escolher.</WhoAnswers><p className={styles.hint} data-scroll-hint><Gesture /> <GestureText desktop="Role para abrir o laudo" phone="Deslize para abrir o laudo" /></p></div>
      <div className={styles.scanLine} data-inspection-line aria-hidden="true"><span>Leitura do laudo</span></div>
      <svg className={styles.inspectionLinks} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">
        <g className={styles.desktopLinks}>{["210,450 320,450 470,440","790,260 740,260 680,280","205,630 350,630 470,720","805,598 790,598 800,590"].map((points,i) => <g key={points} data-proof-link data-proof-index={i}><polyline points={points}/><circle cx={[470,680,470,800][i]} cy={[440,280,720,590][i]} r="6"/></g>)}</g>
        <g className={styles.mobileLinks}>{["150,470 240,470 350,510","850,390 700,390 580,460","150,700 220,640 300,580","900,590 850,590 800,590"].map((points,i) => <g key={points} data-proof-link data-proof-index={i}><polyline points={points}/><circle cx={[350,580,300,800][i]} cy={[510,460,580,590][i]} r="6"/></g>)}</g>
      </svg>
      <ol className={styles.proofMarks} aria-label="O que fica registrado">{reportItems.map((item,i) => <li key={item.id} data-inspection-mark data-proof-index={i}><span className={styles.proofNode} aria-hidden="true"/><span>{item.title}</span></li>)}</ol>
      <ol className={styles.captions} aria-label="Capítulos do tour">{chapters.map(ch => <li key={ch.id} data-tour-caption><h2>{ch.title}</h2><p>{ch.text}</p></li>)}</ol>
      <nav className={styles.marks} aria-label="Ir para um capítulo do tour">{chapters.map(ch => <button key={ch.id} data-tour-mark type="button">{ch.id === "farol" ? "Farol" : ch.id === "lateral" ? "Roda e lateral" : "Carro inteiro"}</button>)}</nav>
    </div>
    <figure className={styles.stills} data-tour-static><Image src="/videos/paddock/d/0223.webp" alt="Sedã grafite inteiro, visto de lado no estúdio" width={1280} height={720} sizes="100vw"/><figcaption><h2>O laudo aberto.</h2><p>Tudo o que foi conferido, antes do preço.</p><ul>{reportItems.map(item => <li key={item.id}>✓ {item.title}</li>)}</ul></figcaption></figure>
  </section>
  <section className={styles.inspection} id="paddock-inspecao" aria-labelledby="inspecao-titulo">
    <div className={styles.sectionHead}><p>O que conferimos</p><h2 id="inspecao-titulo">Não basta parecer bem cuidado.</h2><p>Instrumentos, registros e leitura do histórico. A ficha explica o que foi conferido — e a conversa abre cada registro.</p></div>
    <div className={styles.inspectionGrid}>{inspections.map(item => <article key={item.id}>
      <figure className={item.photo === 'por-baixo' ? styles.underPhoto : undefined}><Image src={`/images/paddock/laudo/${item.photo}.webp`} alt={item.alt} width={1536} height={1024} sizes="(max-width:700px) 100vw, 50vw" quality={90}/></figure>
      <div><p className={styles.inspectionLabel}>{item.short}</p><h3>{item.title}</h3><p>{item.text}</p></div>
    </article>)}</div>
  </section>
  <PaddockStock>
    <section className={styles.buying} id="paddock-selecao" aria-labelledby="selecao-titulo"><div className={styles.sectionHead}><p>Como compramos</p><h2 id="selecao-titulo">Se não passa, não entra.</h2><p>O carro chega como candidato. Só entra no estoque depois da inspeção e da análise do histórico. Quando não atende aos critérios, a Paddock recusa.</p></div><div className={styles.decisionFlow}><article><span>Antes de comprar</span><h3>Abrir o histórico.</h3><p>Documentação, registros de manutenção e consulta ao histórico de leilão entram na leitura.</p></article><article><span>Na inspeção</span><h3>Olhar além da lataria.</h3><p>Pintura, diagnóstico, pneus e parte de baixo ajudam a compreender o estado atual.</p></article><article><span>Na decisão</span><h3>Entrar ou ficar de fora.</h3><p>Sem pular a inspeção para completar o estoque. O critério vem antes da negociação.</p></article></div><a className={styles.primary} href="#paddock-interesse">Entender a seleção <Arrow size={18}/></a></section>
    <section className={styles.trade} id="paddock-usado" aria-labelledby="usado-titulo"><div><p className={styles.eyebrow}>A avaliação do seu usado</p><h2 id="usado-titulo">O mesmo olhar para o seu carro.</h2></div><div><p>Para entrar na troca, seu usado passa pelo mesmo roteiro: pintura, diagnóstico, histórico e condição atual.</p><p>A proposta vem depois dessa leitura. Comece contando qual é o seu interesse; os detalhes são esclarecidos na conversa.</p><a className={styles.primary} href="#paddock-interesse" data-inquiry-car="Quero avaliar meu usado">Quero avaliar meu usado <Arrow size={18}/></a></div></section>
    <section className={styles.shop} id="paddock-loja" aria-labelledby="loja-titulo"><div><p>A loja</p><h2 id="loja-titulo">Veja de perto. Converse sem pressa.</h2></div><div><p>Visita com hora marcada e test drive acompanhado. Escolha o carro e traga suas dúvidas sobre o laudo.</p><p>Financiamento: simulamos com você, sem compromisso.</p><p className={styles.warranty}>{legalWarranty}.</p><a className={styles.primary} href="#paddock-interesse">Preparar minha visita <Arrow size={18}/></a></div></section>
    <section className={styles.faq} aria-labelledby="paddock-duvidas"><h2 id="paddock-duvidas">Antes de decidir.</h2><div>{faq.map(item => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div></section>
  </PaddockStock></main>
    <BrandScrollGuide />
  <footer className={styles.footer}><span className={styles.logo}><Mark/>Paddock</span><a href="#paddock-inicio">Voltar ao início ↑</a><p>© 2026 Paddock. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p></footer>
</div>;}
