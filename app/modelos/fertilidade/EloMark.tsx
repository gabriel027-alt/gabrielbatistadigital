/** The Elo mark: two fine rings crossing each other, two people (or a person and the team) on the same path. */
export function EloMark({ size = 30 }: { size?: number }) {
  return <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="16" r="8.5" />
    <circle cx="20" cy="16" r="8.5" />
  </svg>;
}
