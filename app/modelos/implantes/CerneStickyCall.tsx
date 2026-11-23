"use client";

import { useEffect, useState } from "react";
import { Arrow } from "@/components/ui/icons";
import styles from "./cerne.module.css";

/**
 * The call at the thumb on phones (the Nova Odonto idea, as the brand's own journey). It shows only once the top's own
 * buttons have left the screen, and hides again when the journey comes into view, so it never sits on another call.
 */
export function CerneStickyCall({ href }: { href: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const top = document.querySelector("[data-cerne-hero-calls]")?.getBoundingClientRect();
      const journey = document.querySelector('[data-inquiry="cerne"]')?.getBoundingClientRect();
      setShow(!!top && top.bottom < 0 && !(journey && journey.top < innerHeight * .9 && journey.bottom > 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);
  return <a className={styles.stickyCall} href={href} data-show={show} aria-hidden={!show} tabIndex={show ? 0 : -1}>Agendar avaliação <Arrow size={18} /></a>;
}
