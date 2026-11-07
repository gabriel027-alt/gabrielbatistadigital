import type { Metadata } from "next";
import Link from "next/link";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "Orla | Prévia em vídeo",
  robots: { index: false, follow: false },
  alternates: { canonical: "/propostas/orla/previa" },
};

export default function OrlaPreview() {
  return <main className={styles.page}>
    <div className={styles.content}>
      <Link href="/propostas/orla" className={styles.brand}>orla</Link>
      <h1>Prévia do movimento</h1>
      <p>Veja a abertura, o percurso das fotografias e o retorno do scroll.</p>
      <video controls playsInline preload="metadata" poster="/images/models/imoveis.webp" aria-label="Prévia do movimento da Orla" className={styles.video}>
        <source src="/videos/projects/orla-preview.mp4" type="video/mp4" />
        <track kind="captions" src="/videos/projects/orla-preview.pt.vtt" srcLang="pt-BR" label="Português" />
        Seu navegador não reproduz este vídeo. Use o link para baixar o MP4.
      </video>
      <div className={styles.links}>
        <a href="/videos/projects/orla-preview.mp4" download="orla-previa.mp4">Baixar o MP4</a>
        <Link href="/propostas/orla">Abrir a experiência com scroll</Link>
      </div>
      <p className={styles.note}>Estudo autoral com imagens geradas, sem oferta imobiliária.</p>
    </div>
  </main>;
}
