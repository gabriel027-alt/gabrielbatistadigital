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
            Gabriel Batista Digital reúne direção visual e engenharia web em
            um mesmo processo. Antes da interface, vem o entendimento do negócio:
            o que precisa ser comunicado, quem precisa encontrar essa informação
            e qual ação a experiência deve facilitar.
          </p>
          <p>
            O trabalho vai da organização do conteúdo ao desenvolvimento e à
            validação. Escopo, integrações, gestão de conteúdo e publicação são
            decisões explícitas do projeto, não detalhes deixados para o final.
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
