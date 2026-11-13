import { getImageProps } from "next/image";

type Source = { src: string; sizes: string };

/**
 * Full-bleed photo with its own crop for phones (art direction): a phone gets a tall image made for its screen
 * instead of a thin slice of the landscape one stretched several times over.
 */
export function ArtDirectedImage({ alt, desktop, mobile, preload = false, quality = 90 }: { alt: string; desktop: Source; mobile: Source; preload?: boolean; quality?: number }) {
  const common = { alt, fill: true, quality, preload };
  const { props: { srcSet: mobileSet } } = getImageProps({ ...common, ...mobile });
  const { props } = getImageProps({ ...common, ...desktop });
  return <picture>
    <source media="(max-width: 700px)" srcSet={mobileSet} sizes={mobile.sizes} />
    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props come from getImageProps */}
    <img {...props} />
  </picture>;
}
