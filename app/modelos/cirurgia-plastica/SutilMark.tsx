/** Sutil mark: an S drawn by one continuous suture line, with the stitches across it. */
export function SutilMark({ size = 28 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    <path d="M22.5 8.5c-1.4-2.2-3.7-3.3-6.5-3.3-3.6 0-6 2-6 4.8 0 6.2 12.6 4 12.6 11.4 0 3.2-2.8 5.4-6.6 5.4-3 0-5.4-1.3-6.8-3.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.3 6.6l2 2.4M13.9 13.2l.9 2.9M19.6 15.6l-.3 3M21.4 23.8l-2.2 1.9M10.8 23.4l1.9 2.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".65" />
  </svg>;
}
