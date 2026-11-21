"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import styles from "./lume.module.css";

/**
 * Lume's signature motion: "as cobranças se soltam". On arrival the demands land on the headline, pressing it,
 * in the kitchen at 23h; the scroll lets them go one by one (they fall out of the frame), the headline clears and
 * the same kitchen turns into 7h. Scrolling back lifts them into place again and the night returns. Without motion,
 * CSS shows the morning, the clean headline and the demands struck through beside it.
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
    }, .04 + i * .08);
  });
  // Night turns into morning once most demands are gone: the same kitchen at 7h fades in over the one at 23h,
  // the pendant goes out, and the room, header and text change light together (--dawn on the page root).
  fall.fromTo("[data-lume-title]", { opacity: .42 }, { opacity: 1, duration: .7 }, 0)
    .fromTo("[data-lume-scene] img", { scale: 1.08 }, { scale: 1, duration: 1 }, 0)
    .fromTo("[data-lume-morning]", { opacity: 0 }, { opacity: 1, duration: .24, ease: "power1.inOut" }, .56)
    .fromTo("[data-lume-lamp]", { opacity: 1 }, { opacity: 0, duration: .2 }, .58)
    .fromTo(root, { "--dawn": 0 }, { "--dawn": 1, duration: .2, ease: "power1.inOut" }, .6)
    .fromTo("[data-lume-after]", { opacity: .55 }, { opacity: 1, duration: .2, stagger: .05 }, .72)
    .to({}, { duration: .08 });

  // Further down, the hour of the week that is hers lights up as the week comes into view (and dims on the way back).
  gsap.fromTo("[data-lume-hour]", { opacity: .08, scaleY: .15 }, {
    opacity: 1, scaleY: 1, ease: "none",
    scrollTrigger: { trigger: "[data-lume-week]", start: "top 82%", end: "top 42%", scrub: .5 },
  });
}

export function LumeMotion() {
  useBrandMotion('[data-model="lume"]', build);
  // No visible pause button (21/11/2026): the scenes move with the scroll and arrivals last under 5 s, so WCAG 2.2.2
  // asks for none; reduced motion still gets the still version automatically (useBrandMotion).
  return null;
}
