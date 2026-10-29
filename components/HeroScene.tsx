"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
const FRAME_COUNT = 9;
const tools = [["React", "react"], ["Next.js", "nextdotjs"], ["TypeScript", "typescript"], ["Claude", "claude"], ["GitHub", "github"], ["ChatGPT", "openai"]] as const;
export function HeroScene() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const node = root.current!;
    const canvas = canvasRef.current!;
    const openingImage = imageRef.current;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    const section = node.closest("section")!;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = matchMedia("(max-width: 900px)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const frames: (HTMLImageElement | undefined)[] = [];
    const loading = new Set<number>();
    let disposed = false;
    let visible = true;
    let raf = 0;
    let position = 0;
    let painted = -1;
    let width = 0;
    let height = 0;
    const staticMotion = () => media.matches || !!saveData;
    const paused = () => document.documentElement.dataset.motion === "paused";
    const paint = (index: number) => {
      const image = frames[index];
      if (!image || !image.complete || !image.naturalWidth || !width || !height) return;
      // One opaque source per draw. Never blend faces or retain a previous exposure.
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const visibleWidth = width / scale;
      const visibleHeight = height / scale;
      const x = (image.naturalWidth - visibleWidth) * (mobile.matches ? .72 : .5);
      const y = (image.naturalHeight - visibleHeight) * .5;
      context.drawImage(image, x, y, visibleWidth, visibleHeight, 0, 0, width, height);
      painted = index;
      node.dataset.ready = "true";
      node.dataset.frame = String(index);
      node.dataset.view = index === 0 ? "frontal" : index === FRAME_COUNT - 1 ? "lateral" : "intermediate";
      node.style.setProperty("--sequence-progress", String(index / (FRAME_COUNT - 1)));
    };
    const load = (index: number) => {
      if (disposed || frames[index] || loading.has(index)) return;
      loading.add(index);
      const image = new window.Image();
      image.decoding = "async";
      image.onload = () => {
        if (disposed) return;
        frames[index] = image;
        const wanted = Math.round(position);
        if (wanted === index || painted < 0 && index === 0) paint(index);
      };
      image.src = `/images/hero/frames/${String(index).padStart(2, "0")}${mobile.matches ? "-mobile" : ""}.webp`;
    };
    const preload = () => {
      if (staticMotion()) return;
      // Small local WebPs: load neighbors before more distant poses.
      const wanted = Math.round(position);
      [wanted, wanted + 1, wanted - 1, 0, 8, 2, 3, 4, 5, 6, 7, 1].forEach(index => {
        if (index >= 0 && index < FRAME_COUNT) load(index);
      });
    };
    const tick = () => {
      raf = 0;
      if (disposed || !visible) return;
      const bounds = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(1, bounds.height - innerHeight)));
      const target = staticMotion() ? 0 : Math.min(1, Math.max(0, (progress - .06) / .64)) * (FRAME_COUNT - 1);
      if (paused() && !staticMotion()) return;
      position = staticMotion() ? 0 : Math.abs(target - position) < .015 ? target : position + (target - position) * .22;
      const index = Math.round(position);
      if (painted !== index) { load(index); paint(index); }
      section.style.setProperty("--hero-progress", String(staticMotion() ? 0 : progress));
      if (Math.abs(position - target) > .015) raf = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!raf && visible && !disposed) raf = requestAnimationFrame(tick); };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, mobile.matches ? 1 : 1.5);
      width = Math.round(rect.width * ratio);
      height = Math.round(rect.height * ratio);
      canvas.width = width; canvas.height = height;
      paint(painted >= 0 ? painted : 0);
      schedule();
    };
    const openingReady = () => {
      if (disposed || !openingImage?.naturalWidth) return;
      // Keep canvas frames independent of the responsive DOM image. Its srcset
      // may reload on resize; holding that element could clear a painted canvas.
      load(0);
      if (painted >= 0) paint(painted);
      preload();
    };
    const preference = () => { if (staticMotion()) position = 0; preload(); resize(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      document.documentElement.dataset.portraitVisible = String(visible);
      if (visible) { preload(); schedule(); }
    });
    observer.observe(node);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    openingImage?.addEventListener("load", openingReady);
    if (openingImage?.complete) openingReady();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("atelier-motion", preference);
    media.addEventListener("change", preference);
    mobile.addEventListener("change", preference);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf); observer.disconnect(); resizeObserver.disconnect();
      openingImage?.removeEventListener("load", openingReady);
      delete document.documentElement.dataset.portraitVisible;
      removeEventListener("scroll", schedule); removeEventListener("atelier-motion", preference);
      media.removeEventListener("change", preference); mobile.removeEventListener("change", preference);
    };
  }, []);
  return <div className="atelier-scene" ref={root} data-view="frontal" data-frame="0" data-ready="false">
    <div className="cinema-image cinema-front"><Image ref={imageRef} src="/images/hero/frames/00.webp" alt="Gabriel trabalhando no notebook; sequência de enquadramentos frontal a lateral" fill preload sizes="100vw" /></div>
    <canvas ref={canvasRef} className="cinema-sequence" aria-hidden="true" />
    <div className="cinema-shade" aria-hidden="true" />
    <div className="cinema-tools" aria-label="Ferramentas de desenvolvimento"><span className="cinema-tools-label">IDEIAS EM BOA COMPANHIA</span><ul>{tools.map(([name, slug]) => <li key={slug}><i style={{ maskImage: `url(/images/brands/${slug}.svg)` }} aria-hidden="true" /><span>{name}</span></li>)}</ul></div>
    <div className="cinema-position" aria-hidden="true"><span>01 / VISÃO</span><i /><span>02 / EXECUÇÃO</span></div>
  </div>;
}
