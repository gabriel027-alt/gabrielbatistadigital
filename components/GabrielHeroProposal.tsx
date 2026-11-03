"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { applyTheme, THEME_KEY } from "@/lib/theme";
import { Arrow, ArrowDown, Sun, Moon } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { previewVersion } from "@/lib/content";
import styles from "./GabrielHeroProposal.module.css";

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
export function GabrielHeroProposal({ initialPortrait }: { initialPortrait: string | null }) {
  const dark = useSyncExternalStore(subscribeTheme, () => document.documentElement.dataset.theme === "dark", () => true);
  function chooseTheme(value: "light" | "dark") {
    applyTheme(value);
    try { localStorage.setItem(THEME_KEY, value); } catch {}
  }
  const [portrait, setPortrait] = useState(initialPortrait);
  const [error, setError] = useState("");
  const blob = useRef<string | null>(null);
  useEffect(() => () => { if (blob.current) URL.revokeObjectURL(blob.current); }, []);
  function select(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setError("Selecione uma foto PNG, JPEG ou WebP."); return; }
    if (blob.current) URL.revokeObjectURL(blob.current);
    blob.current = URL.createObjectURL(file);
    setPortrait(blob.current);
    setError("");
  }
  return <main className={styles.proposal}>
    <a className={styles.skip} href="#proposta-conteudo">Pular para o conteúdo</a>
    <section className={styles.hero} aria-labelledby="gabriel-hero-title">
      {portrait && <div className={styles.portrait}><Image src={portrait} alt="Retrato aprovado de Gabriel, preservado sem edição" fill unoptimized sizes="100vw" preload onError={() => setError("Não foi possível abrir a foto. Selecione o arquivo original novamente.")} /></div>}
      <header className={styles.header}>
        <a href="#proposta-conteudo" className={styles.brand} aria-label="Gabriel Batista Digital — início">GABRIEL<span>BATISTA DIGITAL</span></a>
        <nav aria-label="Navegação da proposta"><a href="#proposta-projeto">Projetos</a><a href="#proposta-contato">Contato</a></nav>
        <div className={styles.theme} role="group" aria-label="Aparência da proposta"><button type="button" aria-pressed={!dark} onClick={() => chooseTheme("light")}><Sun size={13}/>Claro</button><button type="button" aria-pressed={dark} onClick={() => chooseTheme("dark")}><Moon size={13}/>Escuro</button></div>
      </header>
      <div className={styles.offer} id="proposta-conteudo"><h1 id="gabriel-hero-title">Sua marca.<br />Presença que<br />se impõe.</h1><p>Design e desenvolvimento de sites para comunicar o valor do seu negócio.</p><a className={styles.cta} href={buildWhatsAppUrl("Olá, Gabriel! Quero conversar sobre um site para minha marca.")} target="_blank" rel="noopener noreferrer">Conversar sobre meu site<Arrow size={18} /></a><a className={styles.projectLink} href="#proposta-projeto">Conhecer o trabalho<ArrowDown size={16} /></a></div>
      <div className={styles.signature}><span>GABRIEL</span><p>Design com identidade.<br />Desenvolvimento sob medida.</p></div>
      {!portrait && <div className={styles.empty}><p>O retrato aprovado entra aqui.</p><label className={styles.photoButton}>Selecionar foto original<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => select(event.target.files?.[0])} /></label><span>A foto abre somente neste navegador.<br />Nenhum arquivo é enviado ou alterado.</span></div>}
      <div className={styles.heroFoot}><span>Você conversa com quem cria.</span><a href="#proposta-projeto">Explore abaixo<ArrowDown size={15} /></a><span>gabrielbatistadigital.com.br</span></div>
    </section>
    <section id="proposta-projeto" className={styles.work} aria-labelledby="proposta-work-title"><div className={styles.workCopy}><h2 id="proposta-work-title">O projeto<br />em primeiro plano.</h2><p>Vanguard</p><span>Arquitetura</span><Link href="/conceitos/vanguard" className={styles.workLink}>Explorar o projeto<Arrow size={17}/></Link></div><Link href="/conceitos/vanguard" className={styles.workImage} aria-label="Explorar o projeto Vanguard"><Image src={`/images/screens/${previewVersion}/vanguard-desktop.webp`} alt="Interface do estudo autoral Vanguard" width={1200} height={2200} sizes="(max-width: 760px) 92vw, 65vw" /></Link><p className={styles.disclosure}>Estudo autoral de design e desenvolvimento.</p></section>
    <footer id="proposta-contato" className={styles.contact}><p>Vamos dar forma<br />ao seu próximo projeto.</p><a className={styles.cta} href={buildWhatsAppUrl("Olá, Gabriel! Quero conversar sobre meu próximo projeto.")} target="_blank" rel="noopener noreferrer">Falar com Gabriel<Arrow size={18}/></a><Link href="/">Voltar ao site atual</Link></footer>
    <details className={styles.review}><summary>Revisão da proposta</summary><p>Composição de abertura, sem animação ou 3D nesta etapa. Selecione o retrato original para avaliar o enquadramento.</p><label className={styles.photoButton}>Trocar foto local<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => select(event.target.files?.[0])} /></label><p>Arquivo local: permanece neste navegador e precisa ser selecionado novamente após recarregar. Para integrar ao projeto, use o arquivo aprovado em public/images/hero/gabriel-approved-red.png.</p>{error && <p role="alert">{error}</p>}</details>
  </main>;
}
