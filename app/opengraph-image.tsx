import { homeCopy } from "@/lib/i18n";
import { ogSize, renderOgImage } from "@/lib/og-image";

/** Share image of the Portuguese homepage; /en and /es have their own (lib/og-image.tsx). */
export const alt = homeCopy.pt.ogImageAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(homeCopy.pt.tagline);
}
