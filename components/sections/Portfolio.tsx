"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { concepts } from "@/lib/content";
import { Arrow, Chevron } from "../ui/icons";
import { SectionLabel } from "../ui/shared";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function Portfolio() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, moved: false, x: 0, left: 0 });
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true,
  );
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  function move(direction: number, manual = true) {
    const node = track.current;
    if (!node) return;
    if (manual) setPlaying(false);
    const items = node.querySelectorAll<HTMLElement>("article");
    const next = (active + direction + items.length) % items.length;
    const max = node.scrollWidth - node.clientWidth;
    node.scrollTo({
      left: (next / (items.length - 1)) * max,
      behavior: reduced ? "instant" : "smooth",
    });
  }
  useEffect(() => {
    if (!playing || hover || !visible || reduced) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) move(1, false);
    }, 4500);
    return () => window.clearInterval(timer);
    // move uses the current slide; restart after a scroll changes it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, hover, visible, reduced, active]);
  return (
    <section id="portfolio" className="portfolio-section">
      <div className="shell section">
        <SectionLabel number="03">SELEÇÃO DO ESTÚDIO</SectionLabel>
        <div className="section-heading portfolio-heading">
          <h2>
            Ideias que ganham
            <br />
            <span className="serif">forma e significado.</span>
          </h2>
          <div>
            <p>
              Três universos. Uma mesma atenção aos detalhes.
              <br />
              Estudos autorais, não clientes reais.
            </p>
            <div className="portfolio-controls">
              <button
                className="icon-button"
                type="button"
                aria-label="Projeto anterior"
                onClick={() => move(-1)}
              >
                <Chevron className="rotate-180" />
              </button>
              <span className="micro">
                0{active + 1} <span className="muted">/ 03</span>
              </span>
              <button
                className="icon-button"
                type="button"
                aria-label="Próximo projeto"
                onClick={() => move(1)}
              >
                <Chevron />
              </button>
              <button
                className="motion-control"
                type="button"
                disabled={reduced}
                aria-label={
                  playing
                    ? "Pausar movimento do portfólio"
                    : "Iniciar movimento do portfólio"
                }
                aria-pressed={playing && !reduced}
                onClick={() => setPlaying(!playing)}
              >
                {playing && !reduced ? "Ⅱ Pausar" : "▷ Reproduzir"}
              </button>
            </div>
          </div>
        </div>
        <div
          className="portfolio-track"
          ref={track}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Projetos conceituais"
          aria-describedby="portfolio-instructions"
          tabIndex={0}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocusCapture={() => setPlaying(false)}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              move(e.key === "ArrowRight" ? 1 : -1);
            } else if (e.code === "Space" && !reduced) {
              e.preventDefault();
              setPlaying(!playing);
            }
          }}
          onScroll={() => {
            const node = track.current;
            if (!node) return;
            const max = node.scrollWidth - node.clientWidth;
            if (max > 0)
              setActive(
                Math.min(
                  2,
                  Math.max(0, Math.round((node.scrollLeft / max) * 2)),
                ),
              );
          }}
          onDragStart={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            drag.current = {
              down: true,
              moved: false,
              x: e.clientX,
              left: e.currentTarget.scrollLeft,
            };
          }}
          onPointerMove={(e) => {
            const current = drag.current;
            if (!current.down || e.pointerType !== "mouse") return;
            const distance = e.clientX - current.x;
            if (Math.abs(distance) > 8) {
              current.moved = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              setPlaying(false);
              e.currentTarget.style.scrollSnapType = "none";
              e.currentTarget.scrollLeft = current.left - distance;
            }
          }}
          onPointerUp={(e) => {
            drag.current.down = false;
            e.currentTarget.style.scrollSnapType = "";
            if (e.currentTarget.hasPointerCapture(e.pointerId))
              e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={(e) => {
            drag.current.down = false;
            e.currentTarget.style.scrollSnapType = "";
          }}
          onClickCapture={(e) => {
            if (drag.current.moved) {
              e.preventDefault();
              e.stopPropagation();
              drag.current.moved = false;
            }
          }}
        >
          {concepts.map((project, index) => (
            <article
              key={project.slug}
              className={`project-card ${project.theme}`}
              aria-label={`Projeto ${index + 1} de 3`}
            >
              <Link
                href={`/conceitos/${project.slug}`}
                className="project-link"
                draggable={false}
              >
                <div className="project-preview project-website-preview">
                  <div className="project-browserline" aria-hidden="true">
                    <span>
                      <i />
                      <i />
                      <i />
                    </span>
                    <span>{project.name.toLowerCase()} / conceito</span>
                    <Arrow size={12} />
                  </div>
                  <div className="project-website-image">
                    <Image
                      src={`/images/portfolio/${project.slug}.webp`}
                      alt={`Prévia da demonstração conceitual ${project.name}`}
                      width={900}
                      height={1500}
                      sizes="(max-width:600px) 85vw, (max-width:900px) 55vw, 38vw"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <span className="project-visit">
                    Explorar demonstração <Arrow size={15} />
                  </span>
                </div>
                <div className="project-info">
                  <p className="eyebrow">
                    {project.category} <span>PROJETO CONCEITUAL</span>
                  </p>
                  <h3>
                    {project.name}
                    <Arrow />
                  </h3>
                  <p>{project.description}</p>
                  <span className="text-link">
                    Explorar demonstração <Arrow size={15} />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="portfolio-bottom">
          <p id="portfolio-instructions">
            Arraste para explorar. Use as setas com o carrossel em foco.
          </p>
          <span className="micro">
            ESTÉTICA COM INTENÇÃO. CÓDIGO COM PRECISÃO.
          </span>
        </div>
      </div>
    </section>
  );
}
