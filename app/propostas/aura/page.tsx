import type { Metadata } from "next";
import Image from "next/image";
import { Arrow } from "@/components/ui/icons";
import { AuraComparison } from "@/components/AuraComparison";
import { AuraPhotoSequence } from "@/components/AuraPhotoSequence";
import { AuraMotion } from "@/components/AuraMotion";
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
      <AuraPhotoSequence><section className={styles.heroTrack} data-hero-track aria-labelledby="aura-title">
        <div className={styles.stage} data-hero-stage>
          <figure className={styles.portrait} data-portrait><Image src="/images/aura-sequence/portrait.webp" alt="Retrato editorial feminino, com pele natural e luz em tons de cobre" fill preload sizes="100vw" /></figure>
          <header className={styles.header}>
            <a href="#aura-conteudo" className={styles.brand} aria-label="Aura, início">aura</a>
            <span className={styles.specialty}>Harmonização facial</span>
            <nav aria-label="Navegação Aura"><a href="#aura-olhar">O olhar</a><a href="#aura-comparacao">Comparar</a><a href="#aura-avaliacao">A abordagem</a></nav>
          </header>
          <div className={styles.heroCopy} data-hero-copy>
            <h1 id="aura-title"><span className={styles.sr}>Sua expressão. Em primeiro plano.</span><Letters text="Sua expressão." hero/><Letters text="Em primeiro" hero/><Letters text="plano." hero/></h1>
            <div className={styles.heroOffer}><p>Harmonização facial com atenção<br className={styles.desktopBreak}/> ao rosto inteiro.</p><a className={styles.button} href="#aura-olhar">Ver o rosto em detalhe <Arrow size={22}/></a></div>
          </div>
          <p className={styles.heroSignature} data-hero-signature>Proporção. Expressão. Identidade.</p>
        </div>
      </section></AuraPhotoSequence>
      <AuraComparison/>
      <section id="aura-avaliacao" className={styles.brandEnding} aria-labelledby="aura-approach-title">
        <p className={styles.endingEyebrow}>O olhar Aura</p>
        <h2 id="aura-approach-title">A harmonia está<br/>no conjunto.</h2>
        <div className={styles.endingBody}>
          <p>Proporção, expressão e características individuais fazem parte da leitura facial. Cada escolha precisa considerar o que você deseja mudar e o que quer preservar.</p>
          <a className={styles.endingLink} href="#aura-comparacao">Rever a comparação <Arrow size={20}/></a>
        </div>
      </section>
    </main>
    <footer className={styles.brandFooter}>
      <div className={styles.brandWordmark} aria-hidden="true">aura</div>
      <div className={styles.brandColophon}><span>Harmonização facial</span><a href="#aura-conteudo">Voltar ao início ↑</a></div>
    </footer>
  </AuraMotion>;
}
