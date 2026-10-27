export function Brand() {
  return (
    <span className="brand">
      <span className="brand-symbol" aria-hidden="true">
        g<span>/</span>
      </span>
      <span>
        gabriel batista<span className="brand-sub">DIGITAL STUDIO</span>
      </span>
    </span>
  );
}
export function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <p className="section-label">
      <span>{number} /</span>
      {children}
    </p>
  );
}
