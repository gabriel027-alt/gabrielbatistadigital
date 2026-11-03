import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { GabrielHeroProposal } from "@/components/GabrielHeroProposal";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "GABRIEL — Proposta de abertura",
  robots: { index: false, follow: false },
  alternates: { canonical: "/propostas/gabriel" },
};
export default function ProposalPage() {
  const portrait = "/images/hero/gabriel-approved-red.png";
  const available = existsSync(path.join(process.cwd(), "public", portrait));
  return <GabrielHeroProposal initialPortrait={available ? portrait : null} />;
}
