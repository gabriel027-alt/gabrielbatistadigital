"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import styles from "@/app/editorial.module.css";
import { linePath, pathThrough, shapes, transformOf, type Pose } from "@/lib/gb-shapes";
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
    gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, MotionPathPlugin);
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

        // The brand dot's scene, once per visit (not again after pausing and resuming): born as the tittle of
        // "Design", it soaks that phrase in red ink, drips like rain onto the "i" of "Gabriel", hops with squash and
        // stretch to the "i" of "Batista" and lands in the card as the dot of "g.". Then the loops begin.
        const h1 = node.querySelector<HTMLElement>("[data-hero-wordmark]");
        const fly = node.querySelector<HTMLElement>("[data-hero-dot]");
        const tittles = gsap.utils.toArray<HTMLElement>("[data-tittle]");
        if (!dotSceneDone.current && h1 && fly && tittles.length === 2 && words.length === 2 && cardLoop && dot) {
          // Jump heights follow the letter size, so the same scene works on the phone's two-line name.
          const em = parseFloat(getComputedStyle(h1).fontSize);
          const box = h1.getBoundingClientRect();
          const centre = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top, w: r.width }; };
          const first = words[0].getBoundingClientRect();
          const tittleA = centre(tittles[0]), tittleB = centre(tittles[1]), cardDot = centre(dot);
          const r = tittleA.w / 2;
          void first;
          // The card shows its letter without the dot until the brand dot lands in it.
          cardLoop.seek(assembledAt).pause(); gsap.set(dot, { opacity: 0 });
          gsap.set(tittles, { scale: 0, transformOrigin: "50% 50%" });
          gsap.set(fly, { transformOrigin: "50% 100%" });
          // Marked as played when it starts: pausing mid-scene and resuming shows the final state instead of replaying.
          dotSceneDone.current = true;
          const scene = gsap.timeline({ delay: .45, onComplete: () => startLoops(true) });
          let current = { x: tittleA.x, y: tittleA.y };
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
          // 1. Born as the tittle of "Design": the red ink spreads from it and soaks the phrase like a frame.
          const offer = node.querySelector<HTMLElement>("[data-hero-offer]");
          const ink = node.querySelector<HTMLElement>("[data-offer-ink]");
          const origin = node.querySelector<HTMLElement>("[data-offer-tittle]");
          if (offer && ink && origin) {
            const inkBox = ink.getBoundingClientRect(), dotBox = origin.getBoundingClientRect();
            const cx = dotBox.left + dotBox.width / 2 - inkBox.left, cy = dotBox.top + dotBox.height / 2 - inkBox.top;
            const cover = Math.hypot(Math.max(cx, inkBox.width - cx), Math.max(cy, inkBox.height - cy));
            const start = centre(origin);
            const below = { x: start.x, y: inkBox.bottom - box.top + r * 1.2 }; // the drop hangs under the frame
            const tiny = dotBox.width / tittleA.w;
            const offerColour = getComputedStyle(offer).color;
            gsap.set(ink, { clipPath: `circle(0px at ${cx}px ${cy}px)` });
            scene.fromTo(ink, { clipPath: `circle(0px at ${cx}px ${cy}px)` }, { clipPath: `circle(${cover}px at ${cx}px ${cy}px)`, duration: .75, ease: "power2.out" })
              .to(offer, { color: "#faf6ef", duration: .3 }, "<+=.15")
              // Hold the soaked frame, then the ink drains down into a drop under the "i".
              .to(ink, { clipPath: `circle(0px at ${cx}px ${inkBox.height}px)`, duration: .6, ease: "power2.in" }, "+=.3")
              .to(offer, { color: offerColour, duration: .3 }, "<+=.25")
              .fromTo(fly, { x: start.x - r, y: start.y - r, scale: tiny, opacity: 1 }, { x: below.x - r, y: below.y - r, scaleX: .85, scaleY: 1.25, duration: .6, ease: "power2.in" }, "<")
              // 2. The drop falls like rain onto the "i" of "Gabriel" and splashes into its tittle.
              .to(fly, { x: tittleA.x - r, duration: .55, ease: "none" })
              .to(fly, { y: tittleA.y - r, scaleX: .7, scaleY: 1.6, duration: .55, ease: "power3.in" }, "<");
            land();
            plant(tittles[0]);
            restore.push(() => { gsap.set(ink, { clearProps: "clipPath" }); gsap.set(offer, { clearProps: "color" }); });
          } else {
            scene.fromTo(fly, { x: current.x - r, y: current.y - r - em * 3, opacity: 1 }, { y: current.y - r, duration: .55, ease: "power2.in" });
            land();
            plant(tittles[0]);
          }
          // 3. A glance towards "Batista", a low arc over the card (not up to the neck), then into the card.
          scene.to(fly, { x: `+=${r * .5}`, duration: .18, ease: "power1.inOut", yoyo: true, repeat: 1 }, "+=.15");
          // On phones the name sits just under the chin: flatter arcs keep the dot off the neck.
          const arc = innerWidth <= 700 ? .35 : 1;
          hop({ x: tittleB.x, y: tittleB.y }, em * .55 * arc, .7);
          plant(tittles[1]);
          // 4. The finale: rise a little (to the card's top, never up to the neck), charge with pulsing glow, then dive
          //    in one lap around the card leaving a comet trail (the peach line of the "g." scene) and land with a wave.
          const scaleIn = cardDot.w / tittleA.w;
          const trail = node.querySelector<SVGPathElement>("[data-hero-trail]");
          const glow = node.querySelector<HTMLElement>("[data-hero-glow]");
          const wave = node.querySelector<HTMLElement>("[data-hero-wave]");
          const cardBox = card?.getBoundingClientRect();
          if (trail && glow && wave && card && cardBox) {
            const c = { x: cardBox.left + cardBox.width / 2 - box.left, y: cardBox.top + cardBox.height / 2 - box.top };
            const m = em * (arc < 1 ? .08 : .2), hw = cardBox.width / 2 + m, hh = cardBox.height / 2 + m;
            // On phones the card sits above "Batista", right under the chin: rise only a little above the "i".
            const lift = arc < 1 ? { x: current.x, y: current.y - em * .3 } : { x: current.x, y: Math.min(current.y, c.y - hh) - em * .15 };
            // The lap: from the lift point down the far side, under the card, up the near side, over the top, then in.
            const side = lift.x > c.x ? 1 : -1;
            const lap = [lift, { x: c.x + side * hw, y: c.y }, { x: c.x, y: c.y + hh }, { x: c.x - side * hw, y: c.y }, { x: c.x, y: c.y - cardBox.height * .3 }, { x: cardDot.x, y: cardDot.y }];
            trail.setAttribute("d", pathThrough(lap));
            const flyPath = pathThrough(lap.map(point => ({ x: point.x - r, y: point.y - r })));
            const ring = (el: HTMLElement, at: { x: number; y: number }) => gsap.set(el, { x: at.x - r, y: at.y - r, transformOrigin: "50% 50%" });
            ring(glow, lift);
            const trace = { head: 0 };
            const segment = .32;
            const drawTrail = () => { trail.style.strokeDashoffset = String(segment - trace.head); };
            scene.set(fly, { transformOrigin: "50% 50%" })
              .to(fly, { y: lift.y - r, scaleX: .85, scaleY: 1.2, duration: .35, ease: "power2.out" })
              // Charging: the dot clenches and swells faster each time while a red glow pulses out of it.
              .addLabel("charge")
              .to(fly, { keyframes: [{ scale: .75, duration: .14 }, { scale: 1.2, duration: .14 }, { scale: .72, duration: .11 }, { scale: 1.25, duration: .11 }, { scale: .7, duration: .08 }, { scale: 1.3, duration: .08 }], ease: "sine.inOut" }, "charge")
              .to(fly, { x: `+=${r * .12}`, duration: .04, repeat: 9, yoyo: true, ease: "none" }, "charge+=.2")
              .fromTo(glow, { scale: .6, opacity: .9 }, { scale: 2.6, opacity: 0, duration: .32, ease: "power1.out", repeat: 2 }, "charge")
              // The dive: one continuous lap, the trail's head follows the dot and its tail fades behind it.
              .addLabel("dive")
              .to(fly, { motionPath: { path: flyPath, autoRotate: false }, duration: .95, ease: "power2.in" }, "dive")
              .fromTo(trace, { head: 0 }, { head: 1, duration: .95, ease: "power2.in", onUpdate: drawTrail }, "dive")
              .to(fly, { scaleX: 1.35, scaleY: .75, duration: .3 }, "dive")
              .to(fly, { scale: scaleIn, duration: .25, ease: "power2.in" }, "dive+=.7")
              // Impact: the card's own dot appears, the card takes the hit, a shock wave and the trail drains away.
              .addLabel("impact")
              .to(dot, { opacity: 1, duration: .06 }, "impact")
              .to(fly, { opacity: 0, duration: .06 }, "impact")
              .call(() => ring(wave, cardDot), undefined, "impact")
              .fromTo(wave, { scale: .4, opacity: .9 }, { scale: 3.4, opacity: 0, duration: .55, ease: "power2.out" }, "impact")
              .fromTo(card, { scale: 1.09 }, { scale: 1, duration: .6, ease: "elastic.out(1,.45)" }, "impact")
              .to(trace, { head: 1 + segment + .05, duration: .35, ease: "power1.out", onUpdate: drawTrail }, "impact")
              // A round cap could linger at the path's end: hide the trail once it has drained.
              .set(trail, { opacity: 0 });
            restore.push(() => { trail.removeAttribute("d"); trail.style.strokeDashoffset = ""; gsap.set(trail, { clearProps: "opacity" }); gsap.set([glow, wave, card], { clearProps: "transform,opacity" }); });
          } else {
            scene.to(fly, { x: cardDot.x - r, y: cardDot.y - r, scale: scaleIn, duration: .5, ease: "power2.inOut" })
              .to(dot, { opacity: 1, duration: .14 }).to(fly, { opacity: 0, duration: .14 }, "<");
          }
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
