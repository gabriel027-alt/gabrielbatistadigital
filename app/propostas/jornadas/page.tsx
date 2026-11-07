import type { Metadata } from "next";
import Link from "next/link";
import styles from "../orla/previa/preview.module.css";

export const metadata: Metadata = { title: "Aura e Orla | Jornadas de interesse", robots: { index: false, follow: false }, alternates: { canonical: "/propostas/jornadas" } };

export default function JourneyPreview() {
  return <main className={styles.page}><div className={styles.content}>
    <h1>Do interesse ao próximo passo.</h1>
    <p>Prévias dos CTAs e das escolhas locais em Aura e Orla. Os roteiros não enviam dados ou confirmam atendimentos.</p>
    {(["aura", "orla"] as const).map(brand => <section key={brand} aria-labelledby={`${brand}-preview-title`}>
      <h2 id={`${brand}-preview-title`} style={{ fontSize: 28, fontWeight: 400, marginTop: 45 }}>{brand === "aura" ? "Aura: interesse e dúvida" : "Orla: critérios de busca"}</h2>
      <video className={styles.video} controls playsInline preload="metadata" aria-label={`Jornada de interesse ${brand === "aura" ? "Aura" : "Orla"}`} poster={brand === "aura" ? "/images/aura-sequence/portrait.webp" : "/images/models/imoveis.webp"}>
        <source src={`/videos/projects/${brand}-inquiry.mp4`} type="video/mp4" />
        <track kind="captions" src={`/videos/projects/${brand}-inquiry.pt.vtt`} srcLang="pt-BR" label="Português" />
        Seu navegador não reproduz este vídeo. Use o link para baixar.
      </video>
      <div className={styles.links}><a href={`/videos/projects/${brand}-inquiry.mp4`} download={`${brand}-jornada.mp4`}>Baixar MP4 {brand === "aura" ? "Aura" : "Orla"}</a><Link href={`/propostas/${brand}`}>Abrir a experiência {brand === "aura" ? "Aura" : "Orla"}</Link></div>
    </section>)}
  </div></main>;
}
