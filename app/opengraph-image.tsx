import { ImageResponse } from "next/og";
export const alt = "Gabriel Batista Digital — Sua marca não nasceu para ser mais uma.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#102963",
        color: "#f1f4ff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "65px 75px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22,
          color: "#d5e1ff",
        }}
      >
        <span>GABRIEL BATISTA DIGITAL</span>
        <span>GBD / STUDIO</span>
      </div>
      <div
        style={{
          fontSize: 90,
          letterSpacing: -5,
          lineHeight: 1.1,
          maxWidth: 950,
        }}
      >
        Sua marca não nasceu para ser mais uma.
      </div>
      <div style={{ fontSize: 20, color: "#c6d6ff" }}>
        ESTRATÉGIA · DESIGN · ENGENHARIA WEB
      </div>
    </div>,
    size,
  );
}
