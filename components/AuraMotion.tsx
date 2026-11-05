"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import styles from "@/app/propostas/aura/aura.module.css";
const subscribe = () => () => {};
export function AuraMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = root.current;
    if (!node || paused) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    async function setup() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        await document.fonts.ready;
        if (disposed || !node) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        revert = () => media.revert();
        media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 900px) and (min-height: 700px)" }, context => {
          if (!context.conditions?.motion) return;
          node.dataset.animated = "true";
          const select = gsap.utils.selector(node);
          const track = select("[data-hero-track]")[0];
          const chars = select("[data-hero-glyph]");
          gsap.from(chars, { yPercent: 90, rotationX: -65, opacity: 0, stagger: .013, duration: .85, ease: "power3.out", clearProps: "all" });
          if (context.conditions.desktop) {
            const hero = gsap.timeline({ scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: .5, invalidateOnRefresh: true } });
            hero.fromTo(select("[data-portrait]"), { clipPath: "inset(12% 4% 7% 43%)", scale: 1.03 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: .7, ease: "none" }, 0)
              .to(select("[data-hero-copy]"), { y: -80, autoAlpha: 0, duration: .3, ease: "none" }, .35)
              .to(select("[data-hero-signature]"), { opacity: 0, duration: .15 }, .3)
              .fromTo(select("[data-transition-text]"), { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: .3 }, .55);
            gsap.to(select("[data-hero-stage]"), { yPercent: -8, ease: "none", scrollTrigger: { trigger: track, start: "bottom bottom", end: "bottom top", scrub: true } });
          }
          ScrollTrigger.refresh();
          return () => {
            delete node.dataset.animated;
          };
        }, node);
        if (disposed) revert();
      } catch {
        revert?.();
        if (node) delete node.dataset.animated;
        // The static HTML remains the usable fallback if the animation chunk fails.
      }
    }
    void setup();
    return () => { disposed = true; revert?.(); delete node.dataset.animated; };
  }, [paused]);
  return <div ref={root} className={styles.page} data-motion={paused ? "off" : "on"}>
    {children}
    {hydrated && <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Ativar animações" : "Desativar animações"}</button>}
  </div>;
}
