"use client";
import { useState } from "react";
import { SectionLabel } from "../ui/shared";
import { Arrow } from "../ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
export function Integrations() {
  const [replay, setReplay] = useState(0);
  return (
    <section className="shell section integrations" id="integracoes">
      <SectionLabel number="06">CONEXÕES QUE FAZEM SENTIDO</SectionLabel>
      <div className="section-heading">
        <h2>
          Mais que páginas.
          <br />
          <span className="serif">Possibilidades conectadas.</span>
        </h2>
        <p>
          Seu site pode participar da operação.
          <br />
          Cada integração depende do seu contexto.
        </p>
      </div>
      <div className="flow-header">
        <span className="micro muted">FLUXO ILUSTRATIVO · NÃO ENVIA DADOS</span>
        <button
          type="button"
          className="quiet-link"
          onClick={() => setReplay(replay + 1)}
        >
          ↻ Rever fluxo
        </button>
      </div>
      <ol className="flow-grid" key={replay}>
        <li>
          <span className="eyebrow muted">01 / O PRIMEIRO CONTATO</span>
          <div className="flow-visual">
            <div className="message-bubble">
              Uma ideia para o próximo capítulo.
              <span>Gostaria de conversar sobre meu projeto.</span>
            </div>
          </div>
          <h3>O interesse encontra um caminho.</h3>
          <p>Uma solicitação chega pelo canal escolhido para o projeto.</p>
        </li>
        <li>
          <span className="eyebrow muted">02 / A CONEXÃO</span>
          <div className="flow-visual flow-engine">
            <span className="engine-node">SITE</span>
            <span className="engine-line" />
            <span className="engine-center">↗</span>
            <span className="engine-line" />
            <span className="engine-node">FLUXO</span>
          </div>
          <h3>A informação segue organizada.</h3>
          <p>
            Uma integração pode encaminhar contexto às ferramentas da operação.
          </p>
        </li>
        <li>
          <span className="eyebrow muted">03 / O PRÓXIMO PASSO</span>
          <div className="flow-visual">
            <div className="flow-notification">
              <span className="notification-icon">✓</span>
              <div>
                Contexto disponível
                <span>Uma conversa melhor pode começar.</span>
              </div>
            </div>
          </div>
          <h3>A equipe ganha clareza.</h3>
          <p>
            Menos transferências manuais. Mais espaço para um atendimento
            atento.
          </p>
        </li>
      </ol>
      <div className="flow-footer">
        <p>Seu processo é único. A solução também pode ser.</p>
        <a
          className="text-link"
          href={buildWhatsAppUrl(
            "Olá, quero conversar sobre integrações para meu negócio.",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Conversar sobre integrações <Arrow />
        </a>
      </div>
    </section>
  );
}
