"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/editorial.module.css";

type Mode = "down" | "side" | null;

/**
 * Guide that tells the visitor the page goes on (22/11/2026, the user's request). It shows whenever the visitor stops
 * for a moment, through almost the whole page, and goes away at the first scroll or touch:
 * - "Deslize para continuar" (phones) / "Role para continuar" (computers), with an arrow down;
 * - over the phone project row, "Deslize para o lado", until the visitor has swiped it once.
 * Not over the top (its "Ver projetos ↓" button already says it), not once the conversation is in view, not over a film.
 */
export function ScrollGuide({ labels }: { labels: { desktop: string; phone: string; side: string } }) {
  const [mode, setMode] = useState<Mode>(null);
  const [phone, setPhone] = useState(false);
  const timer = useRef(0);
  useEffect(() => {
    const narrow = matchMedia("(max-width: 700px)");
    const syncPhone = () => setPhone(narrow.matches);
    syncPhone();
    narrow.addEventListener("change", syncPhone);
    const born = performance.now();
    let swipedSideways = false;
    const row = document.querySelector<HTMLElement>("[data-strip] ul");
    const onRow = () => { if (row && row.scrollLeft > 20) swipedSideways = true; };
    row?.addEventListener("scroll", onRow, { passive: true });
    const decide = (): Mode => {
      const h = innerHeight;
      if (document.querySelector("dialog[open]")) return null;
      const top = document.getElementById("editorial-start")?.getBoundingClientRect();
      if (top && top.bottom > h * .5) return null;
      const talk = document.getElementById("editorial-contact")?.getBoundingClientRect();
      if (talk && talk.top < h * .9) return null;
      if (narrow.matches && row && !swipedSideways) {
        const r = row.getBoundingClientRect();
        const more = row.scrollWidth - row.clientWidth - row.scrollLeft > 20;
        if (more && r.top < h * .65 && r.bottom > h * .35) return "side";
      }
      return "down";
    };
    const wait = () => {
      clearTimeout(timer.current);
      setMode(null);
      const delay = Math.max(2200, 5000 - (performance.now() - born));
      timer.current = window.setTimeout(() => setMode(decide()), delay);
    };
    const events = ["scroll", "wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach(name => addEventListener(name, wait, { passive: true }));
    row?.addEventListener("scroll", wait, { passive: true });
    wait();
    return () => {
      clearTimeout(timer.current);
      narrow.removeEventListener("change", syncPhone);
      events.forEach(name => removeEventListener(name, wait));
      row?.removeEventListener("scroll", onRow);
      row?.removeEventListener("scroll", wait);
    };
  }, []);
  const text = mode === "side" ? labels.side : phone ? labels.phone : labels.desktop;
  return <div className={styles.scrollGuide} data-scroll-guide={mode ?? "off"} aria-hidden="true">
    <span>{text}</span>
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      {mode === "side" ? <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        : <path d="M8 3v9M4.5 8.5 8 12l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>}
    </svg>
  </div>;
}
