"use client";
import { useEffect } from "react";
export function VisualMotion() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sections = document.querySelectorAll<HTMLElement>(
      "#conteudo > section:not(#inicio), #conteudo > .portfolio-section",
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-entered", "true");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08 },
    );
    for (const section of sections) {
      if (section.getBoundingClientRect().top > innerHeight) {
        section.setAttribute("data-motion", "reveal");
        observer.observe(section);
      }
    }
    return () => {
      observer.disconnect();
      for (const section of sections) {
        section.removeAttribute("data-motion");
        section.removeAttribute("data-entered");
      }
    };
  }, []);
  return null;
}
