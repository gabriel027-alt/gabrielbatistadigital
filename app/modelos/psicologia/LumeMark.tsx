/** Lume's mark: a window drawn in one stroke, its right shutter open, letting a band of light in. */
export function LumeMark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M17 27V5H5v22h12l9-4V9l-9-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11 8v16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
  </svg>;
}
