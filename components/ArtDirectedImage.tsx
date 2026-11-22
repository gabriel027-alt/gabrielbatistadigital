import { getImageProps } from "next/image";

type Source = { src: string; sizes: string };

/**
 * Full-bleed photo with its own crop for phones (art direction): a phone gets a tall image made for its screen
 * instead of a thin slice of the landscape one stretched several times over.
 */
export function ArtDirectedImage({ alt, desktop, mobile, preload = false, quality = 90 }: { alt: string; desktop: Source; mobile: Source; preload?: boolean; quality?: number }) {
  // No preload link (21/11/2026): Next preloaded both crops without a media query, so every screen fetched one it never
  // showed. An eager, high-priority <img> in the server HTML lets the browser pick the right <source> at once.
  const common = { alt, fill: true, quality, ...(preload ? { loading: "eager" as const, fetchPriority: "high" as const } : {}) };
  const { props: { srcSet: mobileSet } } = getImageProps({ ...common, ...mobile });
  const { props } = getImageProps({ ...common, ...desktop });
  return <picture>
    <source media="(max-width: 700px)" srcSet={mobileSet} sizes={mobile.sizes} />
    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props come from getImageProps */}
    <img {...props} />
  </picture>;
}
