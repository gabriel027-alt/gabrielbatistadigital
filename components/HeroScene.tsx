"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
const tools = [["React", "react"], ["Next.js", "nextdotjs"], ["TypeScript", "typescript"], ["Claude", "claude"], ["GitHub", "github"], ["ChatGPT", "openai"]] as const;
/** One approved portrait. Scroll moves the composition, never the face or pose. */
export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current!;
    const section = node.closest("section")!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    let frame = 0;
    let visible = true;
    const update = () => {
      frame = 0;
      if (!visible) return;
      const reduced = media.matches || !!saveData;
      if (document.documentElement.dataset.motion === "paused" && !reduced) return;
      const box = section.getBoundingClientRect();
      const progress = reduced ? 0 : Math.min(1, Math.max(0, (88 - box.top) / Math.max(1, box.height * .8)));
      section.style.setProperty("--hero-progress", String(progress));
      node.dataset.progress = String(progress);
    };
    const schedule = () => { if (!frame && visible) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      document.documentElement.dataset.portraitVisible = String(visible);
      if (visible) schedule();
    });
    observer.observe(section);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("atelier-motion", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      delete document.documentElement.dataset.portraitVisible;
      removeEventListener("scroll", schedule); removeEventListener("resize", schedule);
      removeEventListener("atelier-motion", schedule); media.removeEventListener("change", schedule);
    };
  }, []);
  return <div className="atelier-scene portrait-scene" ref={root} data-portrait="single" data-progress="0">
    <div className="portrait-photo"><Image src="/images/hero/gabriel-contact.webp" alt="Gabriel Batista diante do notebook, olhando para quem visita o estúdio" fill preload sizes="100vw" /></div>
    <div className="cinema-shade" aria-hidden="true" />
    <div className="portrait-orbit" aria-hidden="true"><i/><i/><span>g/</span></div>
    <div className="cinema-tools" aria-label="Ferramentas de desenvolvimento"><span className="cinema-tools-label">TECNOLOGIA A SERVIÇO DA SUA MARCA</span><ul>{tools.map(([name, slug]) => <li key={slug}><i style={{ maskImage: `url(/images/brands/${slug}.svg)` }} aria-hidden="true" /><span>{name}</span></li>)}</ul></div>
  </div>;
}
