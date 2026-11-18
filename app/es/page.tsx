import { EditorialHome } from "@/components/EditorialHome";
import { homeMetadata, homeViewport } from "@/lib/home-metadata";

/** The homepage in Spanish, for campaigns abroad (lib/i18n.ts). */
export const viewport = homeViewport;
export const metadata = homeMetadata("es");

export default function HomePageSpanish() {
  return <EditorialHome locale="es" />;
}
