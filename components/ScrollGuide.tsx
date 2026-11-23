"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/editorial.module.css";

type Mode = "down" | "side" | null;

/**
 * Guide that tells the visitor the page goes on (22/11/2026, the user's request). It shows whenever the visitor stops
 * for a moment, through almost the whole page, and goes away at the first scroll or touch:
 * - "Deslize para continuar" (phones) / "Role para continuar" (computers), with an arrow down;
 * - over the phone project row, "Deslize para o lado", until the visitor has swiped it once.
 * From the top on (on phones right above the top's copy), not once the conversation is in view, not over a film.
 */
export function ScrollGuide({ labels }: { labels: { desktop: string; phone: string; side: string } }) {
  const [mode, setMode] = useState<Mode>(null);
  const [phone, setPhone] = useState(false);
  const [lift, setLift] = useState<number | null>(null);
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
      // Not over the top (23/11/2026, the user's decision, replacing the 22/11 request to show it from the top on): the
      // guide starts only once the top has mostly left the screen.
      const top = document.getElementById("editorial-start")?.getBoundingClientRect();
      if (top && top.bottom > h * .35) return null;
      setLift(null);
      const talk = document.getElementById("editorial-contact")?.getBoundingClientRect();
      if (talk && talk.top < h * .9) return null;
      if (narrow.matches && row && !swipedSideways) {
        const r = row.getBoundingClientRect();
        const more = row.scrollWidth - row.clientWidth - row.scrollLeft > 20;
        // Right under the cards, where the finger is to swipe (not at the foot of the screen, over the next title);
        // when the row sits too low for that (the menu is in the way), over the lower part of the first card's picture,
        // just above its "Ver filme completo" strip: right where the finger swipes, and it covers no text.
        if (more && r.top < h * .65 && r.bottom > h * .35) {
          const menuTop = h - 92, below = r.bottom + 12;
          const picture = row.querySelector("img")?.getBoundingClientRect();
          const onPicture = picture ? picture.bottom - 56 - 48 : menuTop - 48;
          setLift(Math.round(below + 48 <= menuTop ? h - below - 48 : Math.max(92, h - Math.min(onPicture, menuTop - 48) - 48)));
          return "side";
        }
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
  return <div className={styles.scrollGuide} data-scroll-guide={mode ?? "off"} aria-hidden="true" style={lift === null ? undefined : { bottom: `${lift}px` }}>
    {/* The gesture itself, drawn in the site's line (22/11/2026, the user's request): on phones a finger swipes up
        (or to the left over the project row), pressing with a peach touch; on computers a mouse wheel rolls. */}
    {phone || mode === "side"
      ? <svg className={styles.guideFinger} data-gesture={mode === "side" ? "side" : "up"} viewBox="0 0 32 32" width="34" height="34" aria-hidden="true">
          <g className={styles.guideHand}>
            {/* The touch: a peach glow under the fingertip while it presses and drags. */}
            <circle className={styles.guideTouch} cx="12.7" cy="7" r="4.2"/>
            <path d="M11 16V8.2a1.7 1.7 0 0 1 3.4 0V14m0-1.6a1.7 1.7 0 0 1 3.4 0V15m0-1.4a1.7 1.7 0 0 1 3.4 0v1.6m0-.4a1.7 1.7 0 0 1 3.4 0v3.6c0 4.4-2.9 7.6-7.2 7.6h-1c-2.4 0-4-1-5.4-2.8L6.6 20a1.6 1.6 0 0 1 2.5-2l1.9 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
        </svg>
      : <svg className={styles.guideMouse} viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <rect x="9" y="4" width="14" height="23" rx="7" fill="none" stroke="currentColor" strokeWidth="1.8"/>
          <rect className={styles.guideWheel} x="15" y="9" width="2" height="5" rx="1" fill="currentColor"/>
        </svg>}
    <span>{text}</span>
  </div>;
}
