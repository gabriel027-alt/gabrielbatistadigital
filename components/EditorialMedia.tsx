"use client";

import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/ui/icons";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { films, type FilmId } from "@/lib/project-films";
import { filmText } from "@/lib/film-copy";
import { homeCopy, type Locale } from "@/lib/i18n";
import styles from "@/app/editorial.module.css";
const subscribe = () => () => {};

/** `decorative`: a visual copy (the second lap of the projects strip) that stays clickable but out of the tab order. */
export function EditorialMedia({ name, image, film, href, compact = false, decorative = false, locale = "pt" }: { name: string; image: string; film?: FilmId; href?: string; compact?: boolean; decorative?: boolean; locale?: Locale }) {
  const t = homeCopy[locale].media;
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const full = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  // The full film's poster is the full-size picture: asked for only once the film is opened, not on arrival.
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const el = video.current, root = el?.closest<HTMLElement>("[data-editorial]");
    if (!el || !root || !film) return;
    let visible = false;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      const allowed = visible && root.dataset.editorialMotion !== "off" && !reduced.matches && !connection?.saveData && !document.hidden && !document.querySelector('dialog[open]');
      if (allowed) {
        if (!el.getAttribute("src")) el.src = films[film].loop || `/videos/projects/${film}-loop.mp4`;
        void el.play().catch(() => {});
      } else el.pause();
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: .2 });
    observer.observe(el);
    const mutations = new MutationObserver(update); mutations.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion"] });
    reduced.addEventListener("change", update); document.addEventListener("visibilitychange", update); document.addEventListener("editorial-modal", update);
    return () => { observer.disconnect(); mutations.disconnect(); reduced.removeEventListener("change", update); document.removeEventListener("visibilitychange", update); document.removeEventListener("editorial-modal", update); el.pause(); };
  }, [film, hydrated]);
  const visual = <><Image src={image} alt={`${t.interface} ${name}`} fill quality={90} sizes={compact ? "(max-width:700px) 72vw, 24vw" : "(max-width:700px) 90vw, 45vw"}/>{film && <video ref={video} className={styles.teaser} data-editorial-loop={film} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}/>}<span className={styles.mediaHover}>{film ? t.watch : t.explore} <Arrow size={17}/></span></>;
  const tab = decorative ? -1 : undefined;
  if (!film) return <Link className={styles.media} href={href || "#editorial-work"} tabIndex={tab}>{visual}</Link>;
  const data = { ...films[film], ...filmText(film, locale) };
  return <>
    {hydrated ? <button ref={trigger} className={styles.media} type="button" tabIndex={tab} aria-label={`${t.watchFull}: ${name}`} aria-haspopup="dialog" onClick={() => { setOpened(true); dialog.current?.showModal(); document.dispatchEvent(new Event("editorial-modal")); }}>{visual}</button> : <a className={styles.media} href={data.source} tabIndex={tab}>{visual}</a>}
    <dialog ref={dialog} data-lenis-prevent className={styles.filmDialog} aria-label={`${t.filmOf} ${name}`} onClose={() => { full.current?.pause(); document.dispatchEvent(new Event("editorial-modal")); trigger.current?.focus(); }}>
      <div className={styles.filmHeader}><span>{name}</span><button type="button" onClick={() => dialog.current?.close()}>{t.close} <span aria-hidden="true">×</span></button></div>
      <video ref={full} controls playsInline preload="none" poster={opened ? image : undefined} aria-label={data.label} data-vertical={data.mobileSource ? "" : undefined}>{data.mobileSource && <source src={data.mobileSource} media="(max-width: 700px)" type="video/mp4"/>}<source src={data.source} type="video/mp4"/>{data.captions && <track kind="captions" src={data.captions} srcLang="pt-BR" label="Português"/>}{t.noVideo}</video>
      <a className={styles.filmContact} href={data.contact} target="_blank" rel="noopener noreferrer">{data.action} <Arrow size={17}/></a><p>{t.talkNote}</p>
    </dialog>
  </>;
}
