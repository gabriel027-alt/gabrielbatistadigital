import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import "@/app/propostas.css";

const contact = buildWhatsAppUrl("Olá, Gabriel! Quero conversar sobre a Proposta A (Atelier Nocturne).");

const projects = [
  {
    title: "Chronos Atelier",
    category: "Alta Relojoaria & Manufatura",
    image: "/images/screens/chronos-atelier-desktop.webp",
    link: "/conceitos/chronos-atelier",
    domain: "chronosatelier.com",
  },
  {
    title: "Orla Residências",
    category: "Arquitetura & Imóveis de Luxo",
    image: "/images/models/previews-branded/imoveis.webp",
    link: "/modelos/imoveis",
    domain: "orlaresidencias.com.br",
  },
  {
    title: "Vanguard Design",
    category: "Engenharia de Software & Produto",
    image: "/images/screens/vanguard-desktop.webp",
    link: "/conceitos/vanguard",
    domain: "vanguard.studio",
  },
  {
    title: "Aura Aesthetics",
    category: "Medicina de Alta Precisão",
    image: "/images/screens/aura-aesthetics-desktop.webp",
    link: "/conceitos/aura-aesthetics",
    domain: "auraaesthetics.com.br",
  },
];

export default function PropostaAPage() {
  return (
    <div className="proposta-a">
      <header className="proposta-nav-wrap">
        <nav className="proposta-a-nav" aria-label="Navegação da Proposta A">
          <Link href="/propostas/a" className="proposta-brand">
            <span className="proposta-brand-monogram">gb</span>
            <span>gabriel batista</span>
          </Link>
          <div className="proposta-nav-links">
            <a href="#inicio">Início</a>
            <a href="#projetos">Projetos</a>
            <Link href="/propostas/b">Ver Proposta B (Light)</Link>
          </div>
          <a href={contact} target="_blank" rel="noopener noreferrer" className="proposta-nav-cta">
            Solicitar Proposta ↗
          </a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="proposta-a-hero">
          <div className="proposta-hero-left">
            <div className="proposta-tag-subtle">Design Independente & Engenharia Web</div>
            <h1 className="proposta-a-headline">
              Sua marca não nasceu para ser mais uma.
            </h1>
            <p className="proposta-a-lead">
              Desenho e desenvolvo experiências digitais de alto calibre. Do primeiro clique à decisão: presença autêntica, rigor editorial e engenharia precisa para destacar o seu negócio.
            </p>
            <div className="proposta-hero-actions">
              <a href={contact} target="_blank" rel="noopener noreferrer" className="proposta-hero-btn">
                Iniciar Conversa ↗
              </a>
              <a href="#projetos" className="proposta-hero-secondary">
                Explorar Projetos ↓
              </a>
            </div>
          </div>

          <div className="proposta-a-photo-wrap">
            <Image
              src="/images/hero/gabriel-contact.webp"
              alt="Gabriel Batista no estúdio, designer e desenvolvedor"
              fill
              priority
              sizes="(max-width: 960px) 100vw, 50vw"
            />
            <div className="proposta-photo-badge">
              <span>Gabriel Batista</span>
              <span>Design & Desenvolvimento Direto</span>
            </div>
          </div>
        </section>

        <section id="projetos" className="proposta-section-projects">
          <div className="proposta-section-head">
            <div>
              <div className="proposta-tag-subtle">01 / SELEÇÃO AUTORAL</div>
              <h2>Projetos com intenção e precisão.</h2>
            </div>
            <p>
              Estudos e direções autorais desenhados para marcas que exigem personalidade visual e tecnologia sob medida.
            </p>
          </div>

          <div className="proposta-projects-grid">
            {projects.map((item) => (
              <Link key={item.title} href={item.link} className="proposta-card-a">
                <div className="proposta-browser-chrome">
                  <div className="proposta-browser-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="proposta-browser-title">{item.domain}</span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>↗</span>
                </div>
                <div className="proposta-card-media">
                  <Image
                    src={item.image}
                    alt={`Interface do projeto ${item.title}`}
                    fill
                    sizes="(max-width: 960px) 100vw, 50vw"
                  />
                </div>
                <div className="proposta-card-meta">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.category}</p>
                  </div>
                  <span className="proposta-card-btn">↗</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
