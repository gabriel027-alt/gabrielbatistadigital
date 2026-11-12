/** Toca mark: the opening of a den (a half-moon) with two small ears on top that read as a T. */
export function TocaMark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <path d="M4 27a12 12 0 0 1 24 0Z" fill="currentColor" />
    <path d="M12.5 27a3.5 3.5 0 0 1 7 0" fill="var(--toca-mark-hole, #f6f4f0)" />
    <path d="M10.5 15.5 9 9.5l4.5 3.3M21.5 15.5 23 9.5l-4.5 3.3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
  </svg>;
}
