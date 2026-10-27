import Image from "next/image";
import { services } from "@/lib/content";
type ServiceId = (typeof services)[number]["id"];
export function ServicePreview({ id }: { id: ServiceId }) {
  if (id === "landing" || id === "sites") {
    const chronos = id === "landing";
    return (
      <figure
        className={`service-product-preview ${chronos ? "preview-chronos" : "preview-vanguard"}`}
      >
        <div className="product-browser-top">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            {chronos ? "chronos-atelier / concept" : "vanguard / concept"}
          </span>
          <span>↗</span>
        </div>
        <div className="product-browser-image">
          <Image
            key={id}
            src={`/images/services/${chronos ? "chronos-atelier" : "vanguard"}.webp`}
            alt={
              chronos
                ? "Demonstração autoral Chronos Atelier, com tipografia editorial e composição de relógio"
                : "Demonstração autoral Vanguard, com composição arquitetônica e hierarquia editorial"
            }
            width={1440}
            height={1000}
            sizes="(max-width: 900px) 90vw, 65vw"
            loading="lazy"
          />
        </div>
        <figcaption>
          Projeto conceitual autoral ·{" "}
          {chronos ? "Chronos Atelier" : "Vanguard"}
        </figcaption>
      </figure>
    );
  }
  if (id === "sistemas") {
    return (
      <figure className="service-product-preview">
        <div className="product-browser-top">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>workspace / interface ilustrativa</span>
          <span>↗</span>
        </div>
        <div className="workspace-preview" aria-hidden="true">
          <aside className="workspace-sidebar">
            <span className="workspace-brand">g/</span>
            <span className="workspace-active">◫ Visão geral</span>
            <span>▤ Projetos</span>
            <span>↗ Integrações</span>
            <span>◷ Atividades</span>
            <small>
              MENOS ATRITO.
              <br />
              MAIS CLAREZA.
            </small>
          </aside>
          <div className="workspace-main">
            <div className="workspace-header">
              <div>
                <span>SEU JEITO DE TRABALHAR</span>
                <h4>Uma visão. Tudo conectado.</h4>
              </div>
              <span className="workspace-avatar">GB</span>
            </div>
            <div className="workspace-summary">
              <div>
                <span>EM FOCO</span>
                <strong>Design de interface</strong>
                <small>Etapa ilustrativa do projeto</small>
              </div>
              <div>
                <span>PRÓXIMO PASSO</span>
                <strong>Revisão colaborativa</strong>
                <small>Uma decisão de cada vez</small>
              </div>
            </div>
            <div className="workspace-columns">
              {["Planejamento", "Em criação", "Em revisão"].map((title, i) => (
                <div key={title}>
                  <span>
                    {title}
                    <i />
                  </span>
                  <div className="workspace-task">
                    <span className={`workspace-task-tag tag-${i}`}>
                      {["ESTRATÉGIA", "INTERFACE", "CONTEÚDO"][i]}
                    </span>
                    <strong>
                      {
                        [
                          "Organizar a jornada",
                          "Desenhar o essencial",
                          "Refinar a mensagem",
                        ][i]
                      }
                    </strong>
                    <div className="task-placeholder" />
                    <div className="task-placeholder short" />
                    <span className="task-footer">
                      EXEMPLO DE FLUXO <span>↗</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <figcaption>
          Interface ilustrativa · Sem dados de clientes ou integração ativa
        </figcaption>
      </figure>
    );
  }
  if (id === "seo") {
    return (
      <figure className="service-product-preview">
        <div className="product-browser-top">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>presença local / estudo de experiência</span>
          <span>↗</span>
        </div>
        <div className="local-preview" aria-hidden="true">
          <div className="local-copy">
            <span className="local-eyebrow">UMA BUSCA. UMA CONEXÃO.</span>
            <div className="local-search">
              <span>⌕</span>Seu serviço, na sua região
            </div>
            <div className="local-result">
              <span className="local-result-mark">g/</span>
              <div>
                <strong>Sua empresa, com clareza.</strong>
                <span>
                  Informação consistente.
                  <br />
                  Uma presença fácil de encontrar.
                </span>
                <small>SUA IDENTIDADE · SEU CONTEXTO</small>
              </div>
            </div>
            <span className="local-disclaimer">
              Visual conceitual. Não representa um resultado de busca ou uma
              posição no Google.
            </span>
          </div>
          <div className="local-map">
            <svg viewBox="0 0 340 340" fill="none">
              <path
                d="M-20 70 360 280M-20 250 360 90M80-20 190 360M250-20 130 360"
                stroke="#d0d6c6"
                strokeWidth="22"
              />
              <path
                d="M-20 70 360 280M-20 250 360 90M80-20 190 360M250-20 130 360"
                stroke="#f4f5ee"
                strokeWidth="15"
              />
              <path
                d="M-20 170h400M30-20 340 350"
                stroke="#f4f5ee"
                strokeWidth="9"
              />
            </svg>
            <div className="local-radius radius-outer" />
            <div className="local-radius radius-inner" />
            <span className="local-pin">g/</span>
            <span className="map-label">MAPA ILUSTRATIVO</span>
          </div>
        </div>
        <figcaption>
          Presença regional com informações reais · Sem promessa de
          posicionamento
        </figcaption>
      </figure>
    );
  }
  return (
    <figure className="service-product-preview">
      <div className="product-browser-top">
        <span className="browser-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>engenharia / evolução contínua</span>
        <span>↗</span>
      </div>
      <div className="performance-preview" aria-hidden="true">
        <div className="performance-copy">
          <span className="local-eyebrow">MEDIR. ENTENDER. REFINAR.</span>
          <h4>
            Rapidez é parte
            <br />
            da experiência.
          </h4>
          <p>
            Otimizar começa em descobrir
            <br />o que realmente precisa mudar.
          </p>
          <span className="performance-code">experience.refine()</span>
        </div>
        <div className="performance-stack">
          {[
            {
              title: "Imagens",
              text: "Formato e dimensões adequados",
              size: "70%",
            },
            {
              title: "Fontes",
              text: "Arquivos locais e carregamento planejado",
              size: "48%",
            },
            {
              title: "JavaScript",
              text: "Apenas o necessário para interagir",
              size: "36%",
            },
          ].map((row, i) => (
            <div className="performance-row" key={row.title}>
              <span>0{i + 1}</span>
              <div>
                <strong>{row.title}</strong>
                <p>{row.text}</p>
                <div className="performance-track">
                  <i style={{ width: row.size }} />
                </div>
              </div>
              <span>↗</span>
            </div>
          ))}
          <p className="performance-disclaimer">
            Composição ilustrativa. Sem pontuações ou medições simuladas.
          </p>
        </div>
      </div>
      <figcaption>
        Melhorias orientadas por diagnóstico · Sem resultados de desempenho
        fictícios
      </figcaption>
    </figure>
  );
}
