import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Arrow } from "./ui/icons";
import { HeroScene } from "./HeroScene";

export function Hero() {
  return (
    <section id="inicio" className="studio-hero cinematic-hero">
      <div className="hero-pin">
        <HeroScene />
        <div className="shell studio-hero-layout">
          <div className="studio-hero-copy">
            <p className="eyebrow"><span className="status-dot" /> ESTÚDIO INDEPENDENTE / DESIGN & ENGENHARIA</p>
            <h1>Sua visão.<br />Nossa engenharia.<br /><span>Além do comum.</span></h1>
            <p className="studio-hero-description">Sites com identidade. Experiências que conectam.<br className="desktop-only" /> Engenharia para levar sua marca adiante.</p>
            <div className="studio-hero-actions">
              <a className="button button-primary" href={buildWhatsAppUrl("Olá, quero conversar sobre um projeto para minha marca.")} target="_blank" rel="noopener noreferrer">Vamos conversar <Arrow size={17} /></a>
              <a className="studio-project-link" href="#portfolio">Explore os projetos <Arrow size={15} /></a>
            </div>
          </div>
        </div>
        <div className="hero-scene-note" aria-hidden="true"><span>GBD® / DIGITAL CRAFT</span><p>Do primeiro olhar<br />à última linha de código.</p><i /></div>
        <div className="shell studio-hero-footer">
          <span>ESTRATÉGIA. IDENTIDADE. EXECUÇÃO.</span>
          <a href="#manifesto">ROLE PARA EXPLORAR <span aria-hidden="true">↓</span></a>
          <span>FEITO NO BRASIL / PARA IR ALÉM</span>
        </div>
      </div>
    </section>
  );
}
