import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/icons";
import { AuraMotion } from "@/components/AuraMotion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./aura.module.css";

export const metadata: Metadata = {
  title: "Aura · Harmonização facial",
  description: "Identidade, expressão e um olhar para o rosto inteiro. Conheça o projeto Aura, por Gabriel Batista Digital.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/propostas/aura" },
};
function Letters({ text, hero = false }: { text: string; hero?: boolean }) {
  return <span aria-hidden="true" className={styles.line}>{text.split(" ").map((word, wordIndex) => <span className={styles.word} key={wordIndex}>{Array.from(word).map((char, index) => <span className={styles.char} data-hero-glyph={hero ? "" : undefined} data-glyph={!hero ? "" : undefined} key={index}>{char}</span>)}{wordIndex < text.split(" ").length - 1 ? "\u00a0" : ""}</span>)}</span>;
}
export default function AuraProposal() {
  return <AuraMotion>
    <a href="#aura-conteudo" className={styles.skip}>Pular para o conteúdo</a>
    <main id="aura-conteudo">
      <section className={styles.heroTrack} data-hero-track aria-labelledby="aura-title">
        <div className={styles.stage} data-hero-stage>
          <figure className={styles.portrait} data-portrait><Image src="/images/aura-editorial/portrait.webp" alt="Retrato editorial feminino, com pele natural e luz em tons de cobre" fill preload sizes="100vw" /></figure>
          <header className={styles.header}>
            <a href="#aura-conteudo" className={styles.brand} aria-label="Aura, início">aura</a>
            <span className={styles.specialty}>Harmonização facial</span>
            <nav aria-label="Navegação Aura"><a href="#aura-olhar">O olhar</a><a href="#aura-avaliacao">A avaliação</a><a href="#aura-contato">Contato</a></nav>
          </header>
          <div className={styles.heroCopy} data-hero-copy>
            <h1 id="aura-title"><span className={styles.sr}>Sua expressão. Em primeiro plano.</span><Letters text="Sua expressão." hero/><Letters text="Em primeiro" hero/><Letters text="plano." hero/></h1>
            <div className={styles.heroOffer}><p>Harmonização facial com atenção<br className={styles.desktopBreak}/> ao rosto inteiro.</p><a className={styles.button} href="#aura-avaliacao">Entender a avaliação <Arrow size={22}/></a></div>
          </div>
          <p className={styles.heroSignature} data-hero-signature>Proporção. Expressão. Identidade.</p>
          <p className={styles.transitionText} data-transition-text aria-hidden="true">Um detalhe muda.<br/>A expressão é sua.</p>
        </div>
      </section>
      <section id="aura-olhar" className={styles.manifesto} data-manifesto aria-labelledby="aura-manifesto-title">
        <div className={styles.orbits} aria-hidden="true" data-orbits><span/><span/><span/></div>
        <h2 id="aura-manifesto-title"><span className={styles.sr}>O seu rosto. Por inteiro.</span><Letters text="O seu rosto."/><Letters text="Por inteiro."/></h2>
        <p className={styles.manifestoCopy}><span className={styles.sr}>Antes de olhar para um detalhe, é preciso entender o conjunto.</span><span aria-hidden="true">{"Antes de olhar para um detalhe, é preciso entender o conjunto.".split(" ").map((word, index) => <span key={index} data-copy-word>{word}{" "}</span>)}</span></p>
        <p className={styles.manifestoFoot}>O ponto de partida é você.</p>
      </section>
      <section id="aura-avaliacao" className={styles.evaluation} aria-labelledby="aura-evaluation-title">
        <div className={styles.evaluationHeading}><p>A avaliação facial</p><h2 id="aura-evaluation-title">O que você quer mudar.<br/>O que quer preservar.</h2></div>
        <div className={styles.evaluationGrid}>
          <figure className={styles.space}><Image src="/images/concepts/aura-escuta.webp" alt="Ambiente de recepção com materiais naturais e iluminação suave" width={1200} height={800} sizes="(max-width: 800px) 100vw, 48vw"/><figcaption>Espaço para conversar. Tempo para decidir.</figcaption></figure>
          <div className={styles.evaluationCopy}><p className={styles.intro}>Uma mudança no rosto começa por entender sua motivação. A avaliação reúne o que você deseja, as características faciais e os limites de cada possibilidade.</p>
            <div className={styles.steps}>
              <details open><summary>Seu objetivo <span aria-hidden="true">+</span></summary><p>Quais detalhes incomodam? O que você deseja manter? Essas perguntas ajudam a esclarecer a expectativa antes de falar em procedimentos.</p></details>
              <details><summary>Possibilidades e limites <span aria-hidden="true">+</span></summary><p>Indicações, riscos, alternativas e cuidados precisam ser discutidos em avaliação individual com o profissional responsável.</p></details>
              <details><summary>Uma decisão informada <span aria-hidden="true">+</span></summary><p>Antes de decidir, esclareça as etapas, os valores, o acompanhamento e o tempo de recuperação do que for proposto. Não é necessário decidir no primeiro contato.</p></details>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer id="aura-contato" className={styles.footer}>
      <div className={styles.footerTop}><p>Uma nova perspectiva.<br/>A mesma essência.</p><a className={styles.contact} href={buildWhatsAppUrl("Olá, Gabriel! Conheci o projeto Aura e quero conversar sobre uma página para minha clínica.")} target="_blank" rel="noopener noreferrer">Falar com Gabriel sobre o projeto <Arrow size={20}/></a></div>
      <div className={styles.footerBrand} aria-hidden="true">aura</div>
      <div className={styles.colophon}><span>Aura · Harmonização facial</span><Link href="/propostas/gabriel">Design e desenvolvimento por Gabriel Batista Digital <Arrow size={13}/></Link></div>
    </footer>
  </AuraMotion>;
}
