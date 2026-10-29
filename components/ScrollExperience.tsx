"use client";
import { useEffect, useState } from "react";

/** Native scroll stays in control; only visible sections receive frame updates. */
export function ScrollExperience() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const sections = [...document.querySelectorAll<HTMLElement>("main > section, .process-grid > li")];
    const visible = new Set<HTMLElement>();
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = innerHeight;
      visible.forEach((node) => {
        const box = node.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (height - box.top) / (height + box.height)));
        node.style.setProperty("--chapter-progress", String(progress));
        node.style.setProperty("--chapter-shift", reduced.matches || document.documentElement.dataset.motion === "paused" ? "0px" : `${(0.5 - progress) * 34}px`);
        node.classList.toggle("chapter-active", box.top < height * 0.72);
      });
      const max = document.documentElement.scrollHeight - height;
      document.documentElement.style.setProperty("--reading-progress", String(max > 0 ? scrollY / max : 0));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const node = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(node); else visible.delete(node);
      });
      schedule();
    }, { rootMargin: "100px" });
    sections.forEach((node) => observer.observe(node));
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    addEventListener("atelier-motion", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      removeEventListener("atelier-motion", schedule);
      delete document.documentElement.dataset.motion;
      document.documentElement.style.removeProperty("--reading-progress");
    };
  }, []);
  return <>
    <div className="reading-progress" aria-hidden="true" />
    <button className="experience-motion" type="button" aria-pressed={paused} onClick={() => {
      const next = !paused;
      setPaused(next);
      document.documentElement.dataset.motion = next ? "paused" : "active";
      dispatchEvent(new Event("atelier-motion"));
    }}>{paused ? "▷ Ativar animações" : "Ⅱ Pausar animações"}</button>
  </>;
}
