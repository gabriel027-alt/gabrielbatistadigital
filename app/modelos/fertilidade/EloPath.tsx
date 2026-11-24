"use client";

import { useEffect, useState } from "react";
import { stops } from "@/lib/elo";
import styles from "./elo.module.css";

/**
 * The path (composição-assinatura of Elo): five stops on one line, each marked by the two rings of the mark. Touching
 * or pointing at a stop lights it up and shows what happens there. Horizontal on computers, vertical on phones.
 * Without JavaScript every stop is explained under its title.
 */
export function EloPath() {
  const [active, setActive] = useState(stops[0].id);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const current = stops.find(stop => stop.id === active)!;
  return <div className={styles.path} data-elo-path data-ready={ready}>
    <ol className={styles.stops}>{stops.map((stop, i) => <li key={stop.id} data-on={ready && stop.id === active}>
      <button type="button" aria-pressed={ready ? stop.id === active : undefined} onClick={() => setActive(stop.id)} onPointerEnter={event => { if (event.pointerType === "mouse") setActive(stop.id); }}>
        <span className={styles.ring} aria-hidden="true" />
        <span className={styles.stopNum} aria-hidden="true">{i + 1}</span>
        <strong>{stop.title}</strong><span className={styles.stopShort}>{stop.short}</span>
      </button>
      <p className={styles.stopStatic}>{stop.text}</p>
    </li>)}</ol>
    {ready && <p className={styles.pathAnswer} aria-live="polite"><strong>{current.title}.</strong> {current.text}</p>}
  </div>;
}
