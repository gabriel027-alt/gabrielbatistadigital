"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import { recovery, recoveryDays } from "@/lib/sutil";
import styles from "./sutil.module.css";

/**
 * Sutil's signature motion: the recovery, day by day. The scroll moves a marker along the ruler of days,
 * the day counter climbs, the milestone text changes and the window light crosses the recovery room.
 * The ruler is square-root scaled (rulerPosition) so the first, denser weeks get room: the marker moves
 * linearly with the scroll while the day climbs with its square. Fully reversible.
 */
function build(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>("[data-sutil-recovery]");
  if (!section) return;
  const counter = root.querySelector<HTMLElement>("[data-day-count]");
  const fill = root.querySelector<HTMLElement>("[data-ruler-fill]");
  const marker = root.querySelector<HTMLElement>("[data-ruler-marker]");
  const milestones = gsap.utils.toArray<HTMLElement>("[data-milestone]", root);
  const stops = gsap.utils.toArray<HTMLElement>("[data-ruler-stop]", root);
  const state = { p: 0 };
  let active = -1;

  const render = () => {
    const day = Math.max(1, Math.round(1 + (recoveryDays - 1) * state.p * state.p));
    if (counter) counter.textContent = String(day);
    fill?.style.setProperty("transform", `scaleX(${state.p})`);
    marker?.style.setProperty("left", `${state.p * 100}%`);
    let current = 0;
    recovery.forEach((stop, i) => { if (day >= stop.day) current = i; });
    if (current !== active) {
      active = current;
      milestones.forEach((item, i) => item.toggleAttribute("data-active", i === current));
    }
    stops.forEach((item, i) => item.toggleAttribute("data-reached", day >= recovery[i].day));
  };

  const timeline = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: .5, invalidateOnRefresh: true } });
  timeline.to(state, { p: 1, duration: 1, onUpdate: render }, 0)
    // Morning light crosses the room as the days pass; the photo settles.
    .fromTo("[data-recovery-light]", { xPercent: -60, opacity: .85 }, { xPercent: 70, opacity: .35, duration: 1 }, 0)
    .fromTo("[data-recovery-photo] img", { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
  render();

  return () => {
    milestones.forEach(item => item.removeAttribute("data-active"));
    stops.forEach(item => item.removeAttribute("data-reached"));
    fill?.style.removeProperty("transform");
    marker?.style.removeProperty("left");
  };
}

export function SutilMotion() {
  const { paused, available, toggle } = useBrandMotion('[data-model="sutil"]', build);
  if (!available) return null;
  return <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={toggle}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
