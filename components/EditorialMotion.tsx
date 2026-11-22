"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import styles from "@/app/editorial.module.css";
import { lineEnds, linePath, onLine, pathThrough, shapes, transformOf, type Pose } from "@/lib/gb-shapes";
const subscribe = () => () => {};

export function EditorialMotion({ children, className = "", labels = { pause: "Pausar movimento", resume: "Ativar movimento" } }: { children: ReactNode; className?: string; labels?: { pause: string; resume: string } }) {
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
        const splits: SplitText[] = [];
        // SVG attributes written by hand are not reverted by GSAP; these put the static monogram back.
        const restore: (() => void)[] = [];
        // The reference separates typography, floating objects and unfolding galleries.
        // Keep each choreography reversible instead of applying one fade to every section.
        gsap.timeline({ scrollTrigger: { trigger: "#editorial-start", start: "top top", end: "bottom top", scrub: .65 } })
          // The face must stay clear: no zoom that crops the hair, and the name, sample and offer
          // drift down with the photo and fade before they can reach the face.
          // Direction A: the portrait recedes and darkens under the rising paper sheet; the red frame goes out with it.
          .to("[data-hero-photo]", { yPercent: 14, scale: .97, opacity: .35, ease: "none" }, 0)
          .fromTo(node, { "--hero-glow": 1 }, { "--hero-glow": 0, ease: "none", duration: .5 }, 0)
          .to("[data-hero-pitch]", { yPercent: 18, opacity: 0, ease: "power1.in", duration: .3 }, 0)
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
          // The red tittles sit outside the split words: they appear with the end of the reveal, not before their letters.
          const titleDots = title.querySelectorAll("[data-hook-tittle]");
          if (titleDots.length) gsap.fromTo(titleDots, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, ease: "back.out(2)", scrollTrigger: { trigger: title, start: "top 80%", end: "bottom 58%", scrub: .65 } });
        });
        // The brand dot never appears from nowhere: between scenes a carrier dot travels, on a low arc, from the dot it
        // leaves to the dot it becomes, both read live from the page. The two ends hide while it is on its way.
        const carry = (from: () => Element | null, to: () => Element | null, start: () => number, end: () => number, onLand?: (landed: boolean) => void) => {
          const carrier = document.createElement("span");
          carrier.className = styles.carrier; node.append(carrier);
          const place = (progress: number) => {
            const a = from(), b = to();
            if (!a || !b) return;
            const flying = progress > .001 && progress < .999;
            (a as HTMLElement).style.visibility = progress >= .999 ? "hidden" : flying ? "hidden" : "";
            (b as HTMLElement).style.visibility = progress >= .999 ? "" : "hidden";
            carrier.style.visibility = flying ? "visible" : "hidden";
            onLand?.(progress >= .999);
            if (!flying) return;
            const p = .5 - Math.cos(Math.PI * progress) / 2;
            const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
            const size = ra.width + (rb.width - ra.width) * p;
            const x = ra.left + ra.width / 2 + (rb.left + rb.width / 2 - ra.left - ra.width / 2) * p;
            const y = ra.top + ra.height / 2 + (rb.top + rb.height / 2 - ra.top - ra.height / 2) * p - Math.sin(Math.PI * progress) * innerHeight * .08;
            carrier.style.width = carrier.style.height = `${size}px`;
            carrier.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
          };
          ScrollTrigger.create({ start, end, invalidateOnRefresh: true, onUpdate: self => place(self.progress), onRefresh: self => place(self.progress) });
          restore.push(() => { carrier.remove(); [from(), to()].forEach(el => el && ((el as HTMLElement).style.visibility = "")); });
        };
        const trackRange = (el: HTMLElement, at: number) => el.getBoundingClientRect().top + scrollY + (el.offsetHeight - innerHeight) * at;
        // The palm scene starts while its stage is still entering (top at 70% of the screen), so the hand rises as the
        // phrase leaves, with no empty screen between them. Scroll position of a given progress of that scene:
        const sceneAt = (el: HTMLElement, at: number) => { const top = el.getBoundingClientRect().top + scrollY, start = top - innerHeight * .7, end = top + el.offsetHeight - innerHeight; return start + (end - start) * at; };
        // "O próximo clique", one stage and one timeline: Gabriel's open hand rises from the bottom; the red tittle of
        // "clique" lands in its palm; the dot rises above the hand and bursts, and the pieces of "g." come out of that
        // spark with the peach line, drift, then assemble above the palm. The copy closes the scene. Reversible.
        const creation = node.querySelector<HTMLElement>("[data-creation-track]");
        const field = creation?.querySelector<SVGSVGElement>("[data-gb-shapes] svg");
        const line = field?.querySelector<SVGPathElement>("[data-gb-line]");
        if (creation && field && line) {
          const stage = creation.querySelector<HTMLElement>("[data-fusion-stage]")!, palm = creation.querySelector<HTMLElement>("[data-palm]")!;
          const box = field.parentElement as HTMLElement, copy = creation.querySelector<HTMLElement>("[data-palm-copy]")!;
          const body = creation.querySelector<HTMLElement>("[data-palm-body]")!, gShadow = creation.querySelector<HTMLElement>("[data-g-shadow]")!;
          const dot = creation.querySelector<HTMLElement>("[data-creation-dot]")!, ring = creation.querySelector("[data-creation-ring]");
          const groups = shapes.map(shape => field.querySelector<SVGGElement>(`[data-gb-shape="${shape.id}"]`)!);
          const dotIndex = shapes.findIndex(shape => shape.id === "dot");
          // The assembled "g." spans x 570–890 and y 350–775 of the view box. It floats just above the palm, to the right
          // of the thumb (which ends 57% across the photo), below the navigation or the copy when the copy sits on top
          // (phones), and inside the screen. Layout values only, no transforms.
          // Measured with the frame that ends around the letter (440 × 520), so the frame clears the thumb too.
          const G = { x: 729, y: 562, h: 520, w: 440 };
          const birth = { x: G.x, y: G.y - 40 }, rise = { x: 0, y: 0 }, size = { ratio: 1 };
          const measure = () => {
            const H = stage.clientHeight, Wst = stage.clientWidth;
            const palmY = palm.offsetTop + palm.offsetHeight * .43;
            const copyAbove = copy.offsetTop + copy.offsetHeight < palm.offsetTop;
            const top = copyAbove ? copy.offsetTop + copy.offsetHeight + 20 : Math.min(84, H * .12);
            // Phones (copy on top) have height to spare: the "g." floats above the thumb tip, centred on the palm.
            // Computers: just above the palm, to the right of the thumb.
            const bottom = copyAbove ? palm.offsetTop + palm.offsetHeight * .06 - 16 : palm.offsetTop + palm.offsetHeight * .3;
            const gh = Math.max(110, Math.min(bottom - top, H * (copyAbove ? .3 : .4), Wst * (copyAbove ? .42 : .5) * G.h / G.w));
            const gw = gh * G.w / G.h, F = gh / (G.h / 1000), W = F * 1.44;
            // Computers: over the cup of the palm, between the fingers and the thumb (which starts about 48% across),
            // as if held, nearer the middle of the screen than beside the thumb.
            const thumbLeft = palm.offsetLeft + palm.offsetWidth * .48;
            const anchor = copyAbove ? palm.offsetLeft + palm.offsetWidth * .56 : Math.min(palm.offsetLeft + palm.offsetWidth * .37, thumbLeft - gw / 2 - 12);
            const cx = Math.min(Math.max(anchor, gw / 2 + 16), Wst - gw / 2 - 28), cy = bottom - gh / 2;
            Object.assign(box.style, { width: `${W}px`, height: `${F}px`, left: `${cx - W * G.x / 1440}px`, top: `${cy - F * G.y / 1000}px` });
            // The soft shadow the floating "g." casts on the hand, just under it.
            Object.assign(gShadow.style, { width: `${gw * .95}px`, height: `${gw * .2}px`, left: `${cx - gw * .475}px`, top: `${palmY - gw * .1}px` });
            // The palm dot rises to the spark point (the birth of the pieces) and grows to the size of the field's dot.
            const dotX = palm.offsetLeft + body.offsetLeft + dot.offsetLeft + dot.offsetWidth / 2, dotY = palm.offsetTop + body.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
            rise.x = cx - dotX + (birth.x - G.x) * F / 1000; rise.y = cy - dotY + (birth.y - G.y) * F / 1000;
            size.ratio = 52 * F / 1000 / Math.max(1, dot.offsetWidth);
          };
          measure();
          ScrollTrigger.addEventListener("refreshInit", measure);
          const poses: Pose[] = shapes.map((shape, i) => ({ x: birth.x, y: birth.y, r: shape.scatter.r - 60, s: i === dotIndex ? 1 : .02 }));
          const ends = { start: { ...birth }, end: { ...birth } };
          const draw = { value: 0 }, spark = { value: 0 };
          const render = () => {
            groups.forEach((group, i) => group.setAttribute("transform", transformOf(poses[i])));
            groups[dotIndex].style.opacity = String(spark.value);
            line.setAttribute("d", pathThrough([ends.start, ...poses.filter((_, i) => onLine(shapes[i].id)), ends.end]));
            line.style.strokeDashoffset = String(1 - draw.value);
          };
          // The scatter and drift poses of the old full-screen field are scaled around the spark so they stay near the hand.
          const near = (pose: Pose, k: number): Pose => ({ ...pose, x: birth.x + (pose.x - birth.x) * k, y: birth.y + (pose.y - birth.y) * k });
          const motion = gsap.timeline({ defaults: { ease: "none", lazy: false }, onUpdate: render, scrollTrigger: { trigger: creation, start: "top 70%", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true, onRefresh: render } });
          const shadow = creation.querySelector("[data-palm-shadow]"), glow = creation.querySelector("[data-palm-glow]");
          // 1. The hand rises and opens; the carrier (below) brings the dot into the palm by .2.
          motion.fromTo(palm, { yPercent: 70, rotation: 7, opacity: .4 }, { yPercent: 0, rotation: 0, opacity: 1, ease: "power2.out", duration: .2 }, 0)
            .fromTo(dot, { x: 0, y: 0, scale: 1, opacity: 1 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: .001 }, 0)
            .fromTo(shadow, { opacity: 0, scale: .5 }, { opacity: 1, scale: 1, duration: .02 }, .19)
            .fromTo(glow, { opacity: 0 }, { opacity: 0, duration: .001 }, 0)
            .fromTo(gShadow, { opacity: 0, scale: .5 }, { opacity: 0, scale: .5, duration: .001 }, 0)
          // 2. The landing: the hand gives a little under the weight, the dot pulses and lights the palm red.
            .to(palm, { yPercent: 2, duration: .03, ease: "power1.out" }, .2).to(palm, { yPercent: 0, duration: .04, ease: "power1.inOut" }, .23)
            .to(dot, { keyframes: [{ scale: 1.35, duration: .02 }, { scale: 1, duration: .03 }] }, .21)
            .fromTo(ring, { scale: 1, opacity: .9 }, { scale: 6, opacity: 0, ease: "power2.out", duration: .08, immediateRender: false }, .21)
            .to(glow, { keyframes: [{ opacity: 1, duration: .02 }, { opacity: .55, duration: .06 }] }, .21)
            .to(shadow, { opacity: 0, scale: .4, duration: .05 }, .29)
            .to(glow, { opacity: .25, duration: .08 }, .3)
          // 3. The dot rises out of the palm to the spark point and grows to the size of the dot of "g.".
            .to(dot, { x: () => rise.x, y: () => rise.y, scale: () => size.ratio, ease: "power2.inOut", duration: .1 }, .29)
          // 4. The spark: the dot hands over to the dot of "g." and the other pieces burst out of it.
            .to(dot, { opacity: 0, duration: .02 }, .4)
            .fromTo(spark, { value: 0 }, { value: 1, duration: .02 }, .4)
            .to(glow, { keyframes: [{ opacity: .8, duration: .02 }, { opacity: 0, duration: .12 }] }, .4)
            .to(gShadow, { opacity: 1, scale: 1, duration: .14, ease: "power2.out" }, .76)
            .fromTo(ring, { x: () => rise.x, y: () => rise.y, scale: () => size.ratio, opacity: .9 }, { x: () => rise.x, y: () => rise.y, scale: () => size.ratio * 9, opacity: 0, ease: "power2.out", duration: .1, immediateRender: false }, .4);
          shapes.forEach((shape, i) => {
            motion.fromTo(poses[i], { x: birth.x, y: birth.y, r: shape.scatter.r - 60, s: i === dotIndex ? 1 : .02 }, { ...near(shape.scatter, .55), ease: "power3.out", duration: .16 }, .41)
              .to(poses[i], { ...near(shape.drift, .5), duration: .18, ease: "sine.inOut" }, .57)
              // The frame closes around the letter just after the pieces meet.
              .to(poses[i], { ...shape.final, duration: shape.id === "frame" ? .14 : .16, ease: "power2.inOut" }, shape.id === "frame" ? .78 : .74 + i * .006);
          });
          motion.fromTo(ends.start, { ...birth }, { ...lineEnds.start, ease: "power3.out", duration: .16 }, .41)
            .fromTo(ends.end, { ...birth }, { ...lineEnds.end, ease: "power3.out", duration: .16 }, .41)
            .fromTo(draw, { value: 0 }, { value: .5, duration: .16 }, .41)
            .to(draw, { value: .8, duration: .18 }, .57)
            .to(draw, { value: 1, duration: .14 }, .76)
          // 5. The copy.
            .fromTo(copy, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: .08, ease: "power2.out" }, .88)
            .to({}, { duration: .001 }, .999);
          render();
          // The hand is alive: a slow breath (removed on 21/11/2026, back on 22/11/2026 by the user's choice; the pause
          // button stops it), and on a computer it leans a little toward the pointer.
          gsap.to(body, { y: -5, rotation: .6, transformOrigin: "80% 100%", duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
          const lean = gsap.quickTo(body, "x", { duration: 1.2, ease: "power3.out" });
          const follow = (event: MouseEvent) => lean((event.clientX / innerWidth - .5) * 18);
          if (matchMedia("(pointer: fine)").matches) addEventListener("mousemove", follow);
          restore.push(() => {
            removeEventListener("mousemove", follow);
            ScrollTrigger.removeEventListener("refreshInit", measure);
            box.removeAttribute("style"); gShadow.removeAttribute("style");
            groups.forEach((group, i) => { group.setAttribute("transform", transformOf(shapes[i].final)); group.style.opacity = ""; });
            line.setAttribute("d", linePath(shapes.filter(shape => onLine(shape.id)).map(shape => shape.final))); line.style.strokeDashoffset = "";
          });
          // The tittle of "clique" detaches as the phrase leaves and lands in the palm as the hand settles.
          carry(() => node.querySelector("[data-hook-tittle=carry]"), () => dot,
            () => { const t = node.querySelector("[data-hook-tittle=carry]")!; return t.getBoundingClientRect().top + scrollY - innerHeight * .3; },
            () => sceneAt(creation, .2));
          // The dot of the finished "g." drops onto the folder's tab.
          const work = node.querySelector<HTMLElement>("[data-work-track]");
          if (work) {
            // The folder is no longer pinned (21/11/2026): the dot lands on its tab as the section enters.
            const landAt = () => work.getBoundingClientRect().top + scrollY - innerHeight * .64;
            carry(() => groups[dotIndex], () => node.querySelector("[data-pasta-dot]"), () => sceneAt(creation, .97), landAt);
            // After the projects, the dot reads with the visitor on its way to the conversation: it runs along the top
            // rule of the services (down their left edge on phones), drawing it peach and underlining each title as it
            // passes; then it underlines "Quem desenha é quem programa." and becomes the full stop of "Vamos conversar",
            // which stays lit. One dot all the way: a single trigger decides where it rests or flies.
            const panel = node.querySelector<HTMLElement>("[data-contact-panel]"), stop = node.querySelector<HTMLElement>("[data-contact-dot]");
            // The lists are the site services and then "Depois do site"; the dot reads one rule after the other.
            const lists = [...node.querySelectorAll<HTMLElement>("[data-read-list]")], about = node.querySelector<HTMLElement>("[data-read-about]");
            const pasta = node.querySelector<HTMLElement>("[data-pasta-dot]");
            const listDots = lists.map(list => list.querySelector<HTMLElement>("[data-read-dot]")), aboutDot = about?.querySelector<HTMLElement>("[data-read-dot]");
            if (panel && stop && lists.length && about && pasta && listDots.every(Boolean) && aboutDot) {
              const top = (el: HTMLElement) => el.getBoundingClientRect().top + scrollY;
              // Read from when the first rule is near the bottom of the screen until its list is still well in view, so
              // the dot never waits under the navigation; each next rule starts right after a short hop down.
              const readStart: (() => number)[] = [], readEnd: (() => number)[] = [];
              lists.forEach((list, k) => {
                readStart[k] = k === 0 ? () => top(list) - innerHeight * .85 : () => readEnd[k - 1]() + 90;
                readEnd[k] = () => Math.max(readStart[k]() + 150, top(list) + list.offsetHeight - innerHeight * .62);
              });
              const aboutStart = () => top(about) + about.offsetHeight - innerHeight * .8, aboutEnd = () => top(about) + about.offsetHeight - innerHeight * .5;
              const stops = [pasta, ...listDots as HTMLElement[], aboutDot, stop];
              const flights: [() => number, () => number][] = [
                // It leaves the folder only once the project grid has gone by, so it never crosses the cards.
                [() => { const grid = node.querySelector<HTMLElement>("[data-strip]"); return grid ? Math.min(readStart[0]() - 120, top(grid) + grid.offsetHeight - innerHeight * .9) : top(work); }, readStart[0]],
                ...lists.slice(1).map((_, k) => [readEnd[k], readStart[k + 1]] as [() => number, () => number]),
                [readEnd[lists.length - 1], aboutStart],
                [aboutEnd, () => top(panel) - innerHeight * .45],
              ];
              const carrier = document.createElement("span");
              carrier.className = styles.carrier; node.append(carrier);
              const place = () => {
                const y = scrollY;
                let rest = stops.length - 1, flight = -1, progress = 0;
                for (let i = 0; i < flights.length; i++) {
                  const s = flights[i][0](), e = flights[i][1]();
                  if (y < s) { rest = i; break; }
                  if (y < e) { rest = -1; flight = i; progress = (y - s) / Math.max(1, e - s); break; }
                }
                // Before the dot has landed on the folder, the folder's dot stays hidden (the carrier owns it).
                const landed = rest !== 0 || y >= landAt();
                stops.forEach((el, i) => { el.style.visibility = i === rest && landed ? "visible" : "hidden"; });
                stop.dataset.lit = String(rest === stops.length - 1);
                carrier.style.visibility = flight >= 0 ? "visible" : "hidden";
                if (flight < 0) return;
                const p = .5 - Math.cos(Math.PI * progress) / 2;
                const ra = stops[flight].getBoundingClientRect(), rb = stops[flight + 1].getBoundingClientRect();
                const size = ra.width + (rb.width - ra.width) * p;
                const x = ra.left + ra.width / 2 + (rb.left + rb.width / 2 - ra.left - ra.width / 2) * p;
                const yy = ra.top + ra.height / 2 + (rb.top + rb.height / 2 - ra.top - ra.height / 2) * p - Math.sin(Math.PI * progress) * innerHeight * .08;
                carrier.style.width = carrier.style.height = `${size}px`;
                carrier.style.transform = `translate(${x - size / 2}px, ${yy - size / 2}px)`;
              };
              ScrollTrigger.create({ start: flights[0][0], end: flights[flights.length - 1][1], invalidateOnRefresh: true, onUpdate: place, onRefresh: place });
              // Reading: the dot runs along the rule; each title is underlined while the dot crosses its column (its row
              // on phones).
              const items = lists.flatMap(list => [...list.querySelectorAll<HTMLElement>("[data-read-item]")]);
              lists.forEach((list, k) => {
                const own = [...list.querySelectorAll<HTMLElement>("[data-read-item]")];
                const read = (p: number) => {
                  list.style.setProperty("--read", p.toFixed(4));
                  const vertical = innerWidth <= 560, size = vertical ? list.offsetHeight : list.offsetWidth;
                  own.forEach(item => {
                    const a = (vertical ? item.offsetTop : item.offsetLeft) / size, b = a + (vertical ? item.offsetHeight : item.offsetWidth) / size;
                    // A title that breaks onto two lines gets no underline: two stacked lines read as clutter (21/11/2026).
                    const wraps = (item.querySelector("h3 span")?.getClientRects().length ?? 1) > 1;
                    item.style.setProperty("--u", wraps ? "0" : Math.min(1, Math.max(0, (p - a) / Math.max(.01, (b - a) * .85))).toFixed(4));
                  });
                };
                ScrollTrigger.create({ start: readStart[k], end: readEnd[k], invalidateOnRefresh: true, onUpdate: self => read(self.progress), onRefresh: self => read(self.progress) });
              });
              const underline = (p: number) => { about.style.setProperty("--read", p.toFixed(4)); about.style.setProperty("--u", p.toFixed(4)); };
              ScrollTrigger.create({ start: aboutStart, end: aboutEnd, invalidateOnRefresh: true, onUpdate: self => underline(self.progress), onRefresh: self => underline(self.progress) });
              restore.push(() => {
                carrier.remove();
                stops.forEach(el => { el.style.visibility = ""; });
                delete stop.dataset.lit;
                [...lists, about, ...items].forEach(el => { el.style.removeProperty("--read"); el.style.removeProperty("--u"); });
              });
            }
          }
        }
        // Title: the two words of the name breathe in opposite directions (narrow ↔ wide), as in the reference.
        const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
        // The hero loops start paused: on arrival the brand dot plays its scene first, then they begin.
        const loops: { play: () => void }[] = [];
        // As in the reference, the name stays still and the pointer stretches it: toward the left "Gabriel" widens,
        // toward the right "Batista" does. Touch screens have no pointer to follow, so there the name rests.
        if (words.length === 2) {
          gsap.set(words, { "--wdth": 88 });
          if (matchMedia("(pointer: fine)").matches) {
            const left = gsap.quickTo(words[0], "--wdth", { duration: .9, ease: "power3.out" });
            const right = gsap.quickTo(words[1], "--wdth", { duration: .9, ease: "power3.out" });
            let live = false;
            const stretch = (event: MouseEvent) => {
              if (!live) return;
              const t = Math.min(1, Math.max(0, event.clientX / innerWidth));
              left(76 + (1 - t) * 24);
              right(76 + t * 24);
            };
            addEventListener("mousemove", stretch);
            loops.push({ play: () => { live = true; } });
            restore.push(() => removeEventListener("mousemove", stretch));
          }
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
        // The card stays straight, as in the reference.
        const startLoops = (fromAssembled: boolean) => {
          // The name is signed: the clouds may rise now (components/HeroClouds.tsx waits for this).
          document.documentElement.dataset.heroSigned = "";
          loops.forEach(loop => loop.play());
          // Assembled once, then still (21/11/2026): the endless loop only decorated and kept the page moving on its own.
          if (cardLoop) { if (fromAssembled) cardLoop.seek(assembledAt).pause(); else cardLoop.tweenFromTo(0, assembledAt); }
        };

        // The brand dot's scene, once per visit (not again after pausing and resuming): born as the tittle of
        // "Design", it soaks that phrase in red ink, drips like rain onto the "i" of "Gabriel", hops with squash and
        // stretch to the "i" of "Batista" and lands in the card as the dot of "g.". Then the loops begin.
        const h1 = node.querySelector<HTMLElement>("[data-hero-wordmark]");
        const fly = node.querySelector<HTMLElement>("[data-hero-dot]");
        const tittles = gsap.utils.toArray<HTMLElement>("[data-tittle]");
        // Phones (21/11/2026) show one voice: the promise. The signature is hidden there, so the dot scene plays on computers only.
        if (!dotSceneDone.current && innerWidth > 700 && h1 && fly && tittles.length === 2 && words.length === 2 && cardLoop && dot) {
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
          // The story is told in order: first he is formed by the points (HeroClouds), then the dot is born and signs
          // the name, then the clouds rise. The scene waits for "formed", or 3.5 s at most.
          const scene = gsap.timeline({ paused: true, onComplete: () => startLoops(true) });
          // Twice as fast and without the charge and lap around the card (21/11/2026): about 2.5 s, so the eye returns
          // to the promise and the calls sooner.
          scene.timeScale(2);
          const LAP = false;
          const html = document.documentElement;
          let begun = false;
          const begin = () => { if (begun) return; begun = true; window.removeEventListener("gb:hero-formed", begin); gsap.delayedCall(.3, () => scene.play()); };
          if (html.dataset.heroFormed !== undefined || html.dataset.heroAssemble === undefined && html.dataset.heroForming === undefined) gsap.delayedCall(.15, begin);
          else {
            window.addEventListener("gb:hero-formed", begin);
            gsap.delayedCall(3.5, begin);
            restore.push(() => window.removeEventListener("gb:hero-formed", begin));
          }
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
          if (LAP && trail && glow && wave && card && cardBox) {
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
            // fromTo renders its start at once by default: the glow and the wave showed as rings marking the dot's path.
            ring(glow, lift);
            const trace = { head: 0 };
            const segment = .32;
            const drawTrail = () => { trail.style.strokeDashoffset = String(segment - trace.head); };
            scene.set(fly, { transformOrigin: "50% 50%" })
              .to(fly, { y: lift.y - r, scaleX: .85, scaleY: 1.2, duration: .35, ease: "power2.out" })
              // Charging: the dot clenches and swells faster each time while a red glow pulses out of it.
              .addLabel("charge")
              // As the dot gathers its energy for the lap, the clouds begin to rise behind him.
              .call(() => { document.documentElement.dataset.heroSigned = ""; }, undefined, "charge")
              .to(fly, { keyframes: [{ scale: .75, duration: .14 }, { scale: 1.2, duration: .14 }, { scale: .72, duration: .11 }, { scale: 1.25, duration: .11 }, { scale: .7, duration: .08 }, { scale: 1.3, duration: .08 }], ease: "sine.inOut" }, "charge")
              .to(fly, { x: `+=${r * .12}`, duration: .04, repeat: 9, yoyo: true, ease: "none" }, "charge+=.2")
              .fromTo(glow, { scale: .6, opacity: .9 }, { scale: 2.6, opacity: 0, duration: .32, ease: "power1.out", repeat: 2, immediateRender: false }, "charge")
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
              .fromTo(wave, { scale: .4, opacity: .9 }, { scale: 3.4, opacity: 0, duration: .55, ease: "power2.out", immediateRender: false }, "impact")
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
        gsap.utils.toArray<HTMLElement>("[data-shape]").forEach((shape, index) => {
          gsap.fromTo(shape, { y: 150, rotation: index % 2 ? -32 : 22, scale: .85 }, {
            y: Number(shape.dataset.shape) * 1.6, rotation: index % 2 ? 30 : -25, scale: 1.08, ease: "none",
            scrollTrigger: { trigger: "[data-hook]", start: "top bottom", end: "bottom top", scrub: .8 },
          });
        });
        // The folder: closed and large at the centre, the brand dot drops onto its tab like a click, the cover opens
        // and the strip of projects is pulled out of it sideways while the folder settles below. Reversible.
        const work = node.querySelector<HTMLElement>("[data-work-track]");
        if (work) {
          const stage = work.querySelector<HTMLElement>("[data-work-stage]")!, pasta = work.querySelector<HTMLElement>("[data-pasta]")!;
          const centre = (el: HTMLElement) => el.offsetTop + el.offsetHeight / 2;
          // Offsets measured on the final (CSS) layout: the folder starts at the middle of the stage.
          const toMiddle = () => stage.clientHeight / 2 - centre(pasta);
          gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: work, start: "top 80%", end: "top 15%", scrub: .6, invalidateOnRefresh: true } })
            .fromTo(pasta, { y: toMiddle, scale: 2.3, rotation: -8 }, { y: toMiddle, scale: 2.1, rotation: 0, duration: .2, ease: "power2.out" }, 0)
            .fromTo("[data-pasta-front]", { rotationX: -8 }, { rotationX: -8, duration: .01 }, 0)
            .fromTo("[data-pasta-sheet]", { y: 0 }, { y: 0, duration: .01 }, 0)
            .to("[data-pasta-dot]", { keyframes: [{ scaleX: 1.35, scaleY: .7, duration: .03 }, { scaleX: 1, scaleY: 1, duration: .05 }] }, .26)
            .fromTo("[data-pasta-ring]", { scale: 1, opacity: .9 }, { scale: 6, opacity: 0, duration: .14, ease: "power2.out", immediateRender: false }, .26)
            .to("[data-pasta-front]", { rotationX: -52, duration: .14, ease: "power2.inOut" }, .3)
            .to("[data-pasta-sheet]", { y: () => -pasta.offsetHeight * .84 * .22, duration: .14, ease: "power2.inOut" }, .32)
            .to(pasta, { y: 0, scale: 1, duration: .34, ease: "power2.inOut" }, .4)
            .fromTo("[data-work-word]", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .3, ease: "power2.out" }, .45)
            .fromTo("[data-work-note]", { opacity: 0 }, { opacity: 1, duration: .12 }, .66)
            .to({}, { duration: .2 }, .8);
          // The projects right below the folder come in quickly, once, as the grid enters (21/11/2026).
          gsap.utils.toArray<HTMLElement>("[data-strip] li").forEach((item, i) => {
            gsap.fromTo(item, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: .55, delay: (i % 4) * .06, ease: "power2.out", scrollTrigger: { trigger: item, start: "top 94%", once: true } });
          });
        }
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
    {children}<div className={styles.frameGlow} data-frame-glow aria-hidden="true"/><div className={styles.cursor} data-editorial-cursor aria-hidden="true"/>
    {hydrated && <button className={styles.motionControl} type="button" aria-pressed={paused} title={paused ? labels.resume : labels.pause} onClick={() => setPaused(value => !value)}><span className={styles.motionLabel}>{paused ? labels.resume : labels.pause}</span></button>}
  </div>;
}
