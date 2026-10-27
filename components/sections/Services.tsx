"use client";
import { useRef, useState, useSyncExternalStore } from "react";
import { services } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SectionLabel } from "../ui/shared";
import { Arrow } from "../ui/icons";
import { ServicePreview } from "./ServicePreview";
function subscribeLayout(callback: () => void) {
  const media = matchMedia("(min-width: 901px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function Services() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const vertical = useSyncExternalStore(
    subscribeLayout,
    () => matchMedia("(min-width: 901px)").matches,
    () => true,
  );
  const service = services[active];
  return (
    <section
      className="section services shell"
      id="servicos"
      aria-labelledby="services-title"
    >
      <SectionLabel number="02">O QUE PODEMOS CONSTRUIR</SectionLabel>
      <div className="section-heading">
        <h2 id="services-title">
          A solução começa
          <br />
          <span className="serif">pelo seu negócio.</span>
        </h2>
        <p>
          Intenção antes da interface.
          <br />A tecnologia certa para cada próximo passo.
        </p>
      </div>
      <div className="services-product-layout">
        <div className="services-selector">
          <div
            role="tablist"
            aria-label="Especialidades da agência"
            aria-orientation={vertical ? "vertical" : "horizontal"}
            className="services-product-tabs"
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
                onKeyDown={(event) => {
                  let next = i;
                  if (event.key === "ArrowDown" || event.key === "ArrowRight")
                    next = (i + 1) % services.length;
                  else if (event.key === "ArrowUp" || event.key === "ArrowLeft")
                    next = (i + services.length - 1) % services.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = services.length - 1;
                  else return;
                  event.preventDefault();
                  setActive(next);
                  buttons.current[next]?.focus();
                }}
              >
                <span>0{i + 1}</span>
                <span>{item.name}</span>
                <Arrow size={17} />
              </button>
            ))}
          </div>
          <p className="service-selector-note">
            Cada projeto tem um contexto.
            <br />
            Cada escolha, um motivo.
          </p>
        </div>
        <div
          role="tabpanel"
          id="service-panel"
          aria-labelledby={`tab-${service.id}`}
          tabIndex={0}
          className="service-product-panel"
        >
          <div className="service-product-editorial">
            <div>
              <p className="eyebrow accent">{service.category}</p>
              <h3>{service.title}</h3>
            </div>
            <p>{service.description}</p>
          </div>
          <div className="service-preview-enter" key={service.id}>
            <ServicePreview id={service.id} />
          </div>
          <div className="service-product-bottom">
            <ul className="service-product-features">
              {service.features.map((feature) => (
                <li key={feature}>
                  <span aria-hidden="true">↗</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              className="button button-primary"
              href={buildWhatsAppUrl(
                `Olá, quero conversar sobre ${service.name}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Conversar sobre este serviço <Arrow size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
