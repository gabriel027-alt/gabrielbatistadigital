/** The Cerne mark: a full circle with a bite taken out of its right side, which turns it into a C. */
export function CerneMark({ size = 32, id = "cerne-bite" }: { size?: number; id?: string }) {
  return <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
    <defs><mask id={id}><rect width="32" height="32" fill="#fff"/><circle cx="33" cy="16" r="10" fill="#000"/><circle cx="23.6" cy="9.4" r="2.2" fill="#000"/><circle cx="22.4" cy="16" r="2.2" fill="#000"/><circle cx="23.6" cy="22.6" r="2.2" fill="#000"/></mask></defs>
    <circle cx="16" cy="16" r="14" fill="currentColor" mask={`url(#${id})`}/>
  </svg>;
}
