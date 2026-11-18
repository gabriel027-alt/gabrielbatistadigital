"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import styles from "./lume.module.css";

/**
 * Lume's signature motion: "as cobranças se soltam". On arrival the demands land on the headline, pressing it;
 * the scroll lets them go one by one (they fall out of the frame), the headline clears and the curtain light
 * enters the room. Scrolling back lifts them into place again. Without motion, CSS shows the clean headline
 * with the demands struck through beside it.
 */
function build(root: HTMLElement) {
  const hero = root.querySelector<HTMLElement>("[data-lume-hero]");
  if (!hero) return;
  const pieces = gsap.utils.toArray<HTMLElement>("[data-lume-weight]", root);

  // Arrival: the demands drop onto the title, heaviest last, and the title gives a little under them.
  gsap.timeline({ delay: .35 })
    // fromTo with explicit end values: a re-run (pause/resume, dev double effects) must never capture a half-faded state.
    .fromTo(pieces, { opacity: 0, scale: 1.25 }, { opacity: 1, scale: 1, duration: .5, ease: "power3.in", stagger: .12 })
    .fromTo("[data-lume-title]", { scaleY: 1.04 }, { scaleY: 1, duration: .5, ease: "power2.out", transformOrigin: "50% 100%" }, .2);

  const fall = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: hero, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true } });
  pieces.forEach((piece, i) => {
    const turn = parseFloat(piece.style.getPropertyValue("--turn")) || 0;
    fall.to(piece, {
      y: () => innerHeight * 1.1,
      rotation: turn * 7 + (i % 2 ? 24 : -18),
      ease: "power2.in",
      duration: .26,
    }, .04 + i * .11);
  });
  fall.fromTo("[data-lume-title]", { opacity: .42 }, { opacity: 1, duration: .8 }, 0)
    .fromTo("[data-lume-curtain]", { opacity: .1, xPercent: -8 }, { opacity: 1, xPercent: 0, duration: .9 }, 0)
    .fromTo(hero, { "--lume-light": 0 }, { "--lume-light": 1, duration: .9 }, 0)
    .fromTo("[data-lume-after]", { opacity: .55 }, { opacity: 1, duration: .25, stagger: .05 }, .7)
    .to({}, { duration: .1 });
}

export function LumeMotion() {
  const { paused, available, toggle } = useBrandMotion('[data-model="lume"]', build);
  if (!available) return null;
  return <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={toggle}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
