"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { SplitText } from "gsap/SplitText";
import styles from "@/app/editorial.module.css";
import { linePath, shapes, transformOf, type Pose } from "@/lib/gb-shapes";
const subscribe = () => () => {};

export function EditorialMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const initialAnchorHandled = useRef(false);
  // The brand dot's arrival scene plays once per visit, not again after pausing and resuming motion.
  const dotSceneDone = useRef(false);
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
        // SVG attributes written by hand are not reverted by GSAP; these put the static monogram back.
        const restore: (() => void)[] = [];
        // The reference separates typography, floating objects and unfolding galleries.
        // Keep each choreography reversible instead of applying one fade to every section.
        gsap.timeline({ scrollTrigger: { trigger: "#editorial-start", start: "top top", end: "bottom top", scrub: .65 } })
          // The face must stay clear: no zoom that crops the hair, and the name, sample and offer
          // drift down with the photo and fade before they can reach the face.
          .to("[data-hero-photo]", { yPercent: 12, scale: 1.02, ease: "none" }, 0)
          .to("[data-hero-wordmark]", { yPercent: 24, opacity: 0, ease: "power1.in", duration: .4 }, 0)
          .to("[data-hero-sample]", { rotation: 6, yPercent: 30, opacity: 0, ease: "power1.in", duration: .35 }, 0)
          .to("[data-hero-offer]", { yPercent: 40, opacity: 0, ease: "none", duration: .18 }, 0)
          .to({}, { duration: 1 }, 0);
        gsap.utils.toArray<HTMLElement>("[data-kinetic]").forEach(title => {
          const split = SplitText.create(title, { type: "words", wordsClass: "editorial-word", aria: title.querySelector("a") ? "none" : "auto" });
          splits.push(split);
          gsap.fromTo(split.words, { yPercent: 95, rotationX: -35, opacity: .12 }, {
            yPercent: 0, rotationX: 0, opacity: 1, stagger: .08, ease: "power2.out",
            scrollTrigger: { trigger: title, start: "top 90%", end: "bottom 55%", scrub: .65 },
          });
        });
        // Title: the two words of the name breathe in opposite directions (narrow ↔ wide), as in the reference.
        const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
        // The hero loops start paused: on arrival the brand dot plays its scene first, then they begin.
        const loops: { play: () => void }[] = [];
        if (words.length === 2) {
          gsap.set(words[0], { "--wdth": 100 }); gsap.set(words[1], { "--wdth": 76 });
          const breathe = gsap.timeline({ paused: true, repeat: -1, yoyo: true, repeatDelay: .7, defaults: { duration: 1.5, ease: "editorial-flow" } })
            .to(words[0], { "--wdth": 76 }, 0).to(words[1], { "--wdth": 100 }, 0);
          loops.push({ play: () => breathe.play() });
        }
        // Between the words: "g." assembles inside the peach card, holds, comes apart and starts again.
        const part = (id: string) => node.querySelector<SVGGElement>(`[data-card-part="${id}"]`);
        const [bowl, stem, hook, dot] = ["bowl", "stem", "hook", "dot"].map(part);
        const card = node.querySelector<HTMLElement>("[data-hero-card]");
        // Time inside the loop where the letter is assembled and holding (after the dot has landed).
        const assembledAt = 1.75;
        let cardLoop: gsap.core.Timeline | null = null;
        if (bowl && stem && hook && dot) {
          const pieces = [bowl, stem, hook, dot];
          gsap.set(pieces, { transformOrigin: "50% 50%" });
          cardLoop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .25 });
          cardLoop.fromTo(bowl, { y: -420, rotation: -90, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .7, ease: "back.out(1.4)" }, 0)
            .fromTo(stem, { x: 520, rotation: 25, opacity: 0 }, { x: 0, rotation: 0, opacity: 1, duration: .6, ease: "expo.out" }, .25)
            .fromTo(hook, { y: 380, rotation: 120, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: .7, ease: "back.out(1.6)" }, .5)
            .fromTo(dot, { y: -520, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: "bounce.out" }, .85)
            // Hold the assembled letter, then let it fall apart.
            .to(pieces, { y: 460, rotation: (index: number) => [-60, 30, 80, 0][index], opacity: 0, duration: .55, ease: "power2.in", stagger: .06 }, "+=1.6");
        }
        if (card && words.length === 2) {
          // The card leans with the breathing name.
          const tilt = gsap.timeline({ paused: true, repeat: -1, yoyo: true, repeatDelay: .7 }).fromTo(card, { rotation: -2 }, { rotation: 3, duration: 1.5, ease: "editorial-flow" });
          loops.push({ play: () => tilt.play() });
        }
        const startLoops = (fromAssembled: boolean) => {
          loops.forEach(loop => loop.play());
          if (cardLoop) { if (fromAssembled) cardLoop.play(assembledAt); else cardLoop.play(0); }
        };

        // The brand dot's scene, once per visit (not again after pausing and resuming): it falls onto the name,
        // hops across "Gabriel" with squash and stretch, leaves a red tittle on each "i", jumps over the card
        // and lands in it as the dot of "g.". Then the name starts breathing and the card starts its loop.
        const h1 = node.querySelector<HTMLElement>("[data-hero-wordmark]");
        const fly = node.querySelector<HTMLElement>("[data-hero-dot]");
        const tittles = gsap.utils.toArray<HTMLElement>("[data-tittle]");
        if (desktop && !dotSceneDone.current && h1 && fly && tittles.length === 2 && words.length === 2 && cardLoop && dot) {
          const box = h1.getBoundingClientRect();
          const centre = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top, w: r.width }; };
          const first = words[0].getBoundingClientRect();
          const tittleA = centre(tittles[0]), tittleB = centre(tittles[1]), cardDot = centre(dot);
          const r = tittleA.w / 2;
          const along = (share: number) => ({ x: first.left - box.left + first.width * share, y: tittleA.y });
          // The card shows its letter without the dot until the brand dot lands in it.
          cardLoop.seek(assembledAt).pause(); gsap.set(dot, { opacity: 0 });
          gsap.set(tittles, { scale: 0, transformOrigin: "50% 50%" });
          gsap.set(fly, { transformOrigin: "50% 100%" });
          const scene = gsap.timeline({ delay: .5, onComplete: () => { dotSceneDone.current = true; gsap.set(dot, { opacity: 1 }); gsap.set(fly, { opacity: 0 }); startLoops(true); } });
          let current = along(.06);
          const land = () => scene.to(fly, { scaleX: 1.5, scaleY: .55, duration: .07, ease: "power2.out" }).to(fly, { scaleX: 1, scaleY: 1, duration: .3, ease: "elastic.out(1,.4)" });
          const hop = (to: { x: number; y: number }, apex: number, duration: number) => {
            const peak = Math.min(current.y, to.y) - apex;
            scene.to(fly, { scaleX: 1.3, scaleY: .7, duration: .12, ease: "power2.out" }) // crouch before the jump
              .addLabel("air")
              .to(fly, { x: to.x - r, duration, ease: "none" }, "air")
              .to(fly, { y: peak - r, duration: duration / 2, ease: "power2.out" }, "air")
              .to(fly, { y: to.y - r, duration: duration / 2, ease: "power2.in" }, `air+=${duration / 2}`)
              .to(fly, { scaleX: .8, scaleY: 1.25, duration: duration * .3, ease: "power1.out" }, "air")
              .to(fly, { scaleX: 1, scaleY: 1, duration: duration * .3 }, `air+=${duration * .35}`);
            land();
            current = to;
          };
          const plant = (tittle: HTMLElement) => scene.to(tittle, { scale: 1, duration: .35, ease: "back.out(3)" }, "<");
          scene.fromTo(fly, { x: current.x - r, y: current.y - r - 460, opacity: 1 }, { y: current.y - r, duration: .55, ease: "power2.in" });
          land();
          hop(along(.36), 110, .42);
          hop({ x: tittleA.x, y: tittleA.y }, 90, .4);
          plant(tittles[0]);
          scene.to(fly, { x: `+=${r * .5}`, duration: .18, ease: "power1.inOut", yoyo: true, repeat: 1 }, "+=.15"); // a glance towards "Batista"
          hop({ x: tittleB.x, y: tittleB.y }, 230, .75);
          plant(tittles[1]);
          hop({ x: cardDot.x, y: cardDot.y }, 140, .55);
          scene.to(fly, { scale: cardDot.w / tittleA.w, duration: .16, ease: "power2.out" });
          restore.push(() => { gsap.set(tittles, { clearProps: "transform" }); gsap.set(dot, { clearProps: "opacity" }); });
        } else startLoops(false);
        // The monogram, taken apart: the shapes drift, one line threads them, then the scroll assembles "gb/".
        const field = node.querySelector<SVGSVGElement>("[data-gb-shapes] svg");
        const line = field?.querySelector<SVGPathElement>("[data-gb-line]");
        if (field && line) {
          const groups = shapes.map(shape => field.querySelector<SVGGElement>(`[data-gb-shape="${shape.id}"]`)!);
          const poses: Pose[] = shapes.map(shape => ({ ...shape.scatter }));
          const draw = { value: 0 };
          const render = () => {
            groups.forEach((group, i) => group.setAttribute("transform", transformOf(poses[i])));
            line.setAttribute("d", linePath(poses));
            line.style.strokeDashoffset = String(1 - draw.value);
          };
          // Drift while the field enters; the CSS track then holds it centred (sticky) while the monogram assembles.
          // No ScrollTrigger pin: pinning added and removed space whenever motion was paused and resumed.
          const fieldBox = node.querySelector<HTMLElement>("[data-gb-shapes]")!;
          const holdStart = () => `top ${(innerHeight - fieldBox.offsetHeight) / 2}px`;
          const holdEnd = () => `bottom ${(innerHeight + fieldBox.offsetHeight) / 2}px`;
          // One timeline for both phases (two timelines on the same values fought each other after the hold).
          // The drift share is the distance before the field sticks, over the whole distance to the end of the hold.
          const track = node.querySelector<HTMLElement>("[data-gb-track]")!;
          const enter = (innerHeight + fieldBox.offsetHeight) / 2;
          const total = track.offsetHeight + (innerHeight - fieldBox.offsetHeight) / 2;
          const split = Math.min(.8, Math.max(.2, enter / total));
          // lazy:false: the values must be applied before onUpdate redraws the SVG, or a jump renders stale poses.
          const motion = gsap.timeline({ defaults: { ease: "none", lazy: false }, onUpdate: render, scrollTrigger: { trigger: track, start: "top bottom", end: holdEnd, scrub: .8, invalidateOnRefresh: true, onRefresh: render } });
          shapes.forEach((shape, i) => {
            motion.fromTo(poses[i], { ...shape.scatter }, { ...shape.drift, duration: split }, 0)
              .to(poses[i], { ...shape.final, duration: (1 - split) * .8, ease: "power2.inOut" }, split + i * .012);
          });
          motion.fromTo(draw, { value: 0 }, { value: .75, duration: split }, 0)
            .to(draw, { value: 1, duration: (1 - split) * .5 }, split)
            .to({}, { duration: .001 }, .999);
          void holdStart;
          render();
          restore.push(() => { groups.forEach((group, i) => group.setAttribute("transform", transformOf(shapes[i].final))); line.setAttribute("d", linePath(shapes.map(shape => shape.final))); line.style.strokeDashoffset = ""; });
        }
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
          const center = (cards.length - 1) / 2;
          cards.forEach((card, index) => {
            // Normalised so the outer cards always fold as far as the outer cards of the original five-card rows.
            const distance = (index - center) * (2 / Math.max(center, 1));
            fold.fromTo(card, { xPercent: distance * -24, yPercent: Math.abs(distance) * 20, rotationY: distance * -14, rotationZ: distance * 7, scale: .82 },
              { xPercent: 0, yPercent: 0, rotationY: 0, rotationZ: 0, scale: 1, ease: "power2.out", duration: .85 }, .08 * Math.abs(distance));
          });
        });
        gsap.fromTo("[data-folder]", { rotation: -12, y: 90, scale: .72 }, { rotation: 0, y: 0, scale: 1, ease: "back.out(1.4)", scrollTrigger: { trigger: "#editorial-work", start: "top 90%", end: "center 60%", scrub: .8 } });
        gsap.to("[data-about-photo]", { scale: 1.14, yPercent: 7, ease: "none", scrollTrigger: { trigger: "#editorial-about", start: "top bottom", end: "bottom top", scrub: .8 } });
        gsap.fromTo("[data-contact-panel]", { scale: .9, borderRadius: 100 }, { scale: 1, borderRadius: 40, ease: "none", scrollTrigger: { trigger: "#editorial-contact", start: "top 95%", end: "center 65%", scrub: .65 } });
        // SplitText owns generated word wrappers and restores accessible original markup.
        return () => { splits.forEach(split => split.revert()); restore.forEach(fn => fn()); };
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
    // The theme follows whichever section is under the logo right now, so reversing near a boundary cannot leave it stale.
    const sections = [...node.querySelectorAll<HTMLElement>("section[data-editorial-theme],footer[data-editorial-theme]")];
    const logo = node.querySelector<HTMLElement>("[data-editorial-nav] a");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!logo) return;
      const box = logo.getBoundingClientRect();
      const line = box.top + box.height / 2;
      const current = sections.find(section => { const rect = section.getBoundingClientRect(); return rect.top <= line && rect.bottom > line; });
      if (!current?.dataset.editorialTheme) return;
      node.dataset.editorialTheme = current.dataset.editorialTheme;
      node.dataset.editorialNavOver = current.id;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    node.addEventListener("toggle", schedule, true);
    return () => { if (frame) cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); node.removeEventListener("toggle", schedule, true); };
  }, []);
  useEffect(() => {
    const node=root.current;if(!node || paused || !matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)").matches)return;
    const cursor=node.querySelector<HTMLElement>("[data-editorial-cursor]")!;
    const x=gsap.quickTo(cursor,"x",{duration:.45,ease:"power3.out"}), y=gsap.quickTo(cursor,"y",{duration:.45,ease:"power3.out"});
    const move=(event:MouseEvent)=>{x(event.clientX);y(event.clientY);const label=(event.target as Element).closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel;cursor.textContent=label||"";cursor.dataset.visible=label?"true":"false";};
    window.addEventListener("mousemove",move);return()=>{window.removeEventListener("mousemove",move);cursor.dataset.visible="false";};
  },[paused]);
  return <div ref={root} className={`${styles.page} ${className}`} data-editorial data-editorial-motion={paused ? "off" : "on"} data-editorial-theme="photo" data-editorial-nav-over="editorial-start">
    {children}<div className={styles.frameGlow} aria-hidden="true"/><div className={styles.cursor} data-editorial-cursor aria-hidden="true"/>
    {hydrated && <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}><span className={styles.motionLabel}>{paused ? "Ativar movimento" : "Pausar movimento"}</span></button>}
  </div>;
}
