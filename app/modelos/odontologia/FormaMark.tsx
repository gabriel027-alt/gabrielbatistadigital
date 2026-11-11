/** Forma's mark: a single-line upper incisor whose inner stroke forms an F. */
export function FormaMark({ size = 30, className }: { size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M7 4.5c3-1.6 15-1.6 18 0 .8 6.6.2 15-2.6 22.4-.4 1-1.6 1-2-.1L18.2 19c-.6-1.4-3.8-1.4-4.4 0l-2.2 7.8c-.4 1.1-1.6 1.1-2 .1C6.8 19.5 6.2 11.1 7 4.5Z" />
    <path d="M13 9.5h7M13 9.5v8M13 13.5h5" />
  </svg>;
}
