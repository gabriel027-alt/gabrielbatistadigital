/** Two structural beams support one another; the cross-member makes the A. */
export function ArrimoMark({ size = 34 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="M5 34 18 6h4L35 34h-6L20 14 11 34H5Z" fill="currentColor" />
    <path d="M12 28h16M4 37h32" stroke="currentColor" strokeWidth="1.6" />
  </svg>;
}
