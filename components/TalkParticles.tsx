"use client";

import { useEffect, useRef } from "react";
import styles from "@/app/editorial.module.css";

/**
 * "A conversa", the end of the thread: when the brand dot lands as the full stop of "Vamos conversar" and lights up,
 * some of the same points that formed Gabriel, his hand and his projects gather around it from outside the panel and
 * stay there in a slow, loose orbit that breathes with the dot's pulse. The pointer draws the cloud toward itself and
 * hovering the panel quickens it, an invitation to click. In the paper's own colours (cream and copper), never red
 * shapes. Only with motion allowed, and only while the panel is on screen; otherwise there is just the lit dot.
 */
type Point = { a: number; r: number; w: number; phase: number; size: number; colour: string; from: number; reach: number; delay: number };
const COLOURS = ["#fff7ef", "#fff3e8", "#faf6ef", "#994b2b", "#b8653f", "#514b47"];

export function TalkParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const view = ref.current;
    const panel = view?.parentElement;
    const root = view?.closest<HTMLElement>("[data-editorial]");
    const dot = panel?.querySelector<HTMLElement>("[data-contact-dot]");
    const paint = view?.getContext("2d");
    if (!view || !panel || !root || !dot || !paint) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const phone = innerWidth < 700;
    const points: Point[] = Array.from({ length: phone ? 120 : 220 }, () => {
      const inner = Math.random();
      return {
        a: Math.random() * Math.PI * 2,
        r: 1.3 + Math.pow(inner, 1.6) * 3.7,          // In dot widths: dense near the dot, thinning outward, inside the panel.
        w: (.16 + Math.random() * .22) * (Math.random() < .5 ? -1 : 1),
        phase: Math.random() * Math.PI * 2,
        size: .7 + Math.random() * 1.5,
        colour: COLOURS[Math.floor(Math.random() * COLOURS.length)],
        from: -Math.PI * (.15 + Math.random() * .7),  // They come in from above, where the dot came from.
        reach: 300 + Math.random() * 500,
        delay: Math.random() * .45,
      };
    });
    let gather = 0, last = 0, frame = 0, visible = false, hover = 0, hovering = false;
    // They settle (22/11/2026): about two and a half seconds after gathering they slow to a still constellation, so
    // nothing here moves on its own for more than five seconds. The pointer wakes them again.
    let energy = 1, settled = 0, clock = 0;
    const pointer = { x: 0, y: 0, in: false };
    const lean = { x: 0, y: 0 };
    const allowed = () => !document.hidden && !reduced.matches && root.dataset.editorialMotion !== "off" && root.dataset.editorialAnimated === "true";
    const ease = (t: number) => t <= 0 ? 0 : t >= 1 ? 1 : 1 - Math.pow(1 - t, 3);
    const draw = (now: number) => {
      frame = 0;
      const dt = Math.min(.05, last ? (now - last) / 1000 : 0);
      last = now;
      const lit = dot.dataset.lit === "true" && allowed();
      // Gathering takes about a second and a half; scrolling back undoes it twice as fast.
      gather = Math.min(1, Math.max(0, gather + (lit ? dt / 1.5 : -dt / .75)));
      hover += ((hovering ? 1 : 0) - hover) * Math.min(1, dt * 4);
      settled = gather >= 1 && !hovering ? settled + dt : 0;
      energy += ((settled < 2.5 ? 1 : 0) - energy) * Math.min(1, dt * 2.5);
      clock += dt * energy;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      const box = panel.getBoundingClientRect();
      const w = Math.round(box.width * ratio), h = Math.round(box.height * ratio);
      if (view.width !== w || view.height !== h) { view.width = w; view.height = h; }
      paint.setTransform(ratio, 0, 0, ratio, 0, 0);
      paint.clearRect(0, 0, box.width, box.height);
      if (gather > 0) {
        const d = dot.getBoundingClientRect();
        const unit = Math.max(8, d.width);
        const cx = d.left + d.width / 2 - box.left, cy = d.top + d.height / 2 - box.top;
        // The cloud leans a little toward the pointer.
        const tx = pointer.in ? Math.max(-1, Math.min(1, (pointer.x - cx) / 300)) * unit * 1.6 : 0;
        const ty = pointer.in ? Math.max(-1, Math.min(1, (pointer.y - cy) / 300)) * unit * 1.6 : 0;
        lean.x += (tx - lean.x) * Math.min(1, dt * 3); lean.y += (ty - lean.y) * Math.min(1, dt * 3);
        const t = clock, breath = Math.sin(t * Math.PI * 2 / 2.2);
        for (const p of points) {
          const k = ease((gather - p.delay) / (1 - p.delay));
          if (k <= 0) continue;
          p.a += p.w * dt * energy * (1 + hover * 1.4) / Math.sqrt(p.r);
          const r = p.r * unit * (1 + .07 * breath + .05 * Math.sin(t * 1.3 + p.phase));
          const ox = cx + lean.x * (p.r / 5) + Math.cos(p.a) * r, oy = cy + lean.y * (p.r / 5) + Math.sin(p.a) * r * .78;
          const sx = cx + Math.cos(p.from) * p.reach, sy = cy + Math.sin(p.from) * p.reach;
          const x = sx + (ox - sx) * k, y = sy + (oy - sy) * k;
          paint.globalAlpha = Math.min(1, k * 1.4) * (.55 + .45 * Math.sin(t * 1.7 + p.phase * 2) ** 2);
          paint.fillStyle = p.colour;
          paint.beginPath();
          paint.arc(x, y, p.size, 0, Math.PI * 2);
          paint.fill();
        }
        paint.globalAlpha = 1;
      }
      const still = gather >= 1 && energy < .01 && Math.abs(lean.x) + Math.abs(lean.y) < .5;
      if (visible && (gather > 0 || lit) && !still) frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(draw); } };
    const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) wake(); });
    seen.observe(panel);
    const lit = new MutationObserver(wake);
    lit.observe(dot, { attributes: true, attributeFilter: ["data-lit"] });
    const motion = new MutationObserver(wake);
    motion.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion", "data-editorial-animated"] });
    const move = (event: PointerEvent) => { const box = panel.getBoundingClientRect(); pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top; pointer.in = true; hovering = true; wake(); };
    const leave = () => { pointer.in = false; hovering = false; wake(); };
    panel.addEventListener("pointermove", move);
    panel.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect(); lit.disconnect(); motion.disconnect();
      panel.removeEventListener("pointermove", move);
      panel.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className={styles.talkParticles} aria-hidden="true" />;
}
