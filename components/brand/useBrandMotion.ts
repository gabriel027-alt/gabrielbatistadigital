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
export function useBrandMotion(rootSelector: string, build: (root: HTMLElement) => void) {
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
      const ctx = gsap.context(() => build(root), root);
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
