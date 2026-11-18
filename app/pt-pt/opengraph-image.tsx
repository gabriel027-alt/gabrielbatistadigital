import { homeCopy } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og-image";

/** Share image of the European Portuguese homepage. */
export const alt = homeCopy["pt-PT"].ogImageAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(homeCopy["pt-PT"].tagline);
}