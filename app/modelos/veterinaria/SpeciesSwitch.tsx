"use client";

import { useState, useSyncExternalStore } from "react";
import type { Species } from "@/lib/toca";
import styles from "./toca.module.css";

const subscribe = () => () => {};

/**
 * The Cão / Gato switch. It sets data-species on the page root; CSS shows the matching photos and texts.
 * Without JS the page stays on the dog version and the switch is not rendered.
 */
export function SpeciesSwitch() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [species, setSpecies] = useState<Species>("cao");
  if (!hydrated) return null;
  const choose = (value: Species) => {
    setSpecies(value);
    const root = document.querySelector<HTMLElement>('[data-model="toca"]');
    if (root) root.dataset.species = value;
  };
  return <div className={styles.switch} role="group" aria-label="Quem vem com você?">
    <span className={styles.switchLabel}>Quem vem com você?</span>
    <div className={styles.switchTrack} data-value={species}>
      <button type="button" aria-pressed={species === "cao"} onClick={() => choose("cao")}>Cão</button>
      <button type="button" aria-pressed={species === "gato"} onClick={() => choose("gato")}>Gato</button>
    </div>
  </div>;
}
