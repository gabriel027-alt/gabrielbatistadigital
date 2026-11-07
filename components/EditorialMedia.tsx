"use client";

import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/icons";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { projectFilms } from "@/lib/project-films";
import styles from "@/app/propostas/portfolio-editorial/editorial.module.css";
const subscribe = () => () => {};

export function EditorialMedia({ name, image, film, href, compact = false }: { name: string; image: string; film?: "aura" | "orla"; href?: string; compact?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const full = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  useEffect(() => {
    const el = video.current, root = el?.closest<HTMLElement>("[data-editorial]");
    if (!el || !root || !film) return;
    let visible = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      const allowed = visible && root.dataset.editorialMotion !== "off" && !reduced.matches && !connection?.saveData && !document.hidden && !document.querySelector('dialog[open]');
      if (allowed) {
        if (!el.getAttribute("src")) el.src = `/videos/projects/${film}-loop.mp4`;
        void el.play().catch(() => {});
      } else el.pause();
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: .2 });
    observer.observe(el);
    const mutations = new MutationObserver(update); mutations.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion"] });
    reduced.addEventListener("change", update); document.addEventListener("visibilitychange", update); document.addEventListener("editorial-modal", update);
    return () => { observer.disconnect(); mutations.disconnect(); reduced.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); document.removeEventListener("editorial-modal", update); el.pause(); };
  }, [film, hydrated]);
  const visual = <><Image src={image} alt={`Interface do projeto ${name}`} fill sizes={compact ? "(max-width:700px) 72vw, 24vw" : "(max-width:700px) 90vw, 45vw"}/>{film && <video ref={video} className={styles.teaser} data-editorial-loop={film} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}/>}<span className={styles.mediaHover}>{film ? "Ver filme completo" : "Explorar projeto"} <Arrow size={17}/></span></>;
  if (!film) return <Link className={styles.media} href={href || "#editorial-work"}>{visual}</Link>;
  const data = projectFilms[film];
  return <>
    {hydrated ? <button ref={trigger} className={styles.media} type="button" aria-label={`Ver filme completo: ${name}`} aria-haspopup="dialog" onClick={() => { dialog.current?.showModal(); document.dispatchEvent(new Event("editorial-modal")); }}>{visual}</button> : <a className={styles.media} href={data.source}>{visual}</a>}
    <dialog ref={dialog} data-lenis-prevent className={styles.filmDialog} aria-label={`Filme do projeto ${name}`} onClose={() => { full.current?.pause(); document.dispatchEvent(new Event("editorial-modal")); trigger.current?.focus(); }}>
      <div className={styles.filmHeader}><span>{name}</span><button type="button" onClick={() => dialog.current?.close()}>Fechar <span aria-hidden="true">×</span></button></div>
      <video ref={full} controls playsInline preload="none" poster={image} aria-label={data.label}><source src={data.source} type="video/mp4"/><track kind="captions" src={data.captions} srcLang="pt-BR" label="Português"/>Seu navegador não reproduz este vídeo.</video>
      <a className={styles.filmContact} href={data.contact} target="_blank" rel="noopener noreferrer">{data.action} <Arrow size={17}/></a><p>Converse com Gabriel pelo WhatsApp.</p>
    </dialog>
  </>;
}
