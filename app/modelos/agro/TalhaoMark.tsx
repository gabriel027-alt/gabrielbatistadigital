/** Talhão's mark: a square plot divided by planting rows; the rows that are left form a T. */
export function TalhaoMark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="26" height="26" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 8.5h18M7 12h18M14.2 15.5V25M17.8 15.5V25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M7 18h4M7 21.5h4M21 18h4M21 21.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".45" />
  </svg>;
}
