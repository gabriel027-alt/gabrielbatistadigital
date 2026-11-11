import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lora } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { ModelIcon } from "@/components/ModelIcon";
import { faq, features, firstVisit, planSteps, treatments } from "@/lib/forma";
import { FormaMark } from "./FormaMark";
import { FormaMotion } from "./FormaMotion";
import { SmilePlan } from "./SmilePlan";
import styles from "./forma.module.css";

/** Classic serif with a true italic for this brand's headings (approved version, format of the reference dental sites). */
const serif = Lora({ subsets: ["latin"], style: ["normal", "italic"], weight: ["500"], variable: "--forma-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Forma Odontologia | Implantes, lentes e alinhadores",
  description: "Implantes, lentes de contato dental, alinhadores e clareamento, planejados em proporção a partir de uma avaliação individual.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/odontologia" },
  openGraph: { title: "Forma Odontologia", description: "Implantes, lentes, alinhadores e clareamento.", url: "/modelos/odontologia", images: [{ url: "/images/models/people/odontologia.webp", width: 1600, height: 900, alt: "Dentista conversa com uma paciente no consultório" }] },
};

const book = "#forma-interesse";

export default function FormaPage() {
  return <div className={`${styles.page} ${serif.variable}`} data-model="forma">
    <a className={styles.skip} href="#forma-conteudo">Pular para o conteúdo</a>
    <FormaMotion />
    <header className={styles.header}>
      <a className={styles.logo} href="#forma-inicio" aria-label="Forma Odontologia, início"><FormaMark size={28} />Forma<small>Odontologia</small></a>
      <nav aria-label="Navegação principal"><a href="#planejamento">Planejamento</a><a href="#sobre">A clínica</a><a href="#tratamentos">Tratamentos</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar avaliação</a>
    </header>

    <main id="forma-conteudo">
      <section className={styles.hero} id="forma-inicio" aria-labelledby="forma-titulo">
        <Image className={styles.heroImage} src="/images/models/people/odontologia.webp" alt="Dentista conversa com uma paciente sentada na cadeira do consultório" fill sizes="100vw" preload />
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Odontologia estética e implantes</p>
          <h1 id="forma-titulo">Um sorriso planejado <em>com calma e precisão.</em></h1>
          <p>Implantes, lentes de contato dental, alinhadores e clareamento, definidos depois de uma avaliação individual e explicados etapa por etapa.</p>
          <div className={styles.heroActions}>
            <a className={styles.primary} href={book}>Agendar minha avaliação</a>
            <a className={styles.textLink} href="#planejamento">Ver como planejamos</a>
          </div>
          <ul className={styles.trust} aria-label="Como atendemos">
            <li><ModelIcon name="person" />Avaliação individual</li>
            <li><ModelIcon name="document" />Plano por escrito</li>
            <li><ModelIcon name="scan" />Planejamento digital</li>
          </ul>
        </div>
      </section>

      <section className={styles.features} aria-labelledby="diferenciais-titulo">
        <h2 id="diferenciais-titulo">O cuidado vai além do sorriso</h2>
        <ul>{features.map(item => <li key={item.title}><ModelIcon name={item.icon} /><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>
      </section>

      {/* Brand signature: the smile planned in proportion, in the colours of the clinic photos. */}
      <section className={styles.plan} id="planejamento" aria-labelledby="planejamento-titulo" data-forma-plan>
        <div className={styles.planStage}>
          <div className={styles.planText}>
            <p className={styles.kicker}>Planejamento do sorriso</p>
            <h2 id="planejamento-titulo">Antes do tratamento, <em>o desenho.</em></h2>
            <ol className={styles.planSteps}>{planSteps.map((step, index) => <li key={step.title} data-plan-step>
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{step.title}</strong><p>{step.text}</p>
            </li>)}</ol>
            <a className={styles.primary} href={book}>Quero ver o meu plano</a>
          </div>
          <figure className={styles.planFigure}>
            <SmilePlan className={styles.smile} />
            <figcaption>Ilustração do planejamento. Não representa um paciente.</figcaption>
          </figure>
        </div>
      </section>

      <section className={styles.about} id="sobre" aria-labelledby="sobre-titulo">
        <figure className={styles.aboutPhoto}>
          <Image src="/images/models/people/odontologia-retrato.webp" alt="Dentista explica as alternativas de tratamento a uma paciente" fill sizes="(max-width:900px) 92vw, 44vw" />
          <figcaption className={styles.seal}><FormaMark size={26} />A primeira consulta é uma conversa.</figcaption>
        </figure>
        <div className={styles.aboutCopy}>
          <p className={styles.kicker}>Conheça a clínica</p>
          <h2 id="sobre-titulo">Atenção, planejamento e <em>compromisso com você.</em></h2>
          <p>Na Forma, cada tratamento começa por entender o que você quer mudar. Antes de qualquer decisão, você vê as alternativas possíveis, as etapas e os cuidados de cada uma.</p>
          <ul className={styles.checks}>
            <li>Avaliação sem pressa e exame completo</li>
            <li>Explicações claras sobre cada etapa</li>
            <li>Orçamento por escrito, para decidir com calma</li>
          </ul>
          <a className={styles.textLink} href="#tratamentos">Conhecer os tratamentos</a>
        </div>
      </section>

      <section className={styles.treatments} id="tratamentos" aria-labelledby="tratamentos-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Nossos tratamentos</p>
          <h2 id="tratamentos-titulo">Diferentes tratamentos. Um mesmo objetivo: <em>o seu sorriso.</em></h2>
          <p>Conheça cada tratamento e as perguntas que vale a pena levar para a avaliação.</p>
        </div>
        <div className={styles.cards}>
          {treatments.map(treatment => <article key={treatment.id} className={styles.card} data-treatment={treatment.id}>
            <ModelIcon name={treatment.icon} />
            <h3>{treatment.name}</h3>
            <p>{treatment.summary}</p>
            <details>
              <summary>Como funciona</summary>
              <p className={styles.forWhom}>{treatment.forWhom}</p>
              <ol>{treatment.path.map(step => <li key={step}>{step}</li>)}</ol>
            </details>
          </article>)}
        </div>
        <div className={styles.center}><a className={styles.primary} href={book}>Avaliar meu caso</a></div>
      </section>

      <section className={styles.visit} id="primeira-consulta" aria-labelledby="consulta-titulo">
        <Image className={styles.visitImage} src="/images/models/odontologia.webp" alt="" fill sizes="100vw" />
        <div className={styles.visitInner}>
          <h2 id="consulta-titulo">Como é a <em>primeira consulta</em></h2>
          <p>Uma conversa para entender o que você quer, examinar com cuidado e mostrar os caminhos possíveis.</p>
          <ol>{firstVisit.map(step => <li key={step.title}><strong>{step.title}</strong><span>{step.text}</span></li>)}</ol>
          <a className={styles.primaryLight} href={book}>Quero marcar a primeira consulta</a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.centerHead}>
          <p className={styles.kicker}>Dúvidas frequentes</p>
          <h2 id="duvidas-titulo">Antes de agendar, <em>tire suas dúvidas.</em></h2>
        </div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="forma" />
    </main>

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><FormaMark size={26} />Forma Odontologia</p>
      <nav aria-label="Rodapé"><a href="#planejamento">Planejamento</a><a href="#tratamentos">Tratamentos</a><a href={book}>Agendar avaliação</a></nav>
      <p className={styles.credit}>Projeto conceitual de <Link href="/#modelos">Gabriel Batista Digital</Link>. Marca e imagens criadas para esta demonstração.</p>
    </footer>
  </div>;
}
