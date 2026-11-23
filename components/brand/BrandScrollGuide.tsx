"use client";

import { useEffect, useRef, useState } from "react";
import { Gesture } from "./Gesture";
import styles from "./BrandScrollGuide.module.css";

/**
 * The homepage's scroll guide, for the brands (23/11/2026, the user's request: every site with a scroll scene needs
 * the same teaching). Whenever the visitor stops for a moment, a pill with the gesture comes back at the foot of the
 * screen and goes away at the first scroll or touch. It never shows:
 * - without motion (the page is then a plain, readable flow);
 * - while a scene's own hint ([data-scroll-hint]) is on screen, so there is one guide at a time;
 * - with a dialog open, or at the end of the page.
 * On phones it rests above any bar fixed at the foot of the screen, so it covers no button.
 */
/** `always`: for the pages whose motion does not go through useBrandMotion (Aura, Orla); reduced motion still hides it. */
export function BrandScrollGuide({ desktop = "Role para continuar", phone = "Deslize para continuar", tone = "dark", touch, always = false }: { desktop?: string; phone?: string; tone?: "dark" | "light"; touch?: string; always?: boolean }) {
  const [on, setOn] = useState(false);
  const [lift, setLift] = useState(0);
  const timer = useRef(0);
  const self = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const born = performance.now();
    const decide = () => {
      const h = innerHeight;
      if (!always && !document.querySelector('[data-brand-animated="true"]')) return false;
      if (document.querySelector("dialog[open]")) return false;
      if (scrollY + h >= document.documentElement.scrollHeight - h * .35) return false;
      const hint = [...document.querySelectorAll<HTMLElement>("[data-scroll-hint],[data-guide-hint]")].some(el => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < h && r.width > 0 && Number(getComputedStyle(el).opacity) > .1;
      });
      if (hint) return false;
      // Above whatever is fixed at the foot of the screen (a call bar on phones).
      let floor = h;
      document.querySelectorAll<HTMLElement>("body *").forEach(el => {
        if (el === self.current || self.current?.contains(el)) return;
        const style = getComputedStyle(el);
        if (style.position !== "fixed" || style.visibility === "hidden" || style.display === "none" || Number(style.opacity) < .1) return;
        const r = el.getBoundingClientRect();
        if (r.height > 0 && r.height < h * .4 && r.bottom >= h - 4 && r.top < floor) floor = r.top;
      });
      // It never covers words or a control (the user's rule): from the foot up, the first band where nothing under the
      // pill is text, a link or a button; pictures and plain backgrounds may sit under it. None free: it stays away.
      const box = self.current?.getBoundingClientRect(), width = box?.width || 200, height = box?.height || 38;
      // Every visible line of text and every control in the lower half of the screen, measured where it is drawn
      // (a hit test missed labels that ignore the pointer).
      const shown = (el: Element) => { const s = getComputedStyle(el); return s.visibility !== "hidden" && Number(s.opacity) > .05; };
      const blocks: DOMRect[] = [];
      const lower = (r: DOMRect) => r.width > 0 && r.height > 0 && r.bottom > h * .4 && r.top < h && r.right > 0 && r.left < innerWidth;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: node => node.textContent!.trim() && !self.current?.contains(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
      const range = document.createRange();
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const parent = node.parentElement;
        if (!parent || !shown(parent)) continue;
        range.selectNodeContents(node);
        for (const r of range.getClientRects()) if (lower(r)) blocks.push(r);
      }
      document.querySelectorAll("a,button,input,select,textarea,summary,[role=button]").forEach(el => { const r = el.getBoundingClientRect(); if (lower(r) && shown(el) && !self.current?.contains(el)) blocks.push(r); });
      for (let bottom = h - floor + 14; bottom < h * .45; bottom += 10) {
        // A little air around it too, so it never touches a button's edge.
        const top = h - bottom - height - 8, left = (innerWidth - width) / 2 - 6, right = left + width + 12, base = top + height + 16;
        if (!blocks.some(r => r.left < right && r.right > left && r.top < base && r.bottom > top)) { setLift(bottom - 14); return true; }
      }
      return false;
    };
    const wait = () => {
      clearTimeout(timer.current);
      setOn(false);
      timer.current = window.setTimeout(() => setOn(decide()), Math.max(2200, 5000 - (performance.now() - born)));
    };
    const events = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach(name => addEventListener(name, wait, { passive: true }));
    wait();
    return () => { clearTimeout(timer.current); events.forEach(name => removeEventListener(name, wait)); };
  }, [always]);
  return <div ref={self} className={`${styles.guide} ${tone === "light" ? styles.light : ""}`} data-brand-scroll-guide={on ? "on" : "off"} aria-hidden="true" style={{ bottom: `${lift + 14}px` }}>
    <Gesture touch={touch} />
    <span className={styles.desktop}>{desktop}</span><span className={styles.phone}>{phone}</span>
  </div>;
}
