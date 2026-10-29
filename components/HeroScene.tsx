"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
const tools = [
  ["React", "react"], ["Next.js", "nextdotjs"], ["TypeScript", "typescript"],
  ["Claude", "claude"], ["GitHub", "github"], ["ChatGPT", "openai"],
] as const;
export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current!;
    const section = node.closest("section")!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - innerHeight)));
      const paused = document.documentElement.dataset.motion === "paused";
      // Pausing freezes the current composition. Reduced motion uses the approved opening.
      if (paused && !media.matches) return;
      const mix = media.matches ? 0 : Math.min(1, Math.max(0, (progress - .14) / .22));
      node.style.setProperty("--scene-mix", String(mix));
      section.style.setProperty("--hero-progress", String(media.matches ? 0 : progress));
      node.dataset.view = mix > .5 ? "lateral" : "frontal";
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      document.documentElement.dataset.portraitVisible = String(visible);
      if (visible) schedule();
    });
    observer.observe(node);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("atelier-motion", schedule);
    media.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      delete document.documentElement.dataset.portraitVisible;
      removeEventListener("scroll", schedule); removeEventListener("resize", schedule);
      removeEventListener("atelier-motion", schedule); media.removeEventListener("change", schedule);
    };
  }, []);
  return <div className="atelier-scene" ref={root} data-view="frontal">
    <div className="cinema-image cinema-front"><Image src="/images/hero/gabriel-front.webp" alt="Gabriel de frente ao notebook em seu espaço de criação" fill preload sizes="100vw" /></div>
    <div className="cinema-image cinema-side" aria-hidden="true"><Image src="/images/hero/gabriel.png" alt="" fill loading="eager" sizes="100vw" /></div>
    <div className="cinema-shade" aria-hidden="true" />
    <div className="cinema-grain" aria-hidden="true" />
    <div className="cinema-tools" aria-label="Ferramentas de desenvolvimento">
      <span className="cinema-tools-label">IDEIAS EM BOA COMPANHIA</span>
      <ul>{tools.map(([name, slug]) => <li key={slug}><i style={{ maskImage: `url(/images/brands/${slug}.svg)` }} aria-hidden="true" /><span>{name}</span></li>)}</ul>
    </div>
    <div className="cinema-position" aria-hidden="true"><span>01 / VISÃO</span><i /><span>02 / EXECUÇÃO</span></div>
  </div>;
}
