import { SectionLabel } from "../ui/shared";
export function Manifesto() {
  return (
    <section id="manifesto" className="shell section manifesto">
      <div>
        <SectionLabel number="01">MENOS DO MESMO? NUNCA.</SectionLabel>
        <span className="manifesto-index" aria-hidden="true">
          01.
        </span>
        <p className="micro muted">
          PENSAMENTO LIVRE.
          <br />
          EXECUÇÃO COM PROPÓSITO.
        </p>
      </div>
      <div>
        <h2>
          Não basta estar online.
          <br />É preciso ter <span className="serif accent">presença.</span>
        </h2>
        <div className="manifesto-copy">
          <p>
            O extraordinário começa quando paramos de repetir. Cada marca tem um
            jeito próprio de pensar, fazer e se conectar. A sua experiência
            digital precisa refletir isso.
          </p>
          <p>
            Por isso, começamos pela intenção. Unimos estratégia, sensibilidade
            visual e engenharia para criar o que faz sentido para o seu negócio.
            Sem fórmulas prontas.
          </p>
        </div>
        <ul className="principles">
          <li>
            <span>01</span> Clareza
          </li>
          <li>
            <span>02</span> Identidade
          </li>
          <li>
            <span>03</span> Performance
          </li>
          <li>
            <span>04</span> Precisão
          </li>
        </ul>
      </div>
    </section>
  );
}
