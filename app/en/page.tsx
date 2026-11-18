import { EditorialHome } from "@/components/EditorialHome";
import { homeMetadata, homeViewport } from "@/lib/home-metadata";

/** The homepage in English, for campaigns abroad (lib/i18n.ts). */
export const viewport = homeViewport;
export const metadata = homeMetadata("en");

export default function HomePageEnglish() {
  return <EditorialHome locale="en" />;
}
