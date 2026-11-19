"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import styles from "./arrimo.module.css";

function build(root: HTMLElement) {
  gsap.fromTo("[data-arrimo-arrival]", { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .09, ease: "power2.out" });
  gsap.utils.toArray<HTMLElement>("[data-arrimo-poster]", root).forEach(poster => {
    gsap.fromTo(poster.querySelector("[data-arrimo-poster-rule]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: poster, start: "top 85%", end: "bottom 55%", scrub: .4 } });
  });
  const scene = root.querySelector<HTMLElement>("[data-arrimo-scene]");
  if (!scene) return;
  const cards = gsap.utils.toArray<HTMLElement>("[data-arrimo-period]", root);
  const phases = gsap.utils.toArray<HTMLElement>("[data-arrimo-phase]", root);
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: .55, invalidateOnRefresh: true },
  });
  timeline.fromTo("[data-arrimo-rule]", { "--draw": 0 }, { "--draw": 1, duration: .36 }, 0);
  cards.forEach((card, i) => {
    timeline.fromTo(card, { y: 64, rotation: i % 2 ? 5 : -5, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .21, ease: "power2.out" }, .04 + i * .1);
  });
  timeline.fromTo("[data-arrimo-gap]", { opacity: 0 }, { opacity: 1, duration: .12, stagger: .04 }, .32)
    .fromTo("[data-arrimo-bridge]", { "--draw": 0 }, { "--draw": 1, duration: .25, stagger: .07 }, .54)
    .to("[data-arrimo-gap]", { opacity: .2, duration: .19 }, .69)
    .fromTo("[data-arrimo-denied]", { opacity: 1, scale: 1, rotation: -9 }, { opacity: 0, scale: 1.12, rotation: -4, duration: .16 }, .76)
    .fromTo("[data-arrimo-review]", { opacity: 0, scale: 1.14, rotation: -4 }, { opacity: 1, scale: 1, rotation: -4, duration: .18, ease: "power2.out" }, .79)
    .fromTo("[data-arrimo-hands]", { scale: 1.06 }, { scale: 1, duration: 1 }, 0)
    .to({}, { duration: .03 }, .97);
  timeline.fromTo(phases[0], { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: .1 }, .3)
    .fromTo(phases[1], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .1 }, .34)
    .to(phases[1], { opacity: 0, y: -10, duration: .1 }, .7)
    .fromTo(phases[2], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .12 }, .75);
}

export function ArrimoMotion() {
  const { paused, available, toggle } = useBrandMotion('[data-model="arrimo"]', build);
  if (!available) return null;
  return <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={toggle}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
