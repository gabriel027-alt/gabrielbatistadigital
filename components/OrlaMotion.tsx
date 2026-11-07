"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import styles from "@/app/propostas/orla/orla.module.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function OrlaMotion() {
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-orla]");
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      setAvailable(true);
      if (paused) return () => setAvailable(false);
      const journey = root.querySelector<HTMLElement>("[data-orla-journey]")!;
      const rail = root.querySelector<HTMLElement>("[data-orla-rail]")!;
      const tabs = root.querySelector<HTMLElement>("[data-orla-tabs]")!;
      root.dataset.orlaAnimated = "true";
      tabs.hidden = false;
      const ctx = gsap.context(() => {
        gsap.to("[data-orla-hero-photo]", { yPercent: 14, scale: 1.08, ease: "none", scrollTrigger: { trigger: "[data-orla-hero]", start: "top top", end: "bottom top", scrub: .6 } });
        gsap.to("[data-orla-hero-copy]", { yPercent: -28, ease: "none", scrollTrigger: { trigger: "[data-orla-hero]", start: "top top", end: "bottom top", scrub: .6 } });
        const travel = () => Math.max(0, rail.scrollWidth - journey.clientWidth);
        const tween = gsap.to(rail, { x: () => -travel(), ease: "none", scrollTrigger: { trigger: journey, start: "top top", end: "bottom bottom", scrub: .65, invalidateOnRefresh: true } });
        gsap.fromTo("[data-orla-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: journey, start: "top top", end: "bottom bottom", scrub: .65 } });
        const buttons = [...tabs.querySelectorAll<HTMLButtonElement>("button")];
        const updateButtons = () => {
          const active = tween.progress() < .5 ? 0 : 1;
          buttons.forEach((button, index) => button.setAttribute("aria-current", String(index === active)));
        };
        tween.eventCallback("onUpdate", updateButtons);
        updateButtons();
      }, root);
      const jump = (event: Event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-orla-jump]");
        if (!button) return;
        const progress = Number(button.dataset.orlaJump);
        const top = journey.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + (journey.offsetHeight - window.innerHeight) * progress, behavior: "smooth" });
      };
      tabs.addEventListener("click", jump);
      const refresh = () => ScrollTrigger.refresh();
      const images = [...root.querySelectorAll("img")];
      images.forEach(img => img.addEventListener("load", refresh));
      refresh();
      return () => {
        ctx.revert();
        delete root.dataset.orlaAnimated;
        tabs.hidden = true;
        tabs.removeEventListener("click", jump);
        images.forEach(img => img.removeEventListener("load", refresh));
        setAvailable(false);
      };
    });
    return () => media.revert();
  }, [paused]);

  if (!available) return null;
  return <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
