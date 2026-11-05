import type { Metadata } from "next";
import Link from "next/link";
import { AuraCharacterStudy } from "@/components/AuraCharacterStudy";
import styles from "./character.module.css";
export const metadata: Metadata = { title: "Aura · Personagem em movimento", robots: { index: false, follow: false } };
export default function AuraCharacterPage() {
  return <main className={styles.page}>
    <a href="#personagem" className={styles.skip}>Pular para a personagem</a>
    <header className={styles.header}><Link href="/propostas/aura" aria-label="Voltar ao projeto Aura">aura</Link><span>O rosto, em perspectiva.</span></header>
    <div id="personagem"><AuraCharacterStudy/></div>
  </main>;
}
