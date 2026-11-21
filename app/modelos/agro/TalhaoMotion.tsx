"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import { mapSize, plots } from "@/lib/talhao";
import styles from "./talhao.module.css";

/**
 * Talhão's signature motion: "os talhões se acendem". Over the aerial photo of the farm, the scroll travels plot by
 * plot: the camera leans towards it, its outline is drawn like a GPS harvest map, a numbered pin lands and it lights
 * up, while the map legend shows the same situation. At the end the camera pulls back with every plot outlined.
 * Fully reversible. Without motion, CSS shows every outline and the whole legend.
 */
const START = .1, STEP = .15, END = START + STEP * plots.length;

function focus(plot: (typeof plots)[number]) {
  return { px: plot.marker.x / mapSize.w, py: plot.marker.y / mapSize.h };
}

function build(root: HTMLElement) {
  const hero = root.querySelector<HTMLElement>("[data-talhao-hero]");
  const map = root.querySelector<HTMLElement>("[data-talhao-map]");
  if (!hero || !map) return;
  const frame = map.parentElement!;
  const phone = matchMedia("(max-width: 900px)").matches;
  const scale = phone ? 1.25 : 1.35;
  // Where the active plot should sit inside the map frame: centred on computers (the map has its own half of the
  // screen), above the legend sheet on phones.
  const target = phone ? { x: .5, y: .27 } : { x: .5, y: .5 };

  const legend = root.querySelector<HTMLElement>(`.${styles.legend}`);
  /**
   * Translation that brings a map point to the target, clamped so the map edges never show where the map is seen.
   * On phones the legend sheet covers the bottom of the frame, so the map may rise until its lower edge meets the
   * sheet: plots at the bottom of the farm can still reach the visible part.
   */
  const shift = (px: number, py: number, s: number) => {
    const w = map.offsetWidth, h = map.offsetHeight, vw = frame.clientWidth, vh = frame.clientHeight;
    const visibleBottom = phone && legend ? vh - legend.offsetHeight : vh;
    const x = (target.x - .5) * vw - s * (px - .5) * w;
    const y = (target.y - .5) * vh - s * (py - .5) * h;
    const roomX = Math.max(0, (w * s - vw) / 2);
    return {
      x: Math.max(-roomX, Math.min(roomX, x)),
      y: Math.max(visibleBottom - vh / 2 - (h * s) / 2, Math.min((h * s) / 2 - vh / 2, y)),
    };
  };

  const groups = plots.map(plot => root.querySelector<SVGGElement>(`[data-plot="${plot.id}"]`)!);
  const steps = plots.map(plot => root.querySelector<HTMLElement>(`[data-step="${plot.id}"]`)!);
  const holes = plots.map(plot => root.querySelector<SVGElement>(`[data-hole="${plot.id}"]`)!);
  let active = -2;
  const mark = (progress: number) => {
    const index = progress >= END ? -1 : Math.min(plots.length - 1, Math.floor((progress - START) / STEP));
    if (index === active) return;
    active = index;
    groups.forEach((g, i) => g.toggleAttribute("data-current", i === index));
    holes.forEach((h, i) => h.toggleAttribute("data-on", i === index));
    steps.forEach((s, i) => s.toggleAttribute("data-active", i === index || (index === -1 && progress >= END)));
    root.querySelector(`.${styles.legend}`)?.toggleAttribute("data-all", progress >= END);
    // While a plot is lit, phones show only its situation and the call: the map gets most of the screen.
    legend?.toggleAttribute("data-reading", index >= 0);
  };

  gsap.set("[data-plot-line]", { strokeDashoffset: 1 });
  gsap.set("[data-plot-marker]", { scale: 0, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set("[data-talhao-shade]", { opacity: 0 });

  // Arrival, once and only from the top: every outline draws itself over the farm and fades, so the map reads as
  // something that answers the scroll. A visitor who lands mid-page does not see it.
  gsap.set("[data-ghost]", { strokeDashoffset: 1 });
  if (scrollY < 10) {
    gsap.timeline({ delay: .5 })
      .to("[data-ghost]", { strokeDashoffset: 0, duration: .9, ease: "power2.out", stagger: .12 })
      .to("[data-talhao-ghosts]", { opacity: 0, duration: .7, ease: "power1.in" }, "+=.5");
  } else gsap.set("[data-talhao-ghosts]", { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true, onUpdate: self => mark(self.progress) },
  });
  tl.fromTo(map, { scale: 1.12, x: 0, y: 0 }, { scale: 1, duration: START }, 0)
    .to("[data-talhao-hint]", { opacity: 0, duration: START * .6 }, 0)
    // The farm darkens while the plots are told one by one, and lights up again at the end.
    .to("[data-talhao-shade]", { opacity: 1, duration: STEP * .4 }, START - .02)
    .to("[data-talhao-shade]", { opacity: 0, duration: .04 }, END);
  plots.forEach((plot, i) => {
    const t = START + i * STEP;
    const { px, py } = focus(plot);
    const g = groups[i];
    tl.to(map, { scale, x: () => shift(px, py, scale).x, y: () => shift(px, py, scale).y, duration: STEP * .55, ease: "power1.inOut" }, t)
      .to(g.querySelector("[data-plot-line]"), { strokeDashoffset: 0, duration: STEP * .45 }, t + STEP * .15)
      .to(g.querySelector("[data-plot-marker]"), { scale: 1, opacity: 1, duration: STEP * .2, ease: "back.out(2)" }, t + STEP * .45);
  });
  tl.to(map, { scale: 1, x: 0, y: 0, duration: 1 - END - .02, ease: "power1.inOut" }, END);
  mark(0);

  return fieldFilm(root);
}

/**
 * Close to the ground: the field film (public/videos/talhao/{d,m}, 100 frames) runs with the scroll, from the dirt
 * road down into the soy rows, and back. Frames load only when the section is two screens away.
 */
const FIELD_FRAMES = 100;
function fieldFilm(root: HTMLElement) {
  const field = root.querySelector<HTMLElement>("[data-talhao-field]");
  const canvas = root.querySelector<HTMLCanvasElement>("[data-field-canvas]");
  const ctx = canvas?.getContext("2d");
  if (!field || !canvas || !ctx) return;
  const set = matchMedia("(max-width: 700px)").matches ? "m" : "d";
  const frames: HTMLImageElement[] = [];
  let current = 0;
  const draw = () => {
    const img = frames[current];
    if (!img?.complete || !img.naturalWidth) return;
    const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio, 2);
    if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const s = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    field.dataset.ready = "true";
  };
  const load = () => {
    for (let i = 1; i <= FIELD_FRAMES; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = `/videos/talhao/${set}/${String(i).padStart(4, "0")}.webp`;
      if (i === 1 || i - 1 === current) img.onload = draw;
      frames.push(img);
    }
  };
  const io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { io.disconnect(); load(); } }, { rootMargin: "200% 0px" });
  io.observe(field);
  gsap.timeline({ scrollTrigger: { trigger: field, start: "top top", end: "bottom bottom", scrub: .4, onUpdate: self => {
    // The sentence follows the camera: the road first, then the ground itself.
    field.toggleAttribute("data-late", self.progress > .5);
    const next = Math.min(FIELD_FRAMES - 1, Math.round(self.progress * (FIELD_FRAMES - 1)));
    if (next !== current) { current = next; draw(); }
  } } }).to({}, { duration: 1 });
  const resize = () => { canvas.width = 0; draw(); };
  addEventListener("resize", resize);
  return () => { io.disconnect(); removeEventListener("resize", resize); delete field.dataset.ready; field.removeAttribute("data-late"); };
}

export function TalhaoMotion() {
  useBrandMotion('[data-model="talhao"]', build);
  // No visible pause button (21/11/2026): the scenes move with the scroll and arrivals last under 5 s, so WCAG 2.2.2
  // asks for none; reduced motion still gets the still version automatically (useBrandMotion).
  return null;
}
