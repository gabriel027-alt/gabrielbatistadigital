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
            Gabriel Batista Digital é um estúdio independente que une pensamento
            estratégico e execução cuidadosa. Acreditamos que tecnologia bem
            aplicada deve ser sentida na experiência, não percebida como uma
            barreira.
          </p>
          <p>
            Menos excessos. Mais clareza. Uma presença que tem a sua identidade,
            do primeiro olhar à última linha de código.
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
