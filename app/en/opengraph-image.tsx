import { homeCopy } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og-image";

/** Share image of the English homepage. */
export const alt = homeCopy.en.ogImageAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(homeCopy.en.tagline);
}
