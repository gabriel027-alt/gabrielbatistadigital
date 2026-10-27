import { processSteps } from "@/lib/content";
import { SectionLabel } from "../ui/shared";
import { Arrow } from "../ui/icons";
export function Process() {
  return (
    <section id="processo" className="shell section process-section">
      <SectionLabel number="04">CLAREZA EM CADA ETAPA</SectionLabel>
      <div className="section-heading">
        <h2>
          Grandes entregas.
          <br />
          <span className="muted">Um processo claro.</span>
        </h2>
        <p>
          Você participa do caminho.
          <br />
          Sem ruído. Sem caixa-preta.
        </p>
      </div>
      <ol className="process-grid">
        {processSteps.map((step, i) => (
          <li key={step.title}>
            <div className="process-step-number">
              <span>0{i + 1}</span>
              <Arrow size={14} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
