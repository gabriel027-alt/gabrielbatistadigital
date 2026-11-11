/** Own avatar loop; only used by the editorial review route. */
export const editorialAvatar = {
  src: "/videos/editorial/gabriel-avatar-loop-v11.mp4",
  poster: "/images/editorial/gabriel-avatar-loop-v11.webp",
  duration: 334 / 30,
} as const;

/** Played through Spotify's official player, which loads only after the visitor asks for it. */
export const footerMusic = {
  /** Off for the version shown to clinics. To turn it on, set NEXT_PUBLIC_FOOTER_MUSIC=on in .env.local and rebuild. */
  enabled: process.env.NEXT_PUBLIC_FOOTER_MUSIC === "on",
  artist: "Limp Bizkit",
  /** Albums chosen by Gabriel, in turn. The last track tells the player when to move on to the next album. */
  albums: [
    { title: "Significant Other", uri: "spotify:album:3HCCUaRSjHSFOe4fqE0BiP", lastTrack: "spotify:track:2ZozYdvhnrCPeE7SvbxxLS" },
    { title: "Gold Cobra", uri: "spotify:album:6zr7fFAGz7kdayP8p3pbss", lastTrack: "spotify:track:4BLVr0wwXgTcog53Y2kjRG" },
    { title: "Results May Vary", uri: "spotify:album:3oUoQ0UH7Rv06x1kpSjS36", lastTrack: "spotify:track:3axDoiJ9uic9gy3wC4LxQW" },
  ],
  api: "https://open.spotify.com/embed/iframe-api/v1",
} as const;
