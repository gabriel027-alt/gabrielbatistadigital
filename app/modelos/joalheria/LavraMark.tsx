/** The Lavra mark: a ring seen from the side, a thin ellipse with a small burin cut. */
export function LavraMark({ size = 30 }: { size?: number }) {
  return <svg viewBox="0 0 36 24" width={size * 36 / 24} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <ellipse cx="18" cy="12" rx="15" ry="7.5" />
    <path d="M24 3.4 L26.6 7" strokeWidth="2.4" />
  </svg>;
}
