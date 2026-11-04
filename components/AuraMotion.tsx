"use client";
import { useState, useSyncExternalStore, type ReactNode } from "react";
import styles from "@/app/propostas/aura/aura.module.css";
const subscribe = () => () => {};
export function AuraMotion({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [paused, setPaused] = useState(false);
  return <div className={styles.page} data-motion={paused ? "off" : "on"}>
    {children}
    {hydrated && <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Ativar animações" : "Desativar animações"}</button>}
  </div>;
}
