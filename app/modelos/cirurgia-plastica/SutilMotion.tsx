"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import styles from "./sutil.module.css";

/**
 * Sutil's signature motion. Arrival: the recovery ruler draws across the hero and settles on Dia 0, the conversation.
 * Recovery (28/11/2026): the five phases sit on one line; when it enters the screen the sage line draws from Dia 1 to
 * Três meses and each phase's dot arrives in turn. Only the line and the dots move; the texts are always readable.
 */
function build(root: HTMLElement) {
  gsap.timeline({ delay: .35 })
    .fromTo("[data-hero-ticks]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.out" })
    .fromTo("[data-hero-marker]", { scale: 0 }, { scale: 1, duration: .5, ease: "back.out(3)" }, "-=.35")
    .fromTo("[data-hero-marker]", { boxShadow: "0 0 0 0px #4a504473" }, { boxShadow: "0 0 0 20px #4a504400", duration: 1.2, repeat: 1, ease: "power1.out" });
  const line = root.querySelector<HTMLElement>("[data-phases]");
  if (!line) return;
  const dots = gsap.utils.toArray<HTMLElement>("[data-phase-dot]", line);
  gsap.timeline({ scrollTrigger: { trigger: line, start: "top 82%", toggleActions: "play none none reverse" } })
    .fromTo(line, { "--fill": 0 }, { "--fill": 1, duration: 1.6, ease: "power2.inOut" }, 0)
    .fromTo(dots, { scale: 0 }, { scale: 1, duration: .45, ease: "back.out(2.6)", stagger: .32 }, .05);
  return () => { line.style.removeProperty("--fill"); dots.forEach(dot => dot.style.removeProperty("transform")); };
}

export function SutilMotion() {
  useBrandMotion('[data-model="sutil"]', build);
  // No visible pause button (21/11/2026): the scenes move with the scroll and arrivals last under 5 s, so WCAG 2.2.2
  // asks for none; reduced motion still gets the still version automatically (useBrandMotion).
  return null;
}
