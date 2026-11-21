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
  gsap.set("[data-arrimo-bridge]", { "--draw": 0 });
  gsap.set("[data-arrimo-found]", { opacity: 0 });
  // The ruler and first record already exist at progress zero: no empty introduction.
  timeline.fromTo("[data-arrimo-rule]", { opacity: 1 }, { opacity: 1, duration: .01 }, 0);
  cards.slice(1).forEach((card, i) => {
    timeline.fromTo(card, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .15, ease: "power2.out" }, .02 + i * .12);
  });
  gsap.utils.toArray<HTMLElement>("[data-arrimo-bridge]", root).forEach((bridge, i) => {
    timeline.fromTo(bridge, { "--draw": 0 }, { "--draw": 1, duration: .22, immediateRender: true }, .38 + i * .06);
  });
  gsap.utils.toArray<HTMLElement>("[data-arrimo-missing]", root).forEach((label, i) => {
    timeline.fromTo(label, { opacity: 1 }, { opacity: 0, duration: .07, immediateRender: true }, .41 + i * .06);
  });
  gsap.utils.toArray<HTMLElement>("[data-arrimo-found]", root).forEach((label, i) => {
    timeline.fromTo(label, { opacity: 0 }, { opacity: 1, duration: .07, immediateRender: true }, .49 + i * .06);
  });
  timeline.fromTo("[data-arrimo-gap]", { opacity: 1 }, { opacity: 1, duration: .01 }, 0)
    .to(phases[0].parentElement, { y: () => root.clientWidth < 760 ? 0 : 92, duration: .08 }, .6)
    .to("[data-arrimo-ruler]", { opacity: .22, duration: .08 }, .6)
    .fromTo("[data-arrimo-decision]", { y: 0, "--focus": 0 }, { y: () => root.clientWidth < 760 ? -250 : -190, "--focus": 1, duration: .08, ease: "power2.inOut" }, .6)
    // Cross out, remove, then stamp. These intervals never overlap.
    .fromTo("[data-arrimo-strike]", { scaleX: 0 }, { scaleX: 1, duration: .07 }, .68)
    .fromTo("[data-arrimo-denied]", { opacity: 1 }, { opacity: 0, duration: .055 }, .76)
    .fromTo("[data-arrimo-review]", { opacity: 0, y: -42, scale: 1.15, rotation: -4 }, { opacity: 1, y: 0, scale: 1, rotation: -4, duration: .065, ease: "power3.in" }, .85)
    .to("[data-arrimo-review]", { x: -3, rotation: -5, duration: .015 }, .915)
    .to("[data-arrimo-review]", { x: 2, rotation: -3, duration: .015 }, .93)
    .to("[data-arrimo-review]", { x: 0, rotation: -4, duration: .02 }, .945)
    .to({}, { duration: .035 }, .965);
  timeline.fromTo(phases[0], { opacity: 1, y: 0 }, { opacity: 0, y: -10, duration: .06 }, .27)
    .fromTo(phases[1], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .04 }, .29)
    .to(phases[1], { opacity: 0, y: -10, duration: .06 }, .65)
    .fromTo(phases[2], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .06 }, .73);
}

export function ArrimoMotion() {
  useBrandMotion('[data-model="arrimo"]', build);
  // No visible pause button (21/11/2026): the scenes move with the scroll and arrivals last under 5 s, so WCAG 2.2.2
  // asks for none; reduced motion still gets the still version automatically (useBrandMotion).
  return null;
}
