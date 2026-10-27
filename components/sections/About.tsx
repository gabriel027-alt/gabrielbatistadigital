import { SectionLabel } from "../ui/shared";
import { Arrow } from "../ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
export function About() {
  return (
    <section className="about-section" id="sobre">
      <div className="shell about-layout">
        <div
          className="studio-about-figure"
          aria-label="Ilustração autoral de um ambiente criativo"
        >
          <div className="studio-about-image" />
          <span className="studio-about-caption">
            UM ESPAÇO PARA IDEIAS GANHAREM FORMA.
            <small>CENA ILUSTRATIVA · NÃO É FOTOGRAFIA DA EQUIPE</small>
          </span>
        </div>
        <div className="about-copy">
          <SectionLabel number="05">QUEM PENSA CADA DETALHE</SectionLabel>
          <h2>
            Design sensível.
            <br />
            Engenharia precisa.
            <br />
            <span className="serif">Presença de verdade.</span>
          </h2>
          <p>
            A Gabriel Batista Digital nasce da conexão entre pensamento
            estratégico, design e desenvolvimento. Cada projeto começa com uma
            conversa e ganha forma a partir do que faz sentido para o seu
            negócio.
          </p>
          <p>
            Trabalhamos com intenção: entender antes de desenhar, simplificar
            antes de adicionar e refinar até que cada escolha encontre seu
            lugar.
          </p>
          <ul className="about-values">
            <li>Clareza na experiência.</li>
            <li>Precisão no desenvolvimento.</li>
            <li>Consistência em cada entrega.</li>
          </ul>
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
