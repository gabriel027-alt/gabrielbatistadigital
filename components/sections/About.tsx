import { SectionLabel } from "../ui/shared";
import { Arrow } from "../ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
export function About() {
  return (
    <section className="about-section" id="sobre">
      <div className="shell about-layout">
        <div className="about-art" aria-hidden="true">
          <span className="micro">GBD / INDEPENDENT DIGITAL STUDIO</span>
          <span className="about-monogram">g<span>/</span></span>
          <span className="about-art-bottom">PENSAR. CRIAR. REFINAR.</span>
        </div>
        <div className="about-copy">
          <SectionLabel number="05">POR TRÁS DA PRESENÇA</SectionLabel>
          <h2>
            Cada detalhe
            <br />
            revela uma <span className="serif">intenção.</span>
          </h2>
          <p>
            Sou Gabriel Batista e trabalho com design e desenvolvimento web.
            Você conversa comigo para organizar o objetivo do site, apresentar
            melhor o que sua empresa faz e definir uma experiência coerente
            com o seu negócio.
          </p>
          <p>
            O projeto vai da organização do conteúdo à interface e ao código.
            Antes de começar, combinamos entregas, integrações e condições de
            publicação. Durante o trabalho, você acompanha as decisões e as
            etapas de validação.
          </p>
          <a
            className="text-link"
            href={buildWhatsAppUrl(
              "Olá, quero conhecer o trabalho da Gabriel Batista Digital.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Vamos nos conhecer <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
