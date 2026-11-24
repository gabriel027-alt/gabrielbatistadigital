/** The Ponte mark: two short banks joined by a curved plank, in a thick rounded stroke. */
export function PonteMark({ size = 30 }: { size?: number }) {
  return <svg viewBox="0 0 34 22" width={size * 34 / 22} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 19 V12" />
    <path d="M31 19 V12" />
    <path d="M3 12 Q17 1 31 12" />
  </svg>;
}

/** The bridge as a divider between the Portuguese and the English sentence (elemento-assinatura). */
export function Bridge() {
  return <svg viewBox="0 0 120 24" preserveAspectRatio="none" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M3 21 Q60 -6 117 21" vectorEffect="non-scaling-stroke" />
  </svg>;
}
