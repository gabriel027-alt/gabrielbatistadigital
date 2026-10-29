"use client";
import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
const tools = [
  { name: "React", slug: "react", x: "10%", y: "15%", color: "#61dafb" },
  { name: "Next.js", slug: "nextdotjs", x: "30%", y: "68%", color: "#f1f1e9" },
  { name: "Claude", slug: "claude", x: "7%", y: "44%", color: "#e6a17f" },
  { name: "GitHub", slug: "github", x: "94%", y: "69%", color: "#f1f1e9" },
  { name: "TypeScript", slug: "typescript", x: "18%", y: "83%", color: "#65b5f1" },
  { name: "ChatGPT", slug: "openai", x: "89%", y: "87%", color: "#93d6b6" },
] as const;
export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;
    const update = () => {
      frame = 0;
      const rect = node.closest("section")!.getBoundingClientRect();
      const progress = reduced.matches || document.documentElement.dataset.motion === "paused" ? 0 : Math.min(1, Math.max(0, -rect.top / rect.height));
      node.style.setProperty("--scene-progress", String(progress));
      node.style.setProperty("--scene-travel", `${progress * 38}px`);
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      node.dataset.visible = String(visible);
      document.documentElement.dataset.portraitVisible = String(visible);
      if (visible) schedule();
    });
    observer.observe(node);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", update);
    window.addEventListener("atelier-motion", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      delete document.documentElement.dataset.portraitVisible;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", update);
      window.removeEventListener("atelier-motion", update);
    };
  }, []);
  return (
    <div className="atelier-scene" ref={root} data-visible="true">
      <div className="atelier-window" aria-hidden="true"><i /><i /><i /></div>
      <div className="atelier-portrait">
        <Image src="/images/hero/gabriel.png" alt="Gabriel em seu espaço de criação, trabalhando no notebook" fill preload sizes="(max-width: 900px) 100vw, 60vw" />
      </div>
      <div className="atelier-daylight" aria-hidden="true" />
      <div className="atelier-lamp" aria-hidden="true"><span /><i /></div>
      <div className="atelier-tools" aria-hidden="true">
        {tools.map((tool, i) => (
          <span key={tool.slug} className={`atelier-tool tool-${i}`} style={{ "--tool-x": tool.x, "--tool-y": tool.y, "--tool-color": tool.color, "--tool-delay": `${i * -1.3}s` } as CSSProperties}>
            <i style={{ maskImage: `url(/images/brands/${tool.slug}.svg)` }} />
            <small>{tool.name}</small>
          </span>
        ))}
      </div>
      <div className="atelier-caption"><span className="scene-day-label">LUZ NATURAL · IDEIAS EM MOVIMENTO</span><span className="scene-night-label">LUZ ACESA · CRIAÇÃO EM FOCO</span></div>
      <div className="atelier-cat" aria-hidden="true">
        <svg viewBox="0 0 160 70"><path d="M27 45C8 45 5 21 15 14M30 46C36 31 70 32 93 38L106 32L112 14L124 25L138 18L140 37L132 49L114 51L107 63L101 63L103 48L72 49L61 63L54 63L57 48L37 50L32 63L25 63Z" fill="currentColor" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M123 33h1" stroke="#e3eaa9" strokeWidth="3"/></svg>
      </div>
    </div>
  );
}
