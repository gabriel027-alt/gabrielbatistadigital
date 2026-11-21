"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Motion contract shared by every brand (docs/DESIGN-SYSTEM.md, layer 1):
 * - runs only with prefers-reduced-motion: no-preference, and stops when the visitor pauses;
 * - marks the root with data-brand-animated, so CSS shows the final state otherwise (and without JS);
 * - reverts every tween and ScrollTrigger on cleanup;
 * - refreshes only after fonts load. Images sit in fixed-ratio boxes; refreshing on each image load
 *   made ScrollTrigger restore an older scroll position mid-scroll.
 */
/**
 * Interaction hints ([data-scroll-hint], components/brand/ScrollHint.tsx) fade out over the first 160 px of their
 * own scene, and come back when the visitor returns to its start.
 */
function fadeHints(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>("[data-scroll-hint]").forEach(hint => {
    const scene = hint.closest("section") ?? hint;
    gsap.fromTo(hint, { opacity: 1 }, { opacity: 0, ease: "none", scrollTrigger: { trigger: scene, start: "top top", end: "+=160", scrub: true } });
  });
}

export function useBrandMotion(rootSelector: string, build: (root: HTMLElement) => void | (() => void)) {
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      setAvailable(true);
      if (paused) return () => setAvailable(false);
      root.dataset.brandAnimated = "true";
      const ctx = gsap.context(() => { const cleanup = build(root); fadeHints(root); return cleanup; }, root);
      let alive = true;
      void document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      return () => {
        alive = false;
        ctx.revert();
        delete root.dataset.brandAnimated;
        setAvailable(false);
      };
    });
    return () => media.revert();
    // build is a stable module-level function in each brand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootSelector, paused]);

  return { paused, available, toggle: () => setPaused(value => !value) };
}
