"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import styles from "./forma.module.css";

/**
 * Forma's signature motion (scroll): measure → draw the outlines in golden proportion → apply the ceramic.
 * The approved hero stays still; this is the page's one orchestrated moment. Fully reversible.
 */
function build(root: HTMLElement) {
  const grid = gsap.utils.toArray<SVGLineElement>("[data-plan-grid] line", root);
  const outlines = gsap.utils.toArray<SVGPathElement>("[data-plan-outline] path", root);
  const steps = gsap.utils.toArray<HTMLElement>("[data-plan-step]", root);
  gsap.set([...grid, ...outlines], { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
  gsap.set("[data-plan-ratios]", { opacity: 0 });
  gsap.set("[data-plan-ceramic]", { opacity: 0 });
  gsap.set(steps, { opacity: 0, y: 20 });

  const plan = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "[data-forma-plan]", start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true } });
  const show = (index: number, at: number, last = false) => {
    plan.to(steps[index], { opacity: 1, y: 0, duration: .05, ease: "power2.out" }, at);
    if (!last) plan.to(steps[index], { opacity: 0, y: -20, duration: .04 }, at + .24);
  };
  plan.to(grid, { attr: { "stroke-dashoffset": 0 }, duration: .2, stagger: .012 }, .02);
  show(0, .04);
  plan.to("[data-plan-ratios]", { opacity: 1, duration: .06 }, .3)
    .to(outlines, { attr: { "stroke-dashoffset": 0 }, duration: .18, stagger: .02 }, .33);
  show(1, .36);
  plan.to("[data-plan-ceramic]", { opacity: 1, duration: .16 }, .66)
    .to("[data-plan-outline]", { opacity: .4, duration: .1 }, .7)
    .to("[data-plan-grid]", { opacity: .5, duration: .1 }, .7);
  show(2, .7, true);
  plan.to({}, { duration: .08 }, .92);
}

export function FormaMotion() {
  const { paused, available, toggle } = useBrandMotion('[data-model="forma"]', build);
  if (!available) return null;
  return <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={toggle}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
