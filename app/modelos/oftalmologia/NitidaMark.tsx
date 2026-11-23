/** The Nítida mark: two circles like an iris; the inner one sits slightly off centre, the degree being adjusted. */
export function NitidaMark({ size = 30 }: { size?: number }) {
  return <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" strokeWidth="2.4"/>
    <circle cx="17.6" cy="14.6" r="6" fill="currentColor"/>
  </svg>;
}
