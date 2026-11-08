"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { editorialAvatar } from "@/lib/editorial-avatar";
import styles from "@/app/propostas/portfolio-editorial/editorial.module.css";

type Connection = EventTarget & { saveData?: boolean };

/** The poster remains usable without JS, motion, bandwidth or video playback. */
export function EditorialAvatarLoop() {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = host.current;
    const film = video.current;
    if (!node || !film) return;
    const root = node.closest<HTMLElement>("[data-editorial]");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    let visible = false;
    let disposed = false;
    let request = 0;
    const allowed = () => visible && !reduced.matches && !connection?.saveData
      && !document.hidden && root?.dataset.editorialMotion !== "off"
      && !document.querySelector("dialog[open]");
    const update = () => {
      const token = ++request;
      if (!allowed()) { film.pause(); return; }
      if (!film.getAttribute("src")) film.src = editorialAvatar.src;
      void film.play().then(() => {
        if (disposed || (token !== request && !allowed())) film.pause();
      }).catch(() => { /* The poster is already present for playback failures. */ });
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      update();
    }, { threshold: .15 });
    observer.observe(node);
    const mutations = new MutationObserver(update);
    if (root) mutations.observe(root, { attributes: true, attributeFilter: ["data-editorial-motion"] });
    reduced.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    document.addEventListener("visibilitychange", update);
    document.addEventListener("editorial-modal", update);
    return () => {
      disposed = true;
      observer.disconnect(); mutations.disconnect();
      reduced.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
      document.removeEventListener("visibilitychange", update);
      document.removeEventListener("editorial-modal", update);
      film.pause();
    };
  }, []);

  return <div ref={host} className={styles.footerPhoto} data-avatar-scene>
    <Image src={editorialAvatar.poster} alt="Personagem de Gabriel com AirPods em um estúdio com guitarra e discos de rock" fill sizes="100vw" />
    <video ref={video} className={styles.avatarVideo} data-avatar-loop muted loop playsInline preload="none" aria-hidden="true" disablePictureInPicture
      onPlaying={() => { if (video.current) video.current.dataset.ready = "true"; }}
      onError={() => { if (video.current) delete video.current.dataset.ready; }} />
  </div>;
}
