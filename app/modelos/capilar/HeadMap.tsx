"use client";

import { useEffect, useState } from "react";
import { zones } from "@/lib/fio";
import styles from "./fio.module.css";

/**
 * The head map (composição-assinatura of Fio): the head seen from above, front at the top. Choosing a zone, by its
 * button or on the drawing, lights it up and shows what is usually looked at there. The buttons are the accessible
 * controls; the drawing repeats them for the pointer. Without JavaScript every zone is explained in the list.
 */
export function HeadMap() {
  const [active, setActive] = useState(zones[0].id);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const current = zones.find(zone => zone.id === active)!;
  return <div className={styles.map} data-head-map data-ready={ready}>
    <svg className={styles.mapDrawing} viewBox="0 0 260 250" aria-hidden="true">
      <path className={styles.mapEars} d="M66 110 C54 112 52 136 64 140 M194 110 C206 112 208 136 196 140" />
      <path className={styles.mapNose} d="M122 22 L130 10 L138 22" />
      {zones.map(zone => <path key={zone.id} d={zone.path} className={styles.mapZone} data-on={ready && zone.id === active} onClick={() => setActive(zone.id)} />)}
      <path className={styles.mapOutline} d="M130 24 C176 24 196 64 196 120 C196 180 168 220 130 220 C92 220 64 180 64 120 C64 64 84 24 130 24 Z" />
    </svg>
    <div className={styles.mapSide}>
      <ul className={styles.mapList}>{zones.map(zone => <li key={zone.id} data-on={ready && zone.id === active}>
        <button type="button" aria-pressed={ready ? zone.id === active : undefined} onClick={() => setActive(zone.id)}>{zone.label}<span>{zone.short}</span></button>
        <p className={styles.mapStatic}>{zone.text}</p>
      </li>)}</ul>
      {ready && <p className={styles.mapAnswer} aria-live="polite"><strong>{current.label}.</strong> {current.text}</p>}
    </div>
  </div>;
}
