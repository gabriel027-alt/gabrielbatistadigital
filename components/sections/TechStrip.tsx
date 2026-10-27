export function TechStrip() {
  return (
    <div className="tech-strip" aria-label="Tecnologias utilizadas">
      <div className="shell tech-inner">
        <span className="tech-caption">
          A BASE DE ALGO
          <br />
          EXTRAORDINÁRIO
        </span>
        <ul>
          <li>
            <span className="tech-next">N</span>Next.js
          </li>
          <li>
            <svg
              className="tech-react-icon"
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="2" fill="currentColor" stroke="none" />
              <ellipse cx="16" cy="16" rx="14" ry="5.5" />
              <ellipse
                cx="16"
                cy="16"
                rx="14"
                ry="5.5"
                transform="rotate(60 16 16)"
              />
              <ellipse
                cx="16"
                cy="16"
                rx="14"
                ry="5.5"
                transform="rotate(120 16 16)"
              />
            </svg>
            React
          </li>
          <li>
            <span className="tech-ts">TS</span>TypeScript
          </li>
          <li>
            <span className="tech-tailwind">≈</span>Tailwind CSS
          </li>
          <li>
            <span className="tech-vercel">▲</span>Vercel
          </li>
        </ul>
        <span className="tech-end">FEITO SOB MEDIDA.</span>
      </div>
    </div>
  );
}
