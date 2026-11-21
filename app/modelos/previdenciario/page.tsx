import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { Arrow } from "@/components/ui/icons";
import { BrandInquiry } from "@/components/BrandInquiry";
import { lawyer, documents, faq, practiceAreas, situations, periods, stages } from "@/lib/arrimo";
import { ArrimoMark } from "./ArrimoMark";
import { ArrimoMotion } from "./ArrimoMotion";
import styles from "./arrimo.module.css";
import { ScrollHint } from "@/components/brand/ScrollHint";

const display = Barlow_Condensed({ subsets: ["latin"], weight: ["600", "700"], variable: "--arrimo-display", display: "swap" });
const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--arrimo-body", display: "swap" });
export const metadata: Metadata = {
  title: "Arrimo | Advocacia Previdenciária",
  description: "A decisão do INSS, os documentos e os registros da vida profissional: a análise começa por compreender a sua história.",
  robots: { index: false, follow: true }, alternates: { canonical: "/modelos/previdenciario" },
};

export default function ArrimoPage() {
  return <div className={`${styles.page} ${display.variable} ${body.variable}`} data-model="arrimo">
    <a className={styles.skip} href="#arrimo-conteudo">Pular para o conteúdo</a>
    <ArrimoMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#arrimo-inicio" aria-label="Arrimo Advocacia Previdenciária, início"><ArrimoMark /><span>Arrimo<small>Advocacia Previdenciária</small></span></a>
      <nav aria-label="Navegação principal"><a href="#arrimo-areas">Atuação</a><a href="#arrimo-escritorio">O escritório</a><a href="#arrimo-interesse">Preparar conversa ↓</a></nav>
    </header>
    <main id="arrimo-conteudo">
      <section id="arrimo-inicio" className={styles.hero} aria-labelledby="arrimo-titulo">
        <figure className={styles.heroPhoto}><Image src="/images/arrimo/hero.webp" alt="Ricardo Teles, de braços cruzados, em um retrato preto e branco com luz lateral" fill sizes="(max-width:760px) 200vw, 120vw" quality={90} preload /></figure>
        <div className={styles.heroCopy}>
          <p className={styles.field} data-arrimo-arrival>Direito previdenciário</p>
          <h1 id="arrimo-titulo" data-arrimo-arrival><span>O INSS negou?</span>{" "}<span>Isso ainda</span>{" "}<span>não é o fim.</span></h1>
          <p className={styles.intro} data-arrimo-arrival>Antes de escolher um caminho, é preciso entender a negativa e conferir os documentos da sua história.</p>
          <a className={styles.primary} href="#arrimo-tempo" data-arrimo-arrival>Entender a análise <span aria-hidden="true">↓</span></a>
          <a className={styles.signature} href="#arrimo-escritorio" data-arrimo-arrival>
            <span className={styles.thumb}><Image src="/images/arrimo/hero.webp" alt="" fill sizes="52px" quality={90} /></span>
            <span>Com <strong>{lawyer.name}</strong>, {lawyer.role}</span>
          </a>
          <p className={styles.heroNote} data-arrimo-arrival>Cada ano trabalhado conta.</p>
        </div>
        <span className={styles.heroRule} aria-hidden="true" />
      </section>

      <section className={styles.situations} id="arrimo-situacoes" aria-labelledby="situacoes-titulo">
        <div className={styles.sectionHead}><h2 id="situacoes-titulo">Isso é pra você?</h2><p>Histórias diferentes. Um começo em comum: entender o que aconteceu e o que os documentos mostram.</p></div>
        <div className={styles.situationGrid}>{situations.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p><a href="#arrimo-interesse">Quero entender meu caso <span aria-hidden="true"><Arrow size={18} /></span></a></article>)}</div>
      </section>

      <section id="arrimo-tempo" className={styles.scene} data-arrimo-scene aria-labelledby="arrimo-tempo-titulo">
        <div className={styles.stage}><ScrollHint desktop="Role para somar o tempo." phone="Deslize para somar o tempo." tone="light" desktopAlign="right" />
          <div className={styles.sceneHead}>
            <h2 id="arrimo-tempo-titulo"><span>O tempo</span>{" "}<span>se soma.</span></h2>
            <p className={styles.sceneIntro}>A vida de trabalho nem sempre aparece inteira em um registro. Quando há uma negativa, a leitura começa pelos documentos.</p>
          </div>

          <div className={styles.ruler} data-arrimo-ruler>
            <div className={styles.rule} aria-hidden="true">
              <i data-arrimo-rule />
              {[0, 1].map(i => <span key={i} className={styles.gap} data-gap-index={i}>
                <i data-arrimo-gap /><b data-arrimo-bridge />
                <span className={styles.gapMissing} data-arrimo-missing>Registro ausente</span>
                <span className={styles.gapFound} data-arrimo-found>Registro localizado</span>
              </span>)}
            </div>
            <ol className={styles.periods}>
              {periods.map((period) => <li key={period.title} className={styles.period} data-arrimo-period>
                <p className={styles.record}>{period.record}</p><h3>{period.title}</h3><p className={styles.periodDetail}>{period.detail}</p>
                <span className={styles.documentLines} aria-hidden="true" /><span className={styles.node} aria-hidden="true" />
              </li>)}
            </ol>
          </div>

          <div className={styles.sceneFoot}>
            <ol className={styles.phases} aria-label="Etapas da análise">
              {stages.map(stage => <li key={stage.title} data-arrimo-phase><h3>{stage.title}</h3><p>{stage.text}</p></li>)}
            </ol>
            <div className={styles.decision} data-arrimo-decision role="img" aria-label="Da negativa à análise dos documentos">
              <span className={styles.decisionLabel}>Leitura dos documentos</span>
              <span className={styles.denied} data-arrimo-denied aria-hidden="true">Negado<i className={styles.strike} data-arrimo-strike /></span>
              <span className={styles.review} data-arrimo-review>Em análise</span>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.areas} id="arrimo-areas" aria-labelledby="areas-titulo">
        <div className={styles.sectionHead}><h2 id="areas-titulo">Onde a Arrimo atua.</h2><p>Da preparação do pedido à leitura de uma negativa, cada assunto pede uma análise própria.</p></div>
        <div className={styles.posters}>{practiceAreas.map(area => <article key={area.title} className={styles.poster} data-arrimo-poster>
          {area.image && <figure className={styles.workshop}><Image src="/images/arrimo/oficina.webp" alt="Trabalhador de costas em uma oficina de serralheria, iluminada pelo sol da porta" fill sizes="(max-width:760px) 120vw, 60vw" quality={90} /></figure>}
          <span className={styles.posterTag}>{area.tag}</span><h3>{area.title}</h3><p>{area.text}</p><a href="#arrimo-interesse">Conversar sobre este assunto <span aria-hidden="true"><Arrow size={18} /></span></a><i className={styles.posterRule} data-arrimo-poster-rule aria-hidden="true" />
        </article>)}</div>
      </section>
      <section className={styles.documents} id="arrimo-documentos" aria-labelledby="documentos-titulo">
        <div className={styles.documentIntro}><h2 id="documentos-titulo">O que levar para a primeira conversa.</h2><p>Comece pelo que você já tem. A lista ajuda a organizar os registros; os documentos necessários dependem do seu caso.</p><a href="#arrimo-interesse" className={styles.darkButton}>Preparar minha conversa <span aria-hidden="true"><Arrow size={18} /></span></a></div>
        <ul className={styles.checklist}>{documents.map(item => <li key={item.title}><span aria-hidden="true">✓</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ul>
        <p className={styles.documentNote}>Guarde os originais. Não compartilhe senhas do Meu INSS ou de outros serviços.</p>
      </section>
      <section className={styles.office} id="arrimo-escritorio" aria-labelledby="escritorio-titulo">
        <figure><Image src="/images/arrimo/atendimento.webp" alt="Ricardo Teles explicando um documento a um casal de idosos à mesa do escritório" fill sizes="(max-width:760px) 150vw, 100vw" quality={90} /></figure>
        <div className={styles.officeCopy}><p className={styles.field}>O escritório</p><h2 id="escritorio-titulo">{lawyer.name}</h2><p>Sou o Ricardo, advogado previdenciarista. Meu trabalho começa por ouvir a sua história e entender o que os documentos mostram.</p><p>Organizo os registros e explico os caminhos possíveis, com os limites de cada um. Antes de definir um encaminhamento, preciso compreender o seu caso.</p><a className={styles.primary} href="#arrimo-interesse">Preparar a primeira conversa <span aria-hidden="true"><Arrow size={18} /></span></a></div>
      </section>
      <section className={styles.faq} id="arrimo-duvidas" aria-labelledby="duvidas-titulo"><h2 id="duvidas-titulo">Antes de seguir, suas dúvidas.</h2><div>{faq.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>
      <BrandInquiry brand="arrimo" />
    </main>
    <footer className={styles.footer}>
      <span className={styles.footerMark}><ArrimoMark size={24} />Arrimo</span>
      <a href="#arrimo-inicio">Voltar ao início ↑</a>
      <p>© 2026 Arrimo. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
