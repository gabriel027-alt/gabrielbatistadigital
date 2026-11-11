"use client";

import gsap from "gsap";
import { useBrandMotion } from "@/components/brand/useBrandMotion";
import styles from "./almeida.module.css";

/**
 * Almeida's motion script.
 * Load: the brass ink line underlines the title and the seal is pressed (one orchestrated moment).
 * Scroll (signature, "a partilha se desenha"): conversation → assets → the inventory line → tax → branches to the heirs.
 */
function build(root: HTMLElement) {
  gsap.set("[data-hero-ink]", { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
  gsap.timeline({ defaults: { ease: "power2.out" } })
    .to("[data-hero-ink]", { attr: { "stroke-dashoffset": 0 }, duration: 1.3, ease: "power2.inOut" }, .2)
    .from(`.${styles.heroSeal}`, { scale: 1.25, opacity: 0, rotation: -12, duration: .7, ease: "back.out(1.6)" }, .9);

  const trunk = root.querySelector<SVGPathElement>("[data-tree-trunk]");
  const branches = gsap.utils.toArray<SVGPathElement>("[data-tree-branch]", root);
  const assets = gsap.utils.toArray<SVGGElement>("[data-tree-asset]", root);
  const steps = gsap.utils.toArray<HTMLElement>("[data-partition-step]", root);
  gsap.set([trunk, ...branches], { attr: { "stroke-dasharray": 1, "stroke-dashoffset": 1 } });
  gsap.set(["[data-tree-heading]", "[data-tree-rule]", ...assets, "[data-tree-knot]", "[data-tree-tax]", "[data-tree-heirs]"], { opacity: 0 });
  gsap.set(assets, { y: -14 });
  gsap.set(steps, { opacity: 0, y: 18 });

  const tree = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: "[data-almeida-partition]", start: "top top", end: "bottom bottom", scrub: .6, invalidateOnRefresh: true } });
  const show = (index: number, at: number) => {
    tree.to(steps[index], { opacity: 1, y: 0, duration: .04, ease: "power2.out" }, at);
    if (index < steps.length - 1) tree.to(steps[index], { opacity: 0, y: -18, duration: .03 }, at + .15);
  };
  // 1. The conversation: the family's estate is named.
  tree.to(["[data-tree-heading]", "[data-tree-rule]"], { opacity: 1, duration: .05 }, .02);
  show(0, .03);
  // 2. Documents and assets.
  tree.to(assets, { opacity: 1, y: 0, duration: .05, stagger: .03, ease: "power2.out" }, .21);
  show(1, .22);
  // 3. One line down: the inventory, in a notary or in court.
  tree.to(trunk, { attr: { "stroke-dashoffset": 0 }, duration: .1 }, .4)
    .to("[data-tree-knot]", { opacity: 1, duration: .04 }, .48);
  show(2, .42);
  // 4. Tax and valuation.
  tree.to("[data-tree-tax]", { opacity: 1, duration: .05 }, .62);
  show(3, .61);
  // 5. The partition: branches reach each heir.
  tree.to(branches, { attr: { "stroke-dashoffset": 0 }, duration: .12, stagger: .02 }, .8)
    .to("[data-tree-heirs]", { opacity: 1, duration: .05 }, .9);
  show(4, .8);
  tree.to({}, { duration: .05 }, .95);
}

export function AlmeidaMotion() {
  const { paused, available, toggle } = useBrandMotion('[data-model="almeida"]', build);
  if (!available) return null;
  return <button className={styles.motionToggle} type="button" aria-pressed={paused} onClick={toggle}>{paused ? "Ativar animações" : "Pausar animações"}</button>;
}
