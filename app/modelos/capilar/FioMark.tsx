/** The Fio mark: one line drawing the curve of the front hairline, seen from the front. */
export function FioMark({ size = 30 }: { size?: number }) {
  return <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d="M4 22 C5 12 9 9 12 12 C14 8 18 8 20 12 C23 9 27 12 28 22" />
  </svg>;
}
