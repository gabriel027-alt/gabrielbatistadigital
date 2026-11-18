import { EditorialHome } from "@/components/EditorialHome";
import { homeMetadata, homeViewport } from "@/lib/home-metadata";

/** The homepage in European Portuguese, for clinics in Portugal (lib/i18n.ts). */
export const viewport = homeViewport;
export const metadata = homeMetadata("pt-PT");

export default function HomePagePortugal() {
  return <EditorialHome locale="pt-PT" />;
}