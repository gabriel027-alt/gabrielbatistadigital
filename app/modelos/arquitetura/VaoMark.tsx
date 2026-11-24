/** The Vão mark: an opening between two supports, a doorway seen from the front (two uprights and a lintel). */
export function VaoMark({ size = 30 }: { size?: number }) {
  return <svg viewBox="0 0 28 32" width={size * 28 / 32} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
    <path d="M3 30 V4 H25 V30" />
    <path d="M9 30 V10 H19 V30" strokeWidth="1.4" />
  </svg>;
}
