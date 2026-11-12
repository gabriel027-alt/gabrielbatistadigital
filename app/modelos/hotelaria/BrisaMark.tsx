/** Casa Brisa mark: a sun rising over the horizon line, inside an arch. Logo only. */
export function BrisaMark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <path d="M6 29V14a10 10 0 0 1 20 0v15" stroke="currentColor" strokeWidth="1.6" />
    <path d="M3 29h26" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10.5 22a5.5 5.5 0 0 1 11 0Z" fill="currentColor" />
    <path d="M8 25.5h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
  </svg>;
}
