"use client";

import { useEffect, useState } from "react";

/**
 * "Ver mais" for the homepage selection (24/11/2026). The projects are one list; the ones after the featured eight
 * carry `data-more` and stay hidden while the grid ([data-strip]) has `data-collapsed`. On phones the toggle is the
 * last card of the swipe row, so the gesture leads to it and the rest joins the same row; on computers it is a button
 * below the grid. Without JavaScript a <noscript> style shows everything and hides the toggles. EditorialMotion
 * refreshes the scroll scenes on the "toggle" event, since the page grows.
 */
export function MoreWorksToggle({ open, close, variant, className }: { open: string; close: string; variant: "card" | "button"; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  // Both toggles (card and button) follow the grid's state.
  useEffect(() => {
    const grid = document.querySelector<HTMLElement>("[data-strip]");
    if (!grid) return;
    const sync = () => setExpanded(!grid.hasAttribute("data-collapsed"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(grid, { attributes: true, attributeFilter: ["data-collapsed"] });
    return () => observer.disconnect();
  }, []);
  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const grid = event.currentTarget.closest<HTMLElement>("[data-strip]") ?? document.querySelector<HTMLElement>("[data-strip]");
    if (!grid) return;
    const opening = grid.hasAttribute("data-collapsed");
    grid.toggleAttribute("data-collapsed", !opening);
    event.currentTarget.dispatchEvent(new Event("toggle"));
    // On the phone row, slide to the first project that just appeared.
    if (opening && variant === "card") requestAnimationFrame(() => grid.querySelector<HTMLElement>("li[data-more]")?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" }));
  };
  return <button type="button" className={className} aria-expanded={expanded} onClick={toggle} data-more-toggle={variant}>{expanded ? close : open}</button>;
}
