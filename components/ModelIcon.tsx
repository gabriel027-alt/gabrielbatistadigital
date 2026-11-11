/** Line icons shared by the rebuilt niche models. Decorative: the text next to each icon carries the meaning. */
export type ModelIconName =
  | "tooth" | "person" | "document" | "scan" | "heart" | "chair" | "calendar" | "implant" | "veneer" | "aligner" | "sparkle"
  | "scale" | "shield" | "eye" | "handshake" | "home" | "scroll" | "clock" | "video" | "people";

const paths: Record<ModelIconName, string> = {
  tooth: "M7 3c-2.2 0-3.5 1.8-3.5 4.2 0 2.6 1.2 4 1.7 6.4.5 2.6.7 6.4 2.3 6.4 1.4 0 1.5-4.2 2.5-4.2h2c1 0 1.1 4.2 2.5 4.2 1.6 0 1.8-3.8 2.3-6.4.5-2.4 1.7-3.8 1.7-6.4C18.5 4.8 17.2 3 15 3c-1.7 0-2.4 1-4 1S8.7 3 7 3Z",
  person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.6-3.4 3.4-5.5 7-5.5s6.4 2.1 7 5.5",
  document: "M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5M10 16h5",
  scan: "M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16",
  heart: "M12 20s-7-4.4-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.6 12 20 12 20Z",
  chair: "M7 4v8h9l2 4H8M7 12l-1 8M16 16v4M11 12V8",
  calendar: "M5 6h14v14H5V6Zm0 4h14M9 3v4M15 3v4M9 14h2",
  implant: "M8 3h8l-1 5H9L8 3Zm1.5 5h5M10 11h4M10.5 14h3M11 17h2M12 17v4",
  veneer: "M7 4c3-1 7-1 10 0 1 5 0 11-2 16-1 .5-5 .5-6 0C7 15 6 9 7 4Zm2 3c2-.5 4-.5 6 0",
  aligner: "M4 9c2-3 14-3 16 0-1 6-3 9-8 9s-7-3-8-9Zm3 1c2-1.5 8-1.5 10 0",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 12 .8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z",
  scale: "M12 4v16M7 20h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0L5 7Zm14 0-3 6a3 3 0 0 0 6 0l-3-6ZM12 4l-2 3h4l-2-3Z",
  shield: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-4",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  handshake: "M3 12l4-4 4 2 3-2 4 2 3 3M7 8l-4 4 5 5 2-1 2 2 2-1 2 1 4-4M10 16l2-2M12 18l2-2",
  home: "M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5",
  scroll: "M8 4h10a2 2 0 0 1 2 2v1h-4M8 4a2 2 0 0 0-2 2v12a2 2 0 0 1-2 2h11a2 2 0 0 0 2-2V7M8 4a2 2 0 0 1 2 2M10 11h5M10 15h5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2",
  video: "M4 7h11v10H4V7Zm11 4 5-3v8l-5-3",
  people: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9c.5-3 3-5 6-5s5.5 2 6 5M16 4.5a3.5 3.5 0 0 1 0 6.5M18 15c1.8.6 3 2.4 3.3 5",
};

export function ModelIcon({ name, size = 22, className }: { name: ModelIconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>;
}
