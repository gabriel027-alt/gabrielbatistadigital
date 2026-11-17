/**
 * Gabriel Batista's own geometric shapes: the letter "g" taken apart (the bowl, the stem, the hook) and the red dot
 * that is also the dot of the "Gabriel • Batista" logo. On the homepage the red dot rises from Gabriel's palm and writes
 * "g." above it in one stroke, then hops into place as the full stop: "do primeiro traço ao último clique". (A bar, an
 * orb and a peach line that once tied flying pieces together were dropped on 16/11/2026; GbShape can still draw them.)
 * Coordinates live in a 1440 × 1000 view box.
 */
export type ShapeId = "bowl" | "stem" | "hook" | "dot" | "bar" | "orb";
export type Pose = { x: number; y: number; r: number; s: number };

export const view = { w: 1440, h: 1000 };

/** Line order follows the letter, then the dot, then the shapes that leave. Final poses form "g." centred at x 720. */
export const shapes: { id: ShapeId; scatter: Pose; drift: Pose; final: Pose }[] = [
  // Laid out left to right in the order the line visits them, so the line flows in one direction.
  { id: "bowl", scatter: { x: 170, y: 300, r: -20, s: .82 }, drift: { x: 300, y: 380, r: 8, s: 1.04 }, final: { x: 675, y: 470, r: 0, s: 1 } },
  { id: "hook", scatter: { x: 520, y: 140, r: 48, s: .78 }, drift: { x: 560, y: 300, r: 18, s: .96 }, final: { x: 675, y: 670, r: 0, s: 1 } },
  { id: "stem", scatter: { x: 860, y: 600, r: 34, s: .88 }, drift: { x: 840, y: 520, r: 12, s: 1 }, final: { x: 745, y: 510, r: 0, s: 1 } },
  { id: "dot", scatter: { x: 700, y: 840, r: 0, s: 1 }, drift: { x: 1010, y: 720, r: 0, s: 1 }, final: { x: 862, y: 644, r: 0, s: 1 } },
];

/** Smooth path through points (Catmull-Rom converted to cubic Bézier). */
export function pathThrough(points: { x: number; y: number }[]) {
  const p = points;
  let d = `M${p[0].x.toFixed(1)} ${p[0].y.toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/**
 * The "g." written in one stroke, as a hand writes it: the bowl anticlockwise from its upper right, up to the top of
 * the stem, down the stem, round the hook. Each piece is revealed by a brush along its own centre line (the masks in
 * the creation scene), and the red dot is the pen tip. Final poses: bowl (675, 470), stem x 745, hook (675, 670), all
 * with a centre-line radius of 70.
 */
export type Stroked = "bowl" | "stem" | "hook";
const R = 70, A0 = -Math.PI / 6, STEM_X = 745, STEM_TOP = 400, STEM_END = 670;
const bowlStart = { x: 675 + R * Math.cos(A0), y: 470 + R * Math.sin(A0) };
export const brushes: Record<Stroked, string> = {
  bowl: `M${bowlStart.x.toFixed(1)} ${bowlStart.y.toFixed(1)}A70 70 0 0 0 ${(1350 - bowlStart.x).toFixed(1)} ${(940 - bowlStart.y).toFixed(1)}A70 70 0 0 0 ${bowlStart.x.toFixed(1)} ${bowlStart.y.toFixed(1)}`,
  stem: "M745 340L745 700",
  hook: "M745 670A70 70 0 0 1 605 670",
};

/** Where the pen is at u (0–1 of the whole stroke) and how much of each piece it has written. */
export function writeAt(u: number) {
  const L1 = 2 * Math.PI * R, conn = Math.hypot(STEM_X - bowlStart.x, STEM_TOP - bowlStart.y), L3 = STEM_END - STEM_TOP, L4 = Math.PI * R;
  let d = Math.min(1, Math.max(0, u)) * (L1 + conn + L3 + L4);
  const out = { x: bowlStart.x, y: bowlStart.y, bowl: 0, stem: 0, hook: 0 };
  if (d <= L1) { const a = A0 - d / R; return { ...out, x: 675 + R * Math.cos(a), y: 470 + R * Math.sin(a), bowl: d / L1 }; }
  out.bowl = 1; d -= L1;
  if (d <= conn) { const k = d / conn; return { ...out, x: bowlStart.x + (STEM_X - bowlStart.x) * k, y: bowlStart.y + (STEM_TOP - bowlStart.y) * k }; }
  d -= conn;
  // The stem's brush starts above its rounded top (y 340) and runs to 700: the cap appears as the pen touches down.
  if (d <= L3) return { ...out, x: STEM_X, y: STEM_TOP + d, stem: (STEM_TOP + d - 340) / 360 };
  out.stem = 1; d -= L3;
  const k = Math.min(1, d / L4), a = k * Math.PI;
  return { ...out, x: 675 + R * Math.cos(a), y: 670 + R * Math.sin(a), hook: k };
}
export const transformOf = (pose: Pose) => `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) rotate(${pose.r.toFixed(2)}) scale(${pose.s.toFixed(3)})`;
