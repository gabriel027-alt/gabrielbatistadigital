import type { ReactNode } from "react";
import type { ShapeId } from "@/lib/gb-shapes";

/**
 * One of the "g." shapes, drawn around (0, 0). The bowl is a ring and the hook a half ring, both as thick as the
 * stem (70), so the assembled letter reads as one stroke. Gradients and shadow come from <GbShapeDefs/>.
 */
const ring = "M-105 0A105 105 0 1 0 105 0A105 105 0 1 0 -105 0ZM-35 0A35 35 0 1 1 35 0A35 35 0 1 1 -35 0Z";
const halfRing = "M-105 0A105 105 0 0 0 105 0L35 0A35 35 0 0 1 -35 0Z";

/** tone "dark": deeper copper and red, for the shapes drawn on the peach hero card. */
export function GbShape({ id, tone = "light" }: { id: ShapeId; tone?: "light" | "dark" }) {
  const fill = `url(#gb-${tone === "dark" ? "dark" : "fill"}-${id})`;
  const gloss = "url(#gb-gloss)";
  const shapes: Record<ShapeId, (paint: string) => ReactNode> = {
    bowl: paint => <path d={ring} fill={paint} fillRule="evenodd" />,
    stem: paint => <rect x="-35" y="-160" width="70" height="320" rx="35" fill={paint} />,
    hook: paint => <path d={halfRing} fill={paint} />,
    dot: paint => <circle r="26" fill={paint} />,
    bar: paint => <rect x="-30" y="-165" width="60" height="330" rx="30" fill={paint} />,
    orb: paint => <circle r="105" fill={paint} />,
  };
  return <g filter="url(#gb-soft)">{shapes[id](fill)}{id !== "dot" && id !== "hook" && shapes[id](gloss)}</g>;
}

/** Shared gradients: peach, cream, copper and the portrait red, lit from the top left. */
export function GbShapeDefs() {
  const fills: Record<ShapeId, [string, string, string]> = {
    bowl: ["#fff3e8", "#ffbc95", "#d9774f"],
    stem: ["#ffd9c0", "#f29a6e", "#b4502f"],
    hook: ["#ffc9a8", "#e8875f", "#8a2219"],
    dot: ["#e3483a", "#c4372b", "#8a2219"],
    bar: ["#d9503d", "#a32a1f", "#5e140f"],
    orb: ["#f7f1ea", "#d8cdc2", "#a8988a"],
  };
  const dark: Partial<Record<ShapeId, [string, string, string]>> = {
    bowl: ["#c9643e", "#a4462a", "#6e2a16"],
    stem: ["#b8402e", "#8a2219", "#5e140f"],
    hook: ["#d27450", "#a4462a", "#6e2a16"],
    dot: ["#e3483a", "#b22a1f", "#7a1a12"],
  };
  return <defs>
    {Object.entries(dark).map(([id, [a, b, c]]) => <linearGradient key={`dark-${id}`} id={`gb-dark-${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} />
    </linearGradient>)}
    {Object.entries(fills).map(([id, [a, b, c]]) => <linearGradient key={id} id={`gb-fill-${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={a} /><stop offset=".55" stopColor={b} /><stop offset="1" stopColor={c} />
    </linearGradient>)}
    <radialGradient id="gb-gloss" cx=".32" cy=".26" r=".55"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
    <filter id="gb-soft" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="26" stdDeviation="22" floodColor="#8a2219" floodOpacity=".16" /></filter>
  </defs>;
}
