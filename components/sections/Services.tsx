"use client";
import { useRef, useState } from "react";
import { services } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SectionLabel } from "../ui/shared";
import { Arrow, Asterisk } from "../ui/icons";
export function Services() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const service = services[active];
  return (
    <section className="section services shell" id="servicos">
      <SectionLabel number="02">EXPERTISE QUE CONECTA</SectionLabel>
      <div className="section-heading">
        <h2>
          Visão estratégica.
          <br />
          <span className="muted">Execução precisa.</span>
        </h2>
        <p>
          Da primeira ideia ao último detalhe.
          <br />
          Soluções pensadas para o seu momento.
        </p>
      </div>
      <div
        role="tablist"
        aria-label="Especialidades da agência"
        className="service-tabs"
      >
        {services.map((item, i) => (
          <button
            key={item.id}
            ref={(node) => {
              buttons.current[i] = node;
            }}
            type="button"
            id={`tab-${item.id}`}
            role="tab"
            aria-selected={active === i}
            aria-controls="service-panel"
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === "ArrowRight") next = (i + 1) % services.length;
              else if (e.key === "ArrowLeft")
                next = (i + services.length - 1) % services.length;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = services.length - 1;
              else return;
              e.preventDefault();
              setActive(next);
              buttons.current[next]?.focus();
            }}
          >
            <span>0{i + 1}</span>
            {item.name}
            <Arrow size={14} />
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id="service-panel"
        aria-labelledby={`tab-${service.id}`}
        tabIndex={0}
        className="service-panel"
      >
        <div className="service-content">
          <p className="eyebrow accent">{service.category}</p>
          <h3>{service.title}</h3>
          <p className="body-copy">{service.description}</p>
          <ul className="feature-list">
            {service.features.map((item) => (
              <li key={item}>
                <span aria-hidden="true">↗</span>
                {item}
              </li>
            ))}
          </ul>
          <a
            className="text-link"
            href={buildWhatsAppUrl(
              `Olá, quero conversar sobre ${service.name}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Conversar sobre este serviço <Arrow />
          </a>
        </div>
        <div
          className={`service-art service-art-${service.id}`}
          aria-hidden="true"
        >
          <div className="service-art-header">
            <span>GBD / LABORATÓRIO DIGITAL</span>
            <span>0{active + 1}</span>
          </div>
          <div className="service-art-graphic">
            <div className="service-art-orbit" />
            <Asterisk size={100} />
            <span className="art-dot dot-one" />
            <span className="art-dot dot-two" />
          </div>
          <div className="service-art-caption">
            <p>{service.visual}</p>
            <code>{service.code}</code>
          </div>
        </div>
      </div>
    </section>
  );
}
