"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export function ExperienceLab() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = root.current!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    const update = () => {
      frame = 0;
      if (media.matches || innerWidth < 901) { node.dataset.phase = "2"; return; }
      const rect = node.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      node.dataset.phase = String(Math.min(2, Math.floor(progress * 3)));
    };
    const schedule = () => { if (!frame && visible && document.documentElement.dataset.motion !== "paused") frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); });
    observer.observe(node);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    media.addEventListener("change", update);
    update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); media.removeEventListener("change", update); };
  }, []);
  return (
    <section className="experience-lab" id="laboratorio" ref={root} data-phase="0" aria-labelledby="lab-title">
      <div className="lab-sticky shell">
        <div className="lab-copy">
          <p className="section-label">DENTRO DO PROCESSO / DIGITAL CRAFT</p>
          <h2 id="lab-title">Uma ideia.<br /><span className="serif">Muitas camadas.</span></h2>
          <p className="lab-intro">Da primeira intenção à interface que você pode explorar.</p>
          <ol className="lab-steps">
            <li><span>01</span><div><h3>Estruturar</h3><p>Hierarquia, conteúdo e o caminho até a ação.</p></div></li>
            <li><span>02</span><div><h3>Construir</h3><p>Componentes precisos. Uma base feita para evoluir.</p></div></li>
            <li><span>03</span><div><h3>Dar vida</h3><p>Imagem, interação e personalidade em cada detalhe.</p></div></li>
          </ol>
          <a className="quiet-link" href="#servicos">Continue para as especialidades ↓</a>
        </div>
        <div className="lab-browser" aria-hidden="true">
          <div className="lab-toolbar"><span>● ● ●</span><span>vanguard / processo criativo</span><span>↗</span></div>
          <div className="lab-visuals">
            <div className="lab-layer lab-wireframe"><div className="wire-nav" /><div className="wire-heading" /><div className="wire-line" /><div className="wire-line short" /><div className="wire-image" /><div className="wire-columns"><i /><i /><i /></div><small>01 / ARQUITETURA DA INFORMAÇÃO</small></div>
            <div className="lab-layer lab-code"><span>app / page.tsx</span><pre><code>{`export default function Experience() {\n  return (\n    <main>\n      <Architecture\n        intention="clarity"\n        material="light"\n      />\n      <Spaces collection={selected} />\n      <Connect />\n    </main>\n  );\n}`}</code></pre><small>02 / ENGENHARIA DA EXPERIÊNCIA</small></div>
            <div className="lab-layer lab-finished"><Image src="/images/concepts/vanguard.webp" alt="" fill sizes="(max-width: 900px) 90vw, 55vw" /><div><small>VANGUARD / ARQUITETURA</small><strong>O essencial<br />permanece.</strong><span>03 / INTENÇÃO EM FORMA</span></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
