"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import styles from "./toca.module.css";

/**
 * Toca's signature motion, "O percurso": the hospital doors open room by room as the visitor scrolls.
 * Closed doors carry the numbered sign of the next room; they open onto the photo (taken at the animal's height),
 * the camera settles, the caption appears, and the doors close again on the next sign. Fully reversible.
 */
function build(root: HTMLElement) {
  const scene = root.querySelector<HTMLElement>("[data-toca-route]");
  if (!scene) return;
  const rooms = gsap.utils.toArray<HTMLElement>("[data-route-room]", scene);
  const captions = gsap.utils.toArray<HTMLElement>("[data-route-caption]", scene);
  const signs = gsap.utils.toArray<HTMLElement>("[data-door-sign]", scene);
  const marks = gsap.utils.toArray<HTMLElement>("[data-route-mark]", scene);
  const left = scene.querySelector("[data-door=left]");
  const right = scene.querySelector("[data-door=right]");

  gsap.set(rooms, { autoAlpha: 0 });
  gsap.set(rooms[0], { autoAlpha: 1 });
  gsap.set(captions, { autoAlpha: 0, y: 24 });
  gsap.set(signs, { autoAlpha: 0 });
  gsap.set(signs[0], { autoAlpha: 1 });
  gsap.set([left, right], { xPercent: 0 });

  const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: .5, invalidateOnRefresh: true } });
  const span = 1 / rooms.length;
  rooms.forEach((room, i) => {
    const at = i * span;
    if (i > 0) {
      // Close on the next room's sign, swap the room behind the doors.
      // Doors fully closed from at - .02 to at + .08 (in room spans): long enough to read the next sign.
      tl.to(left, { xPercent: 0, duration: span * .12, ease: "power1.inOut" }, at - span * .14)
        .to(right, { xPercent: 0, duration: span * .12, ease: "power1.inOut" }, "<")
        .to(signs[i - 1], { autoAlpha: 0, duration: .001 }, at - span * .02)
        .to(signs[i], { autoAlpha: 1, duration: .001 }, "<")
        .to(rooms[i - 1], { autoAlpha: 0, duration: .001 }, "<")
        .to(room, { autoAlpha: 1, duration: .001 }, "<");
    }
    // The first doors open almost at once; the next ones wait for the closing above.
    const open = i === 0 ? .02 : span * .08;
    tl.to(left, { xPercent: -101, duration: span * .2, ease: "power2.inOut" }, at + open)
      .to(right, { xPercent: 101, duration: span * .2, ease: "power2.inOut" }, "<")
      .fromTo(room.querySelector("img"), { scale: 1.14 }, { scale: 1, duration: span * .7 }, at + open)
      .to(captions[i], { autoAlpha: 1, y: 0, duration: span * .1 }, at + open + span * .16);
    if (i < rooms.length - 1) tl.to(captions[i], { autoAlpha: 0, y: -16, duration: span * .08 }, at + span * .74);
  });
  // Pad the timeline to exactly 1 so scroll progress and room positions match.
  tl.to({}, { duration: .001 }, .999);
  // The wayfinding lights the next room together with the sign on the closed doors, in both scroll directions.
  const lightMarks = () => {
    const current = Math.max(0, rooms.findLastIndex((_, i) => tl.time() >= i * span - span * .02));
    marks.forEach((mark, m) => mark.toggleAttribute("data-active", m === current));
  };
  tl.eventCallback("onUpdate", lightMarks);
  lightMarks();
  return () => marks.forEach(mark => mark.removeAttribute("data-active"));
}

export function TocaMotion() {
  const { paused, available, toggle } = useBrandMotion('[data-model="toca"]', build);
  if (!available) return null;
  return <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={toggle}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
