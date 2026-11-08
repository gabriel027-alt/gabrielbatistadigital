import type { Metadata } from "next";
import Link from "next/link";
import styles from "../../orla/previa/preview.module.css";
export const metadata: Metadata = { title: "Portfólio editorial | Prévia", robots: { index: false, follow: false }, alternates: { canonical: "/propostas/portfolio-editorial/previa" } };
export default function EditorialPreview() {
  return <main className={styles.page}><div className={styles.content}><h1>Portfólio editorial.</h1><p>Uma versão de revisão baseada no material fornecido de Juan Mora, com fotografia, textos e projetos de Gabriel.</p><video className={styles.video} controls playsInline preload="metadata" poster="/images/hero/gabriel-approved-red.png" aria-label="Prévia do portfólio editorial"><source src="/videos/projects/portfolio-editorial-preview.mp4" type="video/mp4"/><track kind="captions" src="/videos/projects/portfolio-editorial-preview.pt.vtt" srcLang="pt-BR" label="Português"/>Use o link para baixar o vídeo.</video><div className={styles.links}><Link href="/propostas/portfolio-editorial">Abrir a experiência</Link><a href="/videos/projects/portfolio-editorial-preview.mp4" download="portfolio-editorial.mp4">Baixar MP4</a></div></div></main>;
}
