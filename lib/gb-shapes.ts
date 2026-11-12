/**
 * Gabriel Batista's own geometric shapes: the letter "g" taken apart (the bowl, the stem, the hook) and the red dot
 * that is also the dot of the "Gabriel • Batista" logo. Two more shapes (a bar and an orb) travel with the line and
 * leave the scene. On the homepage the scroll assembles "g." right before "Vamos dar forma a ela."
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
  { id: "bar", scatter: { x: 1090, y: 120, r: -52, s: .95 }, drift: { x: 1160, y: 270, r: -8, s: 1 }, final: { x: 1380, y: 330, r: 40, s: 0 } },
  { id: "orb", scatter: { x: 1320, y: 620, r: 0, s: 1.12 }, drift: { x: 1270, y: 650, r: 0, s: 1.05 }, final: { x: 1400, y: 860, r: 0, s: 0 } },
];

/** Where the line enters and leaves the view box. */
export const lineEnds = { start: { x: -80, y: 120 }, end: { x: 1520, y: 900 } };

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

export const linePath = (poses: Pose[]) => pathThrough([lineEnds.start, ...poses, lineEnds.end]);
export const transformOf = (pose: Pose) => `translate(${pose.x.toFixed(1)} ${pose.y.toFixed(1)}) rotate(${pose.r.toFixed(2)}) scale(${pose.s.toFixed(3)})`;
