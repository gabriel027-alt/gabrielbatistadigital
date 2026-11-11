/** Almeida & Valença's mark: a cognac wax seal with A&V, irregular edge like pressed wax. */
export function AlmeidaSeal({ size = 64, className }: { size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <path d="M50 4c7 0 9 4 15 5s11-1 15 4 1 10 5 15 9 7 9 14-5 8-5 14 4 11 0 16-10 3-14 7-4 11-11 13-9-3-15-2-10 6-16 3-4-9-9-12-11-2-14-8 2-10 0-15-7-9-4-15 8-6 9-12-2-11 3-15 10-1 15-4 6-7 13-7Z" fill="currentColor" />
    <circle cx="50" cy="51" r="30" fill="none" stroke="#f5ecdf" strokeOpacity=".45" strokeWidth="1.4" />
    <text x="50" y="60" textAnchor="middle" fill="#f5ecdf" fontFamily="var(--almeida-serif), Georgia, serif" fontSize="26" fontWeight="600">A<tspan fontStyle="italic" fontSize="20">&amp;</tspan>V</text>
  </svg>;
}
