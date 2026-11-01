import { SectionLabel } from "../ui/shared";
import { Asterisk } from "../ui/icons";
export function Manifesto() {
  return (
    <section id="manifesto" className="shell section manifesto">
      <div>
        <SectionLabel number="03">MENOS DO MESMO? NUNCA.</SectionLabel>
        <Asterisk className="manifesto-mark" />
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
            Seu visitante precisa entender o que você oferece, por que isso faz
            sentido para ele e como dar o próximo passo. Design e conteúdo
            trabalham juntos para tornar essa decisão mais clara.
          </p>
          <p>
            Começamos pelo objetivo do site e pelo contexto da sua empresa.
            Depois organizamos o conteúdo, desenhamos a interface e desenvolvemos
            a experiência para desktop e celular, dentro do escopo combinado.
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
