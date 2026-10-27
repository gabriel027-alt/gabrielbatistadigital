export function ConceptArt({
  theme,
}: {
  theme: "chronos" | "vanguard" | "aura";
}) {
  return (
    <div className={`concept-art art-${theme}`} aria-hidden="true">
      {theme === "chronos" ? (
        <div className="watch">
          <div className="watch-strap" />
          <div className="watch-face">
            <span className="watch-brand">
              CHRONOS
              <br />
              <small>ATELIER</small>
            </span>
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} style={{ transform: `rotate(${i * 30}deg)` }} />
            ))}
            <span className="watch-hand hand-hour" />
            <span className="watch-hand hand-minute" />
            <span className="watch-center" />
            <span className="watch-caption">SWISS INSPIRED · CONCEPT</span>
          </div>
        </div>
      ) : theme === "vanguard" ? (
        <div className="architecture">
          <div className="building-plane plane-back" />
          <div className="building-plane plane-front" />
          <div className="building-window" />
          <div className="building-shadow" />
          <div className="building-stair" />
        </div>
      ) : (
        <div className="aura-sculpture">
          <div className="aura-ring ring-back" />
          <div className="aura-stone" />
          <div className="aura-ring ring-front" />
          <div className="aura-plinth" />
        </div>
      )}
    </div>
  );
}
