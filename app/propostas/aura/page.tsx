import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/icons";
import { AuraComparison } from "@/components/AuraComparison";
import { AuraPhotoSequence } from "@/components/AuraPhotoSequence";
import { AuraMotion } from "@/components/AuraMotion";
import { auraProjectContact } from "@/lib/aura-contact";
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
            <nav aria-label="Navegação Aura"><a href="#aura-olhar">O olhar</a><a href="#aura-avaliacao">Seu próximo site</a><a href="#aura-contato">Falar com Gabriel</a></nav>
          </header>
          <div className={styles.heroCopy} data-hero-copy>
            <h1 id="aura-title"><span className={styles.sr}>Sua expressão. Em primeiro plano.</span><Letters text="Sua expressão." hero/><Letters text="Em primeiro" hero/><Letters text="plano." hero/></h1>
            <div className={styles.heroOffer}><p>Harmonização facial com atenção<br className={styles.desktopBreak}/> ao rosto inteiro.</p><a className={styles.button} href="#aura-olhar">Ver o rosto em detalhe <Arrow size={22}/></a></div>
          </div>
          <p className={styles.heroSignature} data-hero-signature>Proporção. Expressão. Identidade.</p>
        </div>
      </section></AuraPhotoSequence>
      <AuraComparison/>
      <section id="aura-avaliacao" className={styles.evaluation} aria-labelledby="aura-project-title">
        <div className={styles.projectClosing}>
          <div><p className={styles.projectEyebrow}>Para a sua clínica</p><h2 id="aura-project-title">O cuidado começa<br/>antes do primeiro contato.</h2></div>
          <div className={styles.projectOffer}>
            <p>Seu site pode apresentar os procedimentos com clareza, expressar a identidade da clínica e facilitar a conversa pelo WhatsApp.</p>
            <a className={styles.button} href={auraProjectContact} target="_blank" rel="noopener noreferrer">Falar sobre meu site no WhatsApp <Arrow size={22}/></a>
            <p className={styles.contactNote}>Você fala com Gabriel, responsável pelo design e desenvolvimento.</p>
          </div>
        </div>
        <div className={styles.ownerQuestions}>
          <h3>O que precisamos para começar?</h3>
          <div className={styles.steps}>
            <details><summary>Ainda não tenho fotos e textos. <span aria-hidden="true">+</span></summary><p>Na conversa inicial, identificamos quais materiais você já tem e o que precisa ser produzido. Imagens de pacientes e informações profissionais exigem autorização e revisão dos responsáveis.</p></details>
            <details><summary>Quero algo com a identidade da minha clínica. <span aria-hidden="true">+</span></summary><p>A Aura mostra uma direção possível. O seu projeto parte da sua marca, dos seus serviços e das pessoas que você quer atender.</p></details>
            <details><summary>Como definimos o projeto? <span aria-hidden="true">+</span></summary><p>Conte qual é a sua clínica, o que já existe hoje e o que você quer melhorar. A partir dessa conversa, alinhamos prioridades, escopo e proposta.</p></details>
          </div>
        </div>
      </section>
    </main>
    <footer id="aura-contato" className={styles.footer}>
      <div className={styles.footerTop}><p>Vamos pensar no site<br/>da sua clínica.</p><a className={styles.button} href={auraProjectContact} target="_blank" rel="noopener noreferrer">Falar sobre meu site no WhatsApp <Arrow size={20}/></a></div>
      <div className={styles.footerBrand} aria-hidden="true">aura</div>
      <div className={styles.colophon}><span>Aura · Harmonização facial</span><Link href="/propostas/gabriel">Design e desenvolvimento por Gabriel Batista Digital <Arrow size={13}/></Link></div>
    </footer>
  </AuraMotion>;
}
