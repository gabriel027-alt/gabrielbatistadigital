"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import styles from "@/app/propostas/aura/aura.module.css";
const subscribe = () => () => {};
export function AuraMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [paused, setPaused] = useState(false);
  useEffect(()=>{
    const node=root.current;if(!node)return;
    const focusScene=(event:MouseEvent)=>{
      const anchor=(event.target as Element).closest<HTMLAnchorElement>('a[href="#aura-olhar"]');
      const track=node.querySelector<HTMLElement>('[data-photo-track]');
      if(!anchor || !track || track.dataset.sequenceAnimated!=="true" || event.button!==0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
      event.preventDefault();
      history.replaceState(null,"","#aura-olhar");
      scrollTo({top:track.getBoundingClientRect().top+scrollY+(track.offsetHeight-innerHeight)*.18,behavior:"smooth"});
    };
    node.addEventListener("click",focusScene);return()=>node.removeEventListener("click",focusScene);
  },[]);
  useEffect(() => {
    const node = root.current;
    if (!node || paused) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    async function setup() {
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        await document.fonts.ready;
        if (disposed || !node) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        revert = () => media.revert();
        media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 900px) and (min-height: 700px)" }, context => {
          if (!context.conditions?.motion) return;
          node.dataset.animated = "true";
          const select = gsap.utils.selector(node);
          const chars = select("[data-hero-glyph]");
          gsap.from(chars, { yPercent: 90, rotationX: -65, opacity: 0, stagger: .013, duration: .85, ease: "power3.out", clearProps: "all" });
          ScrollTrigger.refresh();
          return () => {
            delete node.dataset.animated;
          };
        }, node);
        if (disposed) revert();
      } catch {
        revert?.();
        if (node) delete node.dataset.animated;
        // The static HTML remains the usable fallback if the animation chunk fails.
      }
    }
    void setup();
    return () => { disposed = true; revert?.(); delete node.dataset.animated; };
  }, [paused]);
  return <div ref={root} className={styles.page} data-motion={paused ? "off" : "on"}>
    {children}
    {hydrated && <button className={styles.motionControl} type="button" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? "Ativar animações" : "Desativar animações"}</button>}
  </div>;
}
