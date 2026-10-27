import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Arrow, Asterisk } from "./ui/icons";
export function Hero() {
  return (
    <section className="hero shell" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="status-dot" /> ESTRATÉGIA. DESIGN. ENGENHARIA.
        </p>
        <h1>
          O próximo nível
          <br />
          da sua <span className="serif">presença.</span>
        </h1>
        <p className="hero-lead">
          Sua marca não nasceu para ser igual.
          <br />
          Seu site também não deveria.
        </p>
        <p className="hero-description">
          Transformamos visão em experiências digitais.
          <br className="desktop-only" /> Design autoral, código puro e atenção
          ao que importa.
        </p>
        <div className="hero-actions">
          <a
            className="button button-primary"
            href={buildWhatsAppUrl(
              "Olá, quero conversar sobre um projeto para minha marca.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos construir o próximo <Arrow />
          </a>
          <a className="quiet-link" href="#portfolio">
            Explore nosso trabalho <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero-signature">
          INDEPENDENTE NO PENSAMENTO. PRECISO NA EXECUÇÃO.
        </p>
      </div>
      <div className="hero-scene" aria-hidden="true">
        <div className="scene-grid" />
        <span className="scene-corner corner-tl" />
        <span className="scene-corner corner-br" />
        <div className="scene-top">
          <span>GBD® — DIGITAL CRAFT</span>
          <span>EST. BRASIL</span>
        </div>
        <div className="scene-orbit orbit-back" />
        <div className="scene-orbit orbit-front" />
        <div className="sculpture">
          <div className="sculpture-top" />
          <div className="sculpture-face">
            <Asterisk size={145} />
          </div>
          <div className="sculpture-side" />
        </div>
        <div className="scene-reflection" />
        <div className="scene-note note-left">
          <span className="note-cross">+</span>
          <span>
            ESTRATÉGIA
            <br />
            <strong>antes de cada linha.</strong>
          </span>
        </div>
        <div className="scene-note note-right">
          <span className="status-dot" />
          <span>
            BUILT DIFFERENT.
            <br />
            <strong>By design.</strong>
          </span>
        </div>
        <div className="scene-floor" />
        <div className="scene-bottom">
          <span>FIG. 01 / INTENÇÃO EM FORMA</span>
          <span>↓</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span>CÓDIGO PURO. POSSIBILIDADES REAIS.</span>
        <a href="#manifesto">
          UM NOVO PONTO DE VISTA <span aria-hidden="true">↓</span>
        </a>
        <span>DO BRASIL PARA O MUNDO ↗</span>
      </div>
    </section>
  );
}
