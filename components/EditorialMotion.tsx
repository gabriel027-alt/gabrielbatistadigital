"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { SplitText } from "gsap/SplitText";
import styles from "@/app/propostas/portfolio-editorial/editorial.module.css";
const subscribe = () => () => {};

export function EditorialMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const initialAnchorHandled = useRef(false);
  const [paused, setPaused] = useState(false);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  useEffect(() => {
    const node = root.current;
    if (!node || paused) return;
    gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText);
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
        const desktop = innerWidth > 700;
        const splits: SplitText[] = [];
        // The reference separates typography, floating objects and unfolding galleries.
        // Keep each choreography reversible instead of applying one fade to every section.
        gsap.timeline({ scrollTrigger: { trigger: "#editorial-start", start: "top top", end: "bottom top", scrub: .65 } })
          .to("[data-hero-photo]", { yPercent: 22, scale: 1.13, ease: "none" }, 0)
          .to("[data-hero-wordmark]", { yPercent: -34, scale: .91, transformOrigin: "center bottom", ease: "none" }, 0)
          .to("[data-hero-sample]", { rotation: 12, yPercent: -45, ease: "none" }, 0);
        gsap.utils.toArray<HTMLElement>("[data-kinetic]").forEach(title => {
          const split = SplitText.create(title, { type: "words", wordsClass: "editorial-word", aria: title.querySelector("a") ? "none" : "auto" });
          splits.push(split);
          gsap.fromTo(split.words, { yPercent: 95, rotationX: -35, opacity: .12 }, {
            yPercent: 0, rotationX: 0, opacity: 1, stagger: .08, ease: "power2.out",
            scrollTrigger: { trigger: title, start: "top 90%", end: "bottom 55%", scrub: .65 },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-shape]").forEach((shape, index) => {
          gsap.fromTo(shape, { y: 150, rotation: index % 2 ? -32 : 22, scale: .85 }, {
            y: Number(shape.dataset.shape) * 1.6, rotation: index % 2 ? 30 : -25, scale: 1.08, ease: "none",
            scrollTrigger: { trigger: "[data-hook]", start: "top bottom", end: "bottom top", scrub: .8 },
          });
        });
        if (desktop) gsap.utils.toArray<HTMLElement>("[data-sample-row]").forEach(row => {
          const cards = [...row.children];
          const fold = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 96%", end: "bottom 30%", scrub: .65 } });
          fold.fromTo(row, { rotationX: 65, y: 120 }, { rotationX: 0, y: 0, duration: 1, ease: "power2.out" }, 0);
          cards.forEach((card, index) => {
            const distance = index - 2;
            fold.fromTo(card, { xPercent: distance * -24, yPercent: Math.abs(distance) * 20, rotationY: distance * -14, rotationZ: distance * 7, scale: .82 },
              { xPercent: 0, yPercent: 0, rotationY: 0, rotationZ: 0, scale: 1, ease: "power2.out", duration: .85 }, .08 * Math.abs(distance));
          });
        });
        gsap.fromTo("[data-folder]", { rotation: -12, y: 90, scale: .72 }, { rotation: 0, y: 0, scale: 1, ease: "back.out(1.4)", scrollTrigger: { trigger: "#editorial-work", start: "top 90%", end: "center 60%", scrub: .8 } });
        gsap.to("[data-about-photo]", { scale: 1.14, yPercent: 7, ease: "none", scrollTrigger: { trigger: "#editorial-about", start: "top bottom", end: "bottom top", scrub: .8 } });
        gsap.fromTo("[data-contact-panel]", { scale: .9, borderRadius: 100 }, { scale: 1, borderRadius: 40, ease: "none", scrollTrigger: { trigger: "#editorial-contact", start: "top 95%", end: "center 65%", scrub: .65 } });
        // SplitText owns generated word wrappers and restores accessible original markup.
        return () => splits.forEach(split => split.revert());
      }, node);
      const refresh = () => ScrollTrigger.refresh();
      node.addEventListener("toggle", refresh, true);
      const images = [...node.querySelectorAll("img")];images.forEach(img => img.addEventListener("load", refresh));
      const resize = () => { lenis.resize(); refresh(); }; window.addEventListener("resize", resize);
      refresh();
      let active = true;
      if (!initialAnchorHandled.current) {
        let id = "";
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { /* Invalid fragment stays at the current position. */ }
        const target = id ? document.getElementById(id) : null;
        if (target && node.contains(target)) void document.fonts.ready.then(() => {
          if (!active) return;
          initialAnchorHandled.current = true;
          refresh(); lenis.resize();
          lenis.scrollTo(target, { immediate: true, force: true });
        });
        else initialAnchorHandled.current = true;
      }
      return () => { active = false; ctx.revert(); lenis.destroy(); gsap.ticker.remove(tick); delete node.dataset.editorialAnimated; document.documentElement.style.scrollBehavior = previous; node.removeEventListener("toggle", refresh, true); images.forEach(img => img.removeEventListener("load", refresh)); window.removeEventListener("resize", resize); };
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
    {children}<div className={styles.frameGlow} aria-hidden="true"/><div className={styles.cursor} data-editorial-cursor aria-hidden="true"/>
    {hydrated && <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Ativar movimento" : "Pausar movimento"}</button>}
  </div>;
}
