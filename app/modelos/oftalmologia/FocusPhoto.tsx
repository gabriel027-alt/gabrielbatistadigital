"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./nitida.module.css";

/**
 * The focus at a touch (composição-assinatura of Nítida): the photo shows slightly out of focus, as seen without
 * glasses, and comes into focus when touched or pointed at ("Toque para focar"). It stays sharp after that. Without
 * JavaScript or with reduced motion it is sharp from the start. Illustrative: never a patient's result.
 */
export function FocusPhoto({ src, alt, sizes, className }: { src: string; alt: string; sizes: string; className?: string }) {
  const [ready, setReady] = useState(false);
  const [sharp, setSharp] = useState(false);
  useEffect(() => { if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setReady(true); }, []);
  const focus = () => setSharp(true);
  return <figure className={`${styles.focus} ${className ?? ""}`} data-focus={!ready || sharp ? "sharp" : "soft"}>
    <Image src={src} alt={alt} fill sizes={sizes} quality={88} />
    {ready && !sharp && <button type="button" className={styles.focusButton} onClick={focus} onPointerEnter={event => { if (event.pointerType === "mouse") focus(); }}>Toque para focar</button>}
  </figure>;
}
