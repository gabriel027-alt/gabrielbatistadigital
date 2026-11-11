"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "@/app/propostas/vanguard/vanguard.module.css";

/** The opening is played by the scroll: a blank sheet, the project's lines, then the photograph. */
export function VanguardMotion() {
  const [paused, setPaused] = useState(false);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-vanguard]");
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      setAvailable(true);
      if (paused) return () => setAvailable(false);
      root.dataset.vanguardAnimated = "true";
      const title = root.querySelector<HTMLElement>("[data-vg-title]")!;
      const split = SplitText.create(title, { type: "words,chars", charsClass: "vg-char" });
      const ctx = gsap.context(() => {
        const lines = gsap.utils.toArray<SVGPathElement>("[data-vg-line]");
        const light = getComputedStyle(root).getPropertyValue("--vg-light").trim();
        const ink = getComputedStyle(root).getPropertyValue("--vg-ink").trim();
        // Starting state: a blank sheet with dark lines ready to be drawn.
        gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1, stroke: ink, strokeOpacity: .85 });
        gsap.set("[data-vg-photo]", { opacity: 0, clipPath: "inset(46% 40% 38% 38%)" });
        gsap.set("[data-vg-shade]", { opacity: 0 });
        gsap.set("[data-vg-note]", { opacity: 0, y: 12 });

        const play = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "[data-vg-opening]", start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true } });
        // Letters converge on the centre of each word while the first lines are drawn.
        const chars = split.chars as HTMLElement[];
        chars.forEach(char => {
          const word = char.parentElement!;
          const offset = char.offsetLeft + char.offsetWidth / 2 - word.offsetWidth / 2;
          play.fromTo(char, { x: offset * 1.6, opacity: 0 }, { x: 0, opacity: 1, duration: .22, ease: "power2.out" }, Math.abs(offset) / (word.offsetWidth || 1) * .08);
        });
        play.to(lines[0], { strokeDashoffset: 0, duration: .1 }, 0)
          .to(lines[1], { strokeDashoffset: 0, duration: .1 }, .06)
          .to(lines.slice(2), { strokeDashoffset: 0, duration: .12, stagger: .035 }, .12)
          // The photograph appears through the glass opening, then fills the sheet.
          .to("[data-vg-photo]", { opacity: 1, duration: .06 }, .38)
          .to("[data-vg-photo]", { clipPath: "inset(0% 0% 0% 0%)", duration: .17, ease: "power2.inOut" }, .4)
          .to("[data-vg-shade]", { opacity: 1, duration: .12 }, .44)
          .to(lines, { stroke: light, strokeOpacity: .7, duration: .1 }, .42)
          .to("[data-vg-title-block], [data-vg-hint]", { color: light, duration: .08 }, .46)
          .to(lines, { strokeOpacity: .3, duration: .12 }, .58)
          .to("[data-vg-note]", { opacity: 1, y: 0, duration: .1, stagger: .07, ease: "power2.out" }, .62)
          .fromTo("[data-vg-frame]", { scale: 1 }, { scale: 1.06, duration: .45 }, .55);

        // Peak: one camera walks the route through the house, one step at a time.
        const stage = root.querySelector<HTMLElement>("[data-vg-route-stage]")!;
        const frame = root.querySelector<HTMLElement>("[data-vg-route-frame]")!;
        const steps = gsap.utils.toArray<HTMLElement>("[data-vg-step]");
        const camera = (step: HTMLElement) => {
          const [fx, fy, scale] = step.dataset.camera!.split(",").map(Number);
          // Where the point should land on screen, and how far the camera may move without showing an edge.
          const place = (axis: "x" | "y") => () => {
            const box = stage.getBoundingClientRect();
            const shot = frame.getBoundingClientRect();
            const view = axis === "x" ? box.width : box.height;
            const size = axis === "x" ? shot.width : shot.height;
            // Centre of the frame inside the stage (the camera scales around it).
            const centre = axis === "x" ? shot.left - box.left + size / 2 : shot.top - box.top + size / 2;
            const narrow = box.width < 700;
            const target = (axis === "x" ? (narrow ? .5 : .62) : (narrow ? .36 : .45)) * view;
            const wanted = target - centre - ((axis === "x" ? fx : fy) / 100 - .5) * size * scale;
            const reach = size * scale / 2;
            // Keep the photograph covering the stage: left/top edge <= 0, right/bottom edge >= view.
            return gsap.utils.clamp(view - centre - reach, reach - centre, wanted);
          };
          return { scale, x: place("x"), y: place("y") };
        };
        gsap.set("[data-vg-route-shade]", { opacity: 0 });
        gsap.set("[data-vg-route-title]", { opacity: 0, y: 24 });
        gsap.set(steps, { opacity: 0, y: 18 });
        // Attributes, not CSS: with pathLength the CSS value gains "px" and the tween jumps instead of drawing.
        gsap.set("[data-vg-route-line]", { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
        gsap.set("[data-vg-route-point]", { opacity: 0 });
        const walk = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "[data-vg-route]", start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true } });
        walk.to("[data-vg-route-shade]", { opacity: 1, duration: .1 }, 0)
          .to("[data-vg-route-title]", { opacity: 1, y: 0, duration: .08, ease: "power2.out" }, .03)
          .to("[data-vg-route-point]", { opacity: 1, duration: .04 }, .12);
        const legs = [.6, .26, 0];
        steps.forEach((step, index) => {
          const start = .12 + index * .28;
          walk.to("[data-vg-camera]", { ...camera(step), duration: .22, ease: "power1.inOut" }, start)
            .to("[data-vg-route-line]", { attr: { "stroke-dashoffset": legs[index] }, duration: .2 }, start + .02)
            .to(step, { opacity: 1, y: 0, duration: .05, ease: "power2.out" }, start + .07);
          if (index < steps.length - 1) walk.to(step, { opacity: 0, y: -18, duration: .04 }, start + .25);
        });
        walk.to({}, { duration: .06 }, .94);

        // Peak: terrain, the first sketch drawn on it, the study model, the house. The pencil on the left measures the way.
        const stagesText = gsap.utils.toArray<HTMLElement>("[data-vg-process-step]");
        const sketch = gsap.utils.toArray<SVGPathElement>("[data-vg-sketch]");
        gsap.set("[data-vg-process-title]", { opacity: 0, y: 24 });
        gsap.set(stagesText, { opacity: 0, y: 18 });
        gsap.set("[data-vg-process-shade]", { opacity: 0 });
        // The sketch layer repeats the terrain photo, so both open together from the horizon.
        gsap.set('[data-vg-layer="terreno"], [data-vg-layer="conversa"]', { clipPath: "inset(50% 0% 50% 0%)" });
        gsap.set(sketch, { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
        gsap.set('[data-vg-layer="maquete"], [data-vg-layer="casa"]', { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set("[data-vg-pencil]", { scaleY: 0 });
        gsap.set("[data-vg-tick]", { scale: 0 });
        const showStage = (index: number, at: number, last = false) => {
          start.to(stagesText[index], { opacity: 1, y: 0, duration: .04, ease: "power2.out" }, at)
            .to("[data-vg-tick]", { scale: (i: number) => i <= index ? 1 : 0, duration: .03, ease: "back.out(2)" }, at);
          if (!last) start.to(stagesText[index], { opacity: 0, y: -18, duration: .03 }, at + .16);
        };
        const start = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "[data-vg-process]", start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true } });
        start.to("[data-vg-process-title]", { opacity: 1, y: 0, duration: .05, ease: "power2.out", stagger: .02 }, 0)
          .to("[data-vg-pencil]", { scaleY: 1, duration: .9 }, .04)
          // 1. The terrain opens from the horizon.
          .to('[data-vg-layer="terreno"], [data-vg-layer="conversa"]', { clipPath: "inset(0% 0% 0% 0%)", duration: .14, ease: "power2.inOut" }, .03)
          .to("[data-vg-process-shade]", { opacity: 1, duration: .08 }, .08);
        showStage(0, .1);
        // 2. The house is sketched over the same terrain.
        start.to(sketch, { attr: { "stroke-dashoffset": 0 }, duration: .1, stagger: .022 }, .3);
        showStage(1, .33);
        // 3. The study model slides in, pushing the sketch away.
        start.to('[data-vg-layer="maquete"]', { clipPath: "inset(0% 0% 0% 0%)", duration: .14, ease: "power2.inOut" }, .54);
        showStage(2, .58);
        // 4. The house takes the frame.
        start.to('[data-vg-layer="casa"]', { clipPath: "inset(0% 0% 0% 0%)", duration: .14, ease: "power2.inOut" }, .76);
        showStage(3, .8, true);
        start.to({}, { duration: .06 }, .94);
      }, root);
      // Photos sit in fixed-ratio boxes, so loading them never moves the layout. Refreshing on each image load
      // made ScrollTrigger restore an older scroll position mid-scroll; only the fonts can change heights.
      let alive = true;
      void document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      return () => {
        alive = false;
        ctx.revert();
        split.revert();
        delete root.dataset.vanguardAnimated;
        setAvailable(false);
      };
    });
    return () => media.revert();
  }, [paused]);

  if (!available) return null;
  return <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
