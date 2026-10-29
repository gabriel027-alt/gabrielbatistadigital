import { conceptDetails } from "@/lib/concept-content";
import { ConceptExplorer } from "@/components/ConceptExplorer";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  Arrow as ArrowUpRight,
} from "@/components/ui/icons";
import { concepts } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { ConceptPhoto } from "@/components/ConceptPhoto";
export const dynamicParams = false;
export function generateStaticParams() {
  return concepts.map(({ slug }) => ({ slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = concepts.find((item) => item.slug === slug);
  if (!project) return {};
  const title = `${project.name} · Demonstração conceitual`;
  return {
    title,
    description: project.description,
    robots: { index: false, follow: true },
    alternates: { canonical: `/conceitos/${slug}` },
    openGraph: {
      title,
      description: project.description,
      url: `/conceitos/${slug}`,
    },
  };
}
export default async function ConceptPage({ params }: Props) {
  const { slug } = await params;
  const project = concepts.find((item) => item.slug === slug);
  if (!project) notFound();
  const details = conceptDetails[project.theme];
  return (
    <div className={`concept-demo ${project.theme}`}>
      <a className="skip-link" href="#demo-main">
        Pular para o conteúdo
      </a>
      <div className="demo-notice">
        <Link href="/#portfolio">
          <ArrowLeft size={13} /> Voltar ao portfólio
        </Link>
        <span>PROTÓTIPO CONCEITUAL · MARCA FICTÍCIA</span>
      </div>
      <header className="demo-header">
        <Link className="demo-wordmark" href={`/conceitos/${project.slug}`}>
          {project.name}
          <span>{project.category}</span>
        </Link>
        <nav aria-label={`Navegação ${project.name}`}>
          <a href="#colecao">
            {project.theme === "chronos"
              ? "Coleção"
              : project.theme === "vanguard"
                ? "Espaços"
                : "Experiência"}
          </a>
          <a href="#filosofia">Filosofia</a>
          <a href="#demo-contato">
            Conectar <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>
      <main id="demo-main">
        <section className="demo-hero">
          <div className="demo-hero-copy">
            <p className="eyebrow">{project.category} · ESTUDO DIGITAL 01—03</p>
            <h1>{project.headline}</h1>
            <p>{project.intro}</p>
            <a className="demo-button" href="#colecao">
              {project.theme === "chronos" ? "Explorar a coleção" : project.theme === "vanguard" ? "Ver os projetos" : "Entender a jornada"} <ArrowDown size={15} />
            </a>
          </div>
          <div className="demo-hero-art">
            <ConceptPhoto theme={project.theme} preload />
            <span>ESTÉTICA. INTENÇÃO. IDENTIDADE.</span>
          </div>
        </section>
        <section id="colecao" className="demo-collection">
          <div className="demo-section-heading">
            <p className="eyebrow">01 / EXPLORAR</p>
            <h2>{details.section}</h2>
          </div>
          <div className="demo-item-grid">
            {details.items.map((item, index) => (
              <a key={item.title} className="demo-item" href={`#detalhe-${index}`}>
                <div className={`demo-item-art item-${index}`}>
                  <ConceptPhoto theme={project.theme} image={item.image} alt={item.subtitle} />
                  <span>0{index + 1}</span>
                </div>
                <h3>
                  {item.title}
                  <ArrowUpRight size={17} />
                </h3>
                <p>{item.subtitle}</p>
              </a>
            ))}
          </div>
        </section>
        <ConceptExplorer theme={project.theme} />
        <section id="filosofia" className="demo-philosophy">
          <p className="eyebrow">02 / FILOSOFIA</p>
          <div>
            <h2>{project.story}</h2>
            <p>{project.storyText}</p>
          </div>
        </section>
        <section className="demo-details" aria-label="Detalhes do conceito">
          {details.items.map((item, index) => (
            <article id={`detalhe-${index}`} key={item.title}>
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>
                {item.detail}
              </p>
              <p className="demo-detail-note">{item.use}</p>
              <a href="#demo-contato">
                {details.inquiry} <ArrowUpRight size={16} />
              </a>
            </article>
          ))}
        </section>
        <section id="demo-contato" className="demo-contact">
          <p className="eyebrow">DO CONCEITO AO SEU NEGÓCIO</p>
          <h2>
            Sua marca pode ser
            <br />a próxima história.
          </h2>
          <p>
            Esta é uma demonstração da Gabriel Batista Digital.
            <br />
            Fale com a agência para criar seu projeto.
          </p>
          <a
            href={siteConfig.contactUrl}
            className="demo-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.cta} <ArrowUpRight size={17} />
          </a>
        </section>
      </main>
      <footer className="demo-footer">
        <span>{project.name} · Conceito autoral</span>
        <Link href="/#portfolio">
          Gabriel Batista Digital <ArrowUpRight size={14} />
        </Link>
      </footer>
    </div>
  );
}
