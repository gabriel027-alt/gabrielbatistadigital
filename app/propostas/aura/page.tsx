import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Arrow, ArrowDown, ArrowLeft } from "@/components/ui/icons";
import { AuraMotion } from "@/components/AuraMotion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./aura.module.css";

export const metadata: Metadata = {
  title: "Aura · Estudo de landing page para estética",
  description: "Primeira composição de uma clínica fictícia: espaço e primeira avaliação. Estudo autoral de Gabriel Batista Digital.",
  robots: { index: false, follow: false },
};
function Letters({ text }: { text: string }) {
  return <span aria-hidden="true" className={styles.letters}>{text.split(" ").map((word, wordIndex) => <span className={styles.word} key={wordIndex}>{Array.from(word).map((char, index) => <span className={styles.char} key={index} style={{ "--i": index, "--spread": (index - (word.length - 1) / 2) * 8 } as CSSProperties}>{char}</span>)}{" "}</span>)}</span>;
}
export default function AuraProposal() {
  return <AuraMotion>
    <a href="#aura-conteudo" className={styles.skip}>Pular para o conteúdo</a>
    <div className={styles.notice}><Link href="/propostas/gabriel"><ArrowLeft size={12}/> Portfólio de Gabriel</Link><span>Estudo autoral · Clínica fictícia</span></div>
    <header className={styles.header}>
      <a className={styles.brand} href="#aura-conteudo" aria-label="Aura, início">AURA<span>Estética e cuidado com a pele</span></a>
      <nav aria-label="Navegação Aura"><a href="#aura-espaco">O espaço</a><a href="#aura-avaliacao">Primeira avaliação</a></nav>
      <a className={styles.headerContact} href="#aura-contato">Sobre este projeto <Arrow size={14}/></a>
    </header>
    <main id="aura-conteudo">
      <section className={styles.hero} aria-labelledby="aura-title">
        <div className={styles.heroCopy}>
          <h1 id="aura-title"><span className={styles.sr}>Um tempo para cuidar da sua pele.</span><Letters text="Um tempo"/><Letters text="para cuidar"/><Letters text="da sua pele."/></h1>
          <p>Conheça o espaço e entenda como começa o atendimento.</p>
          <a className={styles.button} href="#aura-avaliacao">Conhecer a primeira avaliação <ArrowDown size={20}/></a>
        </div>
        <figure id="aura-espaco" className={styles.heroImage}>
          <Image src="/images/concepts/aura-cuidado.webp" alt="Sala ilustrativa de cuidados com a pele, com luz natural e uma maca preparada" fill preload sizes="(max-width: 800px) 100vw, 60vw" />
          <figcaption>Um espaço imaginado para este estudo.</figcaption>
        </figure>
        <div className={styles.heroFoot}><span>AURA — estudo de identidade digital</span><a href="#aura-avaliacao">Continue a experiência <ArrowDown size={16}/></a></div>
      </section>
      <section id="aura-avaliacao" className={styles.evaluation} aria-labelledby="aura-evaluation-title">
        <div className={styles.evaluationIntro}>
          <h2 id="aura-evaluation-title"><span className={styles.sr}>Antes de escolher, converse.</span><Letters text="Antes de"/><Letters text="escolher,"/><Letters text="converse."/></h2>
          <figure className={styles.reception}><Image src="/images/concepts/aura-escuta.webp" alt="Recepção ilustrativa com poltronas, madeira e iluminação natural" width={1200} height={800} sizes="(max-width: 800px) 100vw, 50vw"/><figcaption>Imagens ilustrativas. Não representam uma clínica em funcionamento.</figcaption></figure>
        </div>
        <div className={styles.evaluationCopy}>
          <p className={styles.intro}>A primeira conversa é um espaço para explicar o que você procura e fazer perguntas antes de decidir.</p>
          <div className={styles.steps}>
            <details open><summary>O que você procura <span aria-hidden="true">+</span></summary><p>Conte o que motivou seu contato, o que espera do atendimento e quais dúvidas gostaria de esclarecer.</p></details>
            <details><summary>O que precisa saber <span aria-hidden="true">+</span></summary><p>Pergunte quem realiza o atendimento, como funciona a avaliação e quais são as condições e os limites do cuidado proposto.</p></details>
            <details><summary>Como continuar <span aria-hidden="true">+</span></summary><p>Antes de marcar, confirme disponibilidade, valores e informações sobre a primeira visita com a equipe responsável.</p></details>
          </div>
          <p className={styles.studyNote}>Nesta demonstração, a clínica é fictícia. Não realizamos avaliações nem recebemos dados de pacientes.</p>
        </div>
      </section>
    </main>
    <footer id="aura-contato" className={styles.footer}>
      <div><p>Uma página assim<br/>para a sua clínica.</p><span>Design e desenvolvimento por Gabriel Batista Digital.</span></div>
      <a className={styles.button} href={buildWhatsAppUrl("Olá, Gabriel! Vi o estudo Aura e quero conversar sobre uma landing page para minha clínica.")} target="_blank" rel="noopener noreferrer">Conversar com Gabriel <Arrow size={20}/></a>
      <Link href="/conceitos/aura-aesthetics">Ver o estudo anterior</Link>
    </footer>
  </AuraMotion>;
}
