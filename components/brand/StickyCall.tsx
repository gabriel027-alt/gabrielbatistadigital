"use client";

import { useEffect, useState } from "react";
import { Arrow } from "@/components/ui/icons";

/**
 * The call at the thumb on phones, shared by the static brands: it shows only once the top's own buttons
 * ([data-hero-calls]) have left the screen, and hides when the journey ([data-inquiry]) comes into view, so it never
 * sits on another call. The brand styles it through `className` and `data-show`.
 */
export function StickyCall({ href, label, className }: { href: string; label: string; className: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const top = document.querySelector("[data-hero-calls]")?.getBoundingClientRect();
      const journey = document.querySelector("[data-inquiry]")?.getBoundingClientRect();
      setShow(!!top && top.bottom < 0 && !(journey && journey.top < innerHeight * .9 && journey.bottom > 0));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    check();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); };
  }, []);
  return <a className={className} href={href} data-show={show} aria-hidden={!show} tabIndex={show ? 0 : -1}>{label} <Arrow size={18} /></a>;
}
