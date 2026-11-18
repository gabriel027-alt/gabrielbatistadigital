import { EditorialHome } from "@/components/EditorialHome";
import { homeMetadata, homeViewport } from "@/lib/home-metadata";

/** The homepage in Portuguese; English at /en and Spanish at /es (components/EditorialHome.tsx, lib/i18n.ts). */
export const viewport = homeViewport;
export const metadata = homeMetadata("pt");

export default function HomePage() {
  return <EditorialHome locale="pt" />;
}
