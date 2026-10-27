import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Arrow } from "./ui/icons";
import { HeroScene } from "./HeroScene";
export function Hero() {
  return (
    <section id="inicio" className="studio-hero">
      <HeroScene />
      <div className="shell studio-hero-layout">
        <div className="studio-hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            DESIGN · TECNOLOGIA · PRESENÇA
          </p>
          <h1>
            Criamos presença.
            <br />
            Construímos
            <br />
            <span>possibilidades.</span>
          </h1>
          <p className="studio-hero-description">
            Estratégia, design e código para transformar
            <br className="desktop-only" /> o digital em uma parte real do seu
            negócio.
          </p>
          <div className="studio-hero-actions">
            <a
              className="button button-primary"
              href={buildWhatsAppUrl(
                "Olá, quero conversar sobre um projeto para minha marca.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Vamos conversar <Arrow size={17} />
            </a>
            <a className="studio-project-link" href="#portfolio">
              Conheça os projetos <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="studio-hero-signature">
            FEITO COM INTENÇÃO. DESENVOLVIDO SOB MEDIDA.
          </p>
        </div>
      </div>
      <div className="shell studio-hero-footer">
        <span>GABRIEL BATISTA / DIGITAL STUDIO</span>
        <a href="#manifesto">
          EXPLORE O PRÓXIMO CAPÍTULO <span aria-hidden="true">↓</span>
        </a>
        <span>ESTRATÉGIA ANTES DE CADA LINHA.</span>
      </div>
    </section>
  );
}
