"use client";
import { useEffect, useRef } from "react";
export function HeroScene() {
  const scene = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const reset = () => {
      scene.current?.style.setProperty("--scene-x", "0px");
      scene.current?.style.setProperty("--scene-y", "0px");
    };
    media.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame.current);
      media.removeEventListener("change", reset);
    };
  }, []);
  return (
    <div
      ref={scene}
      className="studio-hero-art"
      aria-hidden="true"
      onPointerMove={(event) => {
        if (
          event.pointerType !== "mouse" ||
          matchMedia("(prefers-reduced-motion: reduce)").matches ||
          !matchMedia("(pointer: fine)").matches
        )
          return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
          scene.current?.style.setProperty("--scene-x", `${x * 10}px`);
          scene.current?.style.setProperty("--scene-y", `${y * 7}px`);
        });
      }}
      onPointerLeave={() => {
        cancelAnimationFrame(frame.current);
        scene.current?.style.setProperty("--scene-x", "0px");
        scene.current?.style.setProperty("--scene-y", "0px");
      }}
    >
      <div className="studio-scene-image" />
      <div className="studio-scene-shade" />
    </div>
  );
}
