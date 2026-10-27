import { ImageResponse } from "next/og";
export const alt = "Gabriel Batista Digital — O próximo nível da sua presença.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#111410",
        color: "#f1f1e9",
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
          color: "#ddeb9e",
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
        O próximo nível da sua presença.
      </div>
      <div style={{ fontSize: 20, color: "#a5ae9f" }}>
        ESTRATÉGIA · DESIGN · ENGENHARIA WEB
      </div>
    </div>,
    size,
  );
}
