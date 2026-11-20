"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import { chapters, tourFrames } from "@/lib/paddock";
import styles from "./paddock.module.css";

/**
 * Paddock's signature motion: one continuous camera move, drawn frame by frame on a canvas as the visitor scrolls
 * (headlight, wheel/side, whole car). Every source frame is preserved; scrolling back reverses it.
 * Frames load progressively (coarse to fine) and the nearest loaded frame is drawn meanwhile.
 * Without JS, with reduced motion or when paused, the page shows one photograph per chapter instead.
 */
const coarseToFine = (count: number) => {
  const order: number[] = [];
  const seen = new Set<number>();
  for (const step of [32, 16, 8, 4, 2, 1]) for (let i = 0; i < count; i += step) if (!seen.has(i)) { seen.add(i); order.push(i); }
  if (!seen.has(count - 1)) order.push(count - 1);
  return order;
};

function build(root: HTMLElement) {
  const section = root.querySelector<HTMLElement>("[data-paddock-tour]");
  const canvas = root.querySelector<HTMLCanvasElement>("[data-tour-canvas]");
  const context = canvas?.getContext("2d");
  if (!section || !canvas || !context) return;
  const stage = root.querySelector<HTMLElement>("[data-tour-stage]");
  const hero = root.querySelector<HTMLElement>("[data-tour-hero]");
  const captions = gsap.utils.toArray<HTMLElement>("[data-tour-caption]", root);
  const marks = gsap.utils.toArray<HTMLElement>("[data-tour-mark]", root);


  // Portrait screens get the centre crop (405×720); wide screens the full 1280×720 frame.
  const set = matchMedia("(max-aspect-ratio: 4/5)").matches ? "m" : "d";
  const frames: (HTMLImageElement | null)[] = new Array(tourFrames).fill(null);
  const wideFrames = new Map<number, HTMLImageElement>();
  const wideQueue = set === "m" ? Array.from({ length: 15 }, (_, i) => i + 208) : [];
  const state = { frame: 0 };
  let shown = -1;
  let alive = true;

  const nearest = (target: number) => {
    for (let d = 0; d < tourFrames; d++) {
      if (frames[target - d]) return target - d;
      if (frames[target + d]) return target + d;
    }
    return -1;
  };
  const size = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const width = Math.round(canvas.clientWidth * ratio), height = Math.round(canvas.clientHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; shown = -1; }
  };
  const draw = () => {
    const index = nearest(Math.round(state.frame));
    if (index < 0 || index === shown) return;
    const image = frames[index]!;
    const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    // The supplied portrait crop cuts off the ends of the car. Pull back using the same final landscape frames.
    if (set === "m" && state.frame >= 208) {
      let wide = wideFrames.get(Math.round(state.frame));
      if (!wide) wide = [...wideFrames.entries()].sort((a,b) => Math.abs(a[0]-state.frame)-Math.abs(b[0]-state.frame))[0]?.[1];
      if (wide) {
        const alpha = Math.min(1, (state.frame - 208) / 10);
        context.save(); context.globalAlpha = alpha;
        context.fillStyle = "#0b1113"; context.fillRect(0,0,canvas.width,canvas.height);
        const fit = canvas.width / wide.naturalWidth;
        const fitHeight = wide.naturalHeight * fit;
        const top = (canvas.height - fitHeight) / 2;
        context.drawImage(wide, 0, top, canvas.width, fitHeight);
        const upper = context.createLinearGradient(0,top,0,top+fitHeight*.18);
        upper.addColorStop(0,"#0b1113"); upper.addColorStop(1,"#0b111300");
        context.fillStyle=upper; context.fillRect(0,top,canvas.width,fitHeight*.18);
        const lower = context.createLinearGradient(0,top+fitHeight*.88,0,top+fitHeight);
        lower.addColorStop(0,"#0b111300"); lower.addColorStop(1,"#0b1113");
        context.fillStyle=lower; context.fillRect(0,top+fitHeight*.88,canvas.width,fitHeight*.12);
        context.restore();
      }
    }
    shown = index;
    stage?.setAttribute("data-tour-ready", "true");
    if (stage) stage.dataset.tourFrame = String(index);
  };
  const chapterAt = (frame: number) => chapters.findIndex(chapter => frame + 1 <= chapter.to);
  let active = -1;
  const render = () => {
    draw();
    const progress = state.frame / (tourFrames - 1);
    const heroOpacity = Math.max(0, 1 - progress / .045);
    stage?.style.setProperty("--hero", heroOpacity.toFixed(3));
    if (hero) { hero.style.opacity = String(heroOpacity); hero.style.visibility = progress > .05 ? "hidden" : "visible"; }
    const current = progress < .05 ? -1 : chapterAt(state.frame);
    if (current !== active) {
      active = current;
      captions.forEach((caption, i) => caption.toggleAttribute("data-active", i === current));
    }
    const mark = chapterAt(state.frame);
    marks.forEach((item, i) => item.toggleAttribute("data-active", i === mark));

  };

  // Progressive loading, six requests at a time, coarse frames first.
  const queue = [...new Set([0, 119, 194, 222, ...coarseToFine(tourFrames)])];
  let loaded = 0;
  const load = () => {
    const next = queue.shift();
    if (next === undefined || !alive) return;
    const image = new Image();
    image.decoding = "async";
    image.src = `/videos/paddock/${set}/${String(next + 1).padStart(4, "0")}.webp`;
    image.decode().then(() => {
      if (!alive) return;
      frames[next] = image;
      if (stage) stage.dataset.tourLoaded = String(++loaded);
      const target = Math.round(state.frame);
      if (shown < 0 || Math.abs(next - target) < Math.abs(shown - target)) { shown = -2; draw(); }
    }).catch(() => {}).finally(load);
  };
  for (let i = 0; i < 6; i++) load();
  const loadWide = () => {
    const next = wideQueue.shift();
    if (next === undefined || !alive) return;
    const image = new Image(); image.decoding = "async";
    image.src = `/videos/paddock/d/${String(next + 1).padStart(4, "0")}.webp`;
    image.decode().then(() => { if (alive) { wideFrames.set(next,image); shown = -2; draw(); if(stage)stage.dataset.tourWideLoaded=String(wideFrames.size); } }).catch(() => {}).finally(loadWide);
  };
  if(set === "m") { loadWide(); loadWide(); }

  const resize = new ResizeObserver(() => { size(); shown = -2; draw(); });
  resize.observe(canvas);
  size();

  gsap.timeline({
    scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: .35, invalidateOnRefresh: true },
    defaults: { ease: "none", onUpdate: render },
  }).to(state, { frame: 167, duration: .55 })
    .to(state, { frame: 207, duration: .27 })
    .to(state, { frame: 222, duration: .18 });

  render();

  // Chapter marks jump to the start of their chapter.
  const jumps = marks.map((item, i) => {
    const go = () => {
      const top = section.getBoundingClientRect().top + scrollY;
      const travel = section.offsetHeight - innerHeight;
      scrollTo({ top: top + travel * chapters[i].progress + 2, behavior: "smooth" });
    };
    item.addEventListener("click", go);
    return () => item.removeEventListener("click", go);
  });

  return () => {
    alive = false;
    queue.length = 0; wideQueue.length = 0; wideFrames.clear();
    resize.disconnect();
    jumps.forEach(off => off());
    captions.forEach(caption => caption.removeAttribute("data-active"));
    marks.forEach(item => item.removeAttribute("data-active"));
    stage?.removeAttribute("data-tour-ready");
    stage?.style.removeProperty("--hero");
    if (stage) { delete stage.dataset.tourFrame; delete stage.dataset.tourLoaded; delete stage.dataset.tourWideLoaded; }
    if (hero) { hero.style.opacity = ""; hero.style.visibility = ""; }
  };
}

export function PaddockTour() {
  const { paused, available, toggle } = useBrandMotion('[data-model="paddock"]', build);
  if (!available) return null;
  return <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={toggle}>{paused ? "Ativar o tour" : "Pausar o tour"}</button>;
}
