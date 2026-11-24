import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newsreader, Nunito_Sans } from "next/font/google";
import { BrandInquiry } from "@/components/BrandInquiry";
import { StickyCall } from "@/components/brand/StickyCall";
import { Arrow } from "@/components/ui/icons";
import { doctor, faq, paths, steps } from "@/lib/elo";
import { EloMark } from "./EloMark";
import { EloPath } from "./EloPath";
import styles from "./elo.module.css";

/** Newsreader: a calm reading serif for titles. Nunito Sans: soft and very legible. A pair new to the portfolio. */
const display = Newsreader({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--elo-display", display: "swap" });
const text = Nunito_Sans({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--elo-text", display: "swap" });

export const metadata: Metadata = {
  title: "Elo | Medicina reprodutiva",
  description: "Medicina reprodutiva para quem quer ter filhos agora ou depois. Um passo de cada vez, com Luísa Andrade, médica.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/modelos/fertilidade" },
};

const book = "#elo-interesse";
const photo = (name: string) => `/images/elo/${name}.webp`;
/** The two rings of the mark, as a divider (elemento-assinatura). */
const Rings = () => <span className={styles.rings} aria-hidden="true"><EloMark size={26} /></span>;

/**
 * Elo (docs/PROJETOS-ESTATICOS.md), the fourth static brand: no scene follows the scroll. The identity is the couple
 * small in the landscape on pastel film, the two rings and the path of five stops. Never a baby, a bump or a rate.
 */
export default function EloPage() {
  return <div className={`${styles.page} ${display.variable} ${text.variable}`} data-model="elo" id="elo-inicio">
    <a className={styles.skip} href="#elo-conteudo">Pular para o conteúdo</a>
    <header className={styles.header}>
      <a className={styles.logo} href="#elo-inicio"><EloMark size={30} /><span>Elo<small>Medicina reprodutiva</small></span></a>
      <nav aria-label="Navegação principal"><a href="#caminho">O caminho</a><a href="#possibilidades">Possibilidades</a><a href="#quem-acompanha">Quem acompanha</a><a href="#duvidas">Dúvidas</a></nav>
      <a className={styles.headerCta} href={book}>Agendar consulta</a>
    </header>

    <main id="elo-conteudo">
      {/* The couple, small on the path; the words on the soft foliage, left. */}
      <section className={styles.hero} aria-labelledby="elo-titulo">
        <div className={styles.heroPhoto}><Image src={photo("trilha")} alt="Um casal de costas, de mãos dadas, caminhando por uma trilha num parque arborizado" fill preload sizes="(max-width:700px) 220vw, 100vw" quality={88} /></div>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>Medicina reprodutiva</p>
          <h1 id="elo-titulo">Um passo de cada vez, <em>e você sabe qual é o próximo.</em></h1>
          <p className={styles.heroText}>Para quem quer ter filhos agora ou depois. O caminho começa por entender o seu caso.</p>
          <div className={styles.calls} data-hero-calls><a className={styles.primary} href={book}>Agendar a primeira consulta <Arrow size={20} /></a><a className={styles.secondary} href="#caminho">Ver o caminho</a></div>
          <a className={styles.who} href="#quem-acompanha"><Image src={photo("medica")} alt="" width={44} height={44} /><span>Primeira consulta com <strong>{doctor.name}</strong>, {doctor.role}</span></a>
        </div>
      </section>

      <section className={styles.pathSection} id="caminho" aria-labelledby="caminho-titulo">
        <div className={styles.sectionHead}><Rings /><h2 id="caminho-titulo">Por onde começar quando nada está claro</h2><p>Cinco paradas, uma de cada vez. Toque em cada uma para ver o que acontece nela.</p></div>
        <EloPath />
      </section>

      <section className={styles.hands} aria-labelledby="maos-titulo">
        <figure className={styles.handsPhoto}><Image src={photo("maos")} alt="As mãos de um casal entrelaçadas sobre a mesa da cozinha, ao lado de duas xícaras de café" fill sizes="(max-width:860px) 100vw, 55vw" quality={88} /></figure>
        <div className={styles.handsCopy}>
          <h2 id="maos-titulo">A espera pesa menos quando se sabe o que vem depois.</h2>
          <p>Cada etapa tem um porquê, explicado antes. E, entre uma consulta e outra, há a quem perguntar.</p>
        </div>
      </section>

      <section className={styles.paths} id="possibilidades" aria-labelledby="possibilidades-titulo">
        <div className={styles.sectionHead}><Rings /><h2 id="possibilidades-titulo">Nem sempre é FIV.</h2><p>As possibilidades, da mais simples à mais complexa. A avaliação diz qual faz sentido para você.</p></div>
        <ol className={styles.pathList}>{paths.map((item, i) => <li key={item.name}><span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><h3>{item.name}</h3><p>{item.text}</p></li>)}</ol>
        <a className={styles.primary} href={book}>Conversar sobre o meu caso <Arrow size={20} /></a>
      </section>

      <section className={styles.bench} aria-labelledby="banco-titulo">
        <figure className={styles.benchPhoto}><Image src={photo("banco")} alt="O mesmo casal sentado num banco de praça arborizada; ela encosta a cabeça no ombro dele" fill sizes="100vw" quality={88} /></figure>
        <div className={styles.benchCopy}>
          <h2 id="banco-titulo">Em casal ou sozinha, no seu tempo.</h2>
          <p>A consulta é para quem quer ter filhos, de qualquer jeito de família. E também para quem quer apenas entender as opções antes de decidir.</p>
        </div>
      </section>

      <section className={styles.steps} id="como-funciona" aria-labelledby="como-titulo">
        <figure className={styles.notebook}><Image src={photo("caderno")} alt="Um caderno aberto com anotações, uma caneta e um pequeno calendário de mesa" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <h2 id="como-titulo">Como é a primeira consulta</h2>
          <ol className={styles.stepList}>{steps.map(item => <li key={item.title}><h3>{item.title}</h3><p>{item.text}</p></li>)}</ol>
        </div>
      </section>

      <section className={styles.doctor} id="quem-acompanha" aria-labelledby="medica-titulo">
        <figure className={styles.doctorPhoto}><Image src={photo("medica")} alt="Luísa Andrade, médica, de jaleco, num jardim arborizado" fill sizes="(max-width:860px) 100vw, 40vw" quality={88} /></figure>
        <div>
          <h2 id="medica-titulo">Quem acompanha você do primeiro ao último passo.</h2>
          <p>Sou a {doctor.first}. Eu gosto de começar ouvindo a história de cada um, sem pressa, e de explicar cada exame e cada possibilidade antes de qualquer decisão. Você nunca sai de uma consulta sem saber qual é o próximo passo.</p>
          <p className={styles.reception}>A recepção responde às mensagens, marca as consultas e ajuda com a ordem dos exames.</p>
          <a className={styles.primary} href={book}>Agendar consulta com a {doctor.first} <Arrow size={20} /></a>
        </div>
      </section>

      <section className={styles.faq} id="duvidas" aria-labelledby="duvidas-titulo">
        <div className={styles.sectionHead}><Rings /><h2 id="duvidas-titulo">Perguntas que quase todo mundo faz</h2></div>
        <div className={styles.faqList}>{faq.map(item => <details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div>
      </section>

      <BrandInquiry brand="elo" />
    </main>

    <StickyCall href={book} label="Agendar consulta" className={styles.stickyCall} />

    <footer className={styles.footer}>
      <p className={styles.footerBrand}><EloMark size={22} />Elo</p>
      <nav aria-label="Rodapé"><a href="#caminho">O caminho</a><a href="#possibilidades">Possibilidades</a><a href={book}>Agendar consulta</a></nav>
      <p className={styles.credit}>© 2026 Elo. Site por <Link href="/#editorial-work">Gabriel Batista Digital</Link>.</p>
    </footer>
  </div>;
}
