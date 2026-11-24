/**
 * The Eixo mark: the body's axis as one vertical line with three points (hip, knee and ankle), a little off plumb at
 * the knee. As a divider, `lit` lights the point of the section's area (the spine is the line above the hip).
 */
export function EixoMark({ size = 30, lit }: { size?: number; lit?: "coluna" | "quadril" | "joelho" }) {
  const on = "var(--cobalto, currentColor)";
  return <svg viewBox="0 0 24 34" width={size * 24 / 34} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d="M11 1.5 L11 8.5" stroke={lit === "coluna" ? on : "currentColor"} strokeWidth={lit === "coluna" ? 3.6 : 2.6} />
    <path d="M11 8.5 L14.5 19 L11 29.5" />
    <circle cx="11" cy="8.5" r={lit === "quadril" ? 3.4 : 2.6} fill={lit === "quadril" ? on : "currentColor"} stroke="none" />
    <circle cx="14.5" cy="19" r={lit === "joelho" ? 3.4 : 2.6} fill={lit === "joelho" ? on : "currentColor"} stroke="none" />
    <circle cx="11" cy="29.5" r="2.6" fill="currentColor" stroke="none" />
  </svg>;
}
