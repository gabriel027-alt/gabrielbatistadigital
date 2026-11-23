import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import "@/app/propostas.css";

const contact = buildWhatsAppUrl("Olá, Gabriel! Quero conversar sobre a Proposta B (Architectural Canvas).");

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

export default function PropostaBPage() {
  return (
    <div className="proposta-b">
      <header className="proposta-nav-wrap">
        <nav className="proposta-b-nav" aria-label="Navegação da Proposta B">
          <Link href="/propostas/b" className="proposta-brand">
            <span className="proposta-brand-monogram">gb</span>
            <span>gabriel batista / digital studio</span>
          </Link>
          <div className="proposta-nav-links">
            <a href="#inicio">Início</a>
            <a href="#projetos">Projetos</a>
            <Link href="/propostas/a">Ver Proposta A (Dark)</Link>
          </div>
          <a href={contact} target="_blank" rel="noopener noreferrer" className="proposta-nav-cta">
            Solicitar Proposta ↗
          </a>
        </nav>
      </header>

      <main>
        <section id="inicio" className="proposta-b-hero">
          <div className="proposta-hero-left">
            <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
              ESTÚDIO AUTORAL & ENGENHARIA DIGITAL
            </span>
            <h1 className="proposta-b-headline">
              Sua marca não nasceu para ser mais uma.
            </h1>
            <p className="proposta-b-lead">
              Criamos identidades digitais que combinam clareza arquitetônica, design com personalidade e desenvolvimento à altura da sua ambição.
            </p>
            <div className="proposta-hero-actions">
              <a href={contact} target="_blank" rel="noopener noreferrer" className="proposta-hero-btn" style={{ background: "var(--accent)", color: "#fff" }}>
                Solicitar Orçamento ↗
              </a>
              <a href="#projetos" className="proposta-hero-secondary" style={{ color: "var(--fg)" }}>
                Conhecer Projetos ↓
              </a>
            </div>
          </div>

          <div className="proposta-b-photo-card">
            <Image
              src="/images/hero/gabriel-contact.webp"
              alt="Gabriel Batista no atelier de design"
              fill
              priority
              sizes="(max-width: 960px) 100vw, 50vw"
            />
            <div className="proposta-b-badge">
              <span>Gabriel Batista</span>
              <span>Direção Criativa & Código</span>
            </div>
          </div>
        </section>

        <section id="projetos" className="proposta-b-section-projects">
          <div className="proposta-section-head">
            <div>
              <span style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 700 }}>
                PORTFÓLIO EDITORIAL
              </span>
              <h2 style={{ color: "var(--fg)" }}>Projetos desenvolvidos do zero.</h2>
            </div>
            <p>
              Sem templates. Cada interface nasce da identidade do negócio para prender atenção e inspirar confiança imediata.
            </p>
          </div>

          <div className="proposta-projects-grid">
            {projects.map((item) => (
              <Link key={item.title} href={item.link} className="proposta-card-b">
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
