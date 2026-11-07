"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import styles from "@/app/propostas/portfolio-editorial/editorial.module.css";
const subscribe = () => () => {};

export function EditorialMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  useEffect(() => {
    const node = root.current;
    if (!node || paused) return;
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    CustomEase.create("editorial-flow", ".625,.05,0,1");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      node.dataset.editorialAnimated = "true";
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      const lenis = new Lenis({ lerp: .1, smoothWheel: true, syncTouch: false, anchors: true, prevent: el => Boolean(el.closest("[data-lenis-prevent]")) });
      const tick = (seconds: number) => lenis.raf(seconds * 1000);
      lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(tick);
      const ctx = gsap.context(() => {
        gsap.to("[data-hero-photo]", { yPercent: 15, scale: 1.08, ease: "none", scrollTrigger: { trigger: "[data-hero-photo]", start: "top top", end: "bottom top", scrub: .8 } });
        gsap.utils.toArray<HTMLElement>("[data-shape]").forEach(shape => gsap.fromTo(shape, { y: 85, rotation: -8 }, { y: Number(shape.dataset.shape), rotation: 10, ease: "none", scrollTrigger: { trigger: "[data-hook]", start: "top bottom", end: "bottom top", scrub: 1 } }));
        gsap.utils.toArray<HTMLElement>("[data-kinetic]").forEach(title => gsap.fromTo(title, { y: 45, opacity: .45 }, { y: 0, opacity: 1, ease: "editorial-flow", scrollTrigger: { trigger: title, start: "top 95%", end: "top 55%", scrub: .8 } }));
        if (innerWidth > 700) gsap.utils.toArray<HTMLElement>("[data-sample-row]").forEach(row => gsap.fromTo(row, { rotationX: 62, y: 95 }, { rotationX: 0, y: 0, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "top 50%", scrub: 1 } }));
      }, node);
      const refresh = () => ScrollTrigger.refresh();
      node.addEventListener("toggle", refresh, true);
      const images = [...node.querySelectorAll("img")];images.forEach(img => img.addEventListener("load", refresh));
      const resize = () => { lenis.resize(); refresh(); }; window.addEventListener("resize", resize);
      refresh();
      return () => { ctx.revert(); lenis.destroy(); gsap.ticker.remove(tick); delete node.dataset.editorialAnimated; document.documentElement.style.scrollBehavior = previous; node.removeEventListener("toggle", refresh, true); images.forEach(img => img.removeEventListener("load", refresh)); window.removeEventListener("resize", resize); };
    });
    return () => media.revert();
  }, [paused]);
  useEffect(() => {
    const node = root.current;if (!node) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) node.dataset.editorialTheme = (entry.target as HTMLElement).dataset.editorialTheme; }), { rootMargin: "0px 0px -85% 0px" });
    node.querySelectorAll("section[data-editorial-theme],footer[data-editorial-theme]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const node=root.current;if(!node || paused || !matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches)return;
    const cursor=node.querySelector<HTMLElement>("[data-editorial-cursor]")!;
    const x=gsap.quickTo(cursor,"x",{duration:.45,ease:"power3.out"}), y=gsap.quickTo(cursor,"y",{duration:.45,ease:"power3.out"});
    const move=(event:MouseEvent)=>{x(event.clientX);y(event.clientY);const label=(event.target as Element).closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel;cursor.textContent=label||"";cursor.dataset.visible=label?"true":"false";};
    window.addEventListener("mousemove",move);return()=>{window.removeEventListener("mousemove",move);cursor.dataset.visible="false";};
  },[paused]);
  return <div ref={root} className={styles.page} data-editorial data-editorial-motion={paused ? "off" : "on"} data-editorial-theme="photo">
    {children}<div className={styles.cursor} data-editorial-cursor aria-hidden="true"/>
    {hydrated && <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Ativar movimento" : "Pausar movimento"}</button>}
  </div>;
}
