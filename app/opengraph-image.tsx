import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Share image (WhatsApp, social): the approved red portrait with the name, as on the homepage hero. */
export const alt = "Gabriel Batista: sites para clínicas e negócios de alto ticket";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const portrait = await readFile(join(process.cwd(), "public/images/hero/og-portrait.jpg"));
  const src = `data:image/jpeg;base64,${portrait.toString("base64")}`;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#201714" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img elements */}
      <img src={src} width={1200} height={630} alt="" style={{ position: "absolute", inset: 0, objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(0deg, rgba(23,12,11,.85) 0%, rgba(23,12,11,0) 55%)" }} />
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 52, display: "flex", flexDirection: "column", color: "#ffbc95" }}>
        <div style={{ display: "flex", alignItems: "flex-end", fontSize: 118, fontWeight: 700, letterSpacing: -6, lineHeight: 1 }}>
          Gabriel Batista<span style={{ color: "#c4372b" }}>.</span>
        </div>
        <div style={{ display: "flex", fontSize: 34, marginTop: 14, color: "#ffd9c0" }}>Sites para clínicas e negócios de alto ticket</div>
      </div>
    </div>,
    size,
  );
}
