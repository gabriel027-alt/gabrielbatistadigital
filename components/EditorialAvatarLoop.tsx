"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { editorialAvatar, footerMusic } from "@/lib/editorial-avatar";
import styles from "@/app/editorial.module.css";

type Connection = EventTarget & { saveData?: boolean };
type PlaybackUpdate = { data: { isPaused: boolean; playingURI?: string; position?: number; duration?: number } };
type SpotifyController = {
  play(): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  loadUri(uri: string): void;
  addListener(event: "playback_update", listener: (update: PlaybackUpdate) => void): void;
};
type SpotifyApi = {
  createController(element: HTMLElement, options: { uri: string; width: string; height: number }, ready: (controller: SpotifyController) => void): void;
};
declare global {
  interface Window { onSpotifyIframeApiReady?: (api: SpotifyApi) => void }
}

const subscribe = () => () => {};
const API_TIMEOUT = 10000;
const ALBUM_LOAD_DELAY = 1500;  // Time for the player to load an album before it can be told to play.
const TRACK_END_MARGIN = 1200;  // The player reports position once a second, so the last track ends within this window.
let spotifyApi: Promise<SpotifyApi> | null = null;

/** Nothing from Spotify reaches the visitor's browser until they ask for the music. */
function loadSpotifyApi() {
  spotifyApi ??= new Promise<SpotifyApi>((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error("Spotify unavailable")), API_TIMEOUT);
    window.onSpotifyIframeApiReady = api => { window.clearTimeout(timeout); resolve(api); };
    const script = document.createElement("script");
    script.src = footerMusic.api;
    script.async = true;
    script.onerror = () => { window.clearTimeout(timeout); reject(new Error("Spotify unavailable")); };
    document.head.append(script);
  }).catch(error => { spotifyApi = null; throw error; });
  return spotifyApi;
}

/** The poster remains usable without JS, motion, bandwidth or video playback. */
export function EditorialAvatarLoop() {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [musicOpen, setMusicOpen] = useState(false);
  const [musicFailed, setMusicFailed] = useState(false);
  const controller = useRef<SpotifyController | null>(null);
  const opening = useRef(false);
  const playing = useRef(false);
  const pausedByPage = useRef(false);
  const album = useRef(0);
  const changingAlbum = useRef(false);
  const albumTimer = useRef(0);
  const updateMusic = useRef<() => void>(() => {});
  // The music belongs to this scene, so it is only offered where the scene can play.
  const canPlay = useSyncExternalStore(subscribe, () => !matchMedia("(prefers-reduced-motion: reduce)").matches
    && !(navigator as Navigator & { connection?: Connection }).connection?.saveData, () => false);

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
    const inView = () => visible && !document.hidden && !document.querySelector("dialog[open]");
    const allowed = () => inView() && !reduced.matches && !connection?.saveData
      && root?.dataset.editorialMotion !== "off";
    // Music stops when the visitor leaves the scene and returns with them, unless they paused it themselves.
    updateMusic.current = () => {
      const player = controller.current;
      if (!player) return;
      if (!inView() && playing.current) {
        pausedByPage.current = true;
        player.pause();
      } else if (inView() && pausedByPage.current) {
        pausedByPage.current = false;
        player.resume();
      }
    };
    const update = () => {
      const token = ++request;
      updateMusic.current();
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
      window.clearTimeout(albumTimer.current);
      controller.current?.destroy();
      controller.current = null;
    };
  }, []);

  const closeMusic = () => {
    window.clearTimeout(albumTimer.current);
    controller.current?.destroy();
    controller.current = null;
    playing.current = false;
    pausedByPage.current = false;
    changingAlbum.current = false;
    slot.current?.replaceChildren();
    setMusicOpen(false);
  };

  const nextAlbum = () => {
    const player = controller.current;
    if (!player || changingAlbum.current) return;
    changingAlbum.current = true;
    album.current = (album.current + 1) % footerMusic.albums.length;
    player.loadUri(footerMusic.albums[album.current].uri);
    window.clearTimeout(albumTimer.current);
    albumTimer.current = window.setTimeout(() => {
      changingAlbum.current = false;
      controller.current?.play();
    }, ALBUM_LOAD_DELAY);
  };

  const openMusic = async () => {
    if (opening.current || !slot.current) return;
    opening.current = true;
    setMusicFailed(false);
    setMusicOpen(true);
    try {
      const api = await loadSpotifyApi();
      const target = document.createElement("div");
      slot.current.replaceChildren(target);
      api.createController(target, { uri: footerMusic.albums[album.current].uri, width: "100%", height: 80 }, player => {
        controller.current = player;
        player.addListener("playback_update", ({ data }) => {
          playing.current = !data.isPaused;
          // Near the end of the album's last track, move on to the next album.
          const { playingURI, position = 0, duration = 0 } = data;
          if (!data.isPaused && duration > 0 && playingURI === footerMusic.albums[album.current].lastTrack && position >= duration - TRACK_END_MARGIN) nextAlbum();
        });
        // The click that opened the player counts as the request to play. If the browser refuses, its own play button remains.
        player.play();
        opening.current = false;
      });
    } catch {
      opening.current = false;
      setMusicOpen(false);
      setMusicFailed(true);
    }
  };

  return <>
    <div ref={host} className={styles.footerPhoto} data-avatar-scene>
      <Image src={editorialAvatar.poster} alt="Personagem de Gabriel atrás de um monitor, em um estúdio com guitarra e discos na parede" fill sizes="100vw" />
      <video ref={video} className={styles.avatarVideo} data-avatar-loop muted loop playsInline preload="none" aria-hidden="true" disablePictureInPicture
        onPlaying={() => { if (video.current) video.current.dataset.ready = "true"; }}
        onError={() => { if (video.current) delete video.current.dataset.ready; }} />
    </div>
    {footerMusic.enabled && canPlay && <div className={styles.music}>
      <div className={styles.musicButtons}>
        <button type="button" className={styles.musicControl} aria-expanded={musicOpen} data-music-control onClick={() => { if (musicOpen) closeMusic(); else void openMusic(); }}>{musicOpen ? "Fechar player" : `Ouvir ${footerMusic.artist}`}</button>
        {musicOpen && <button type="button" className={styles.musicNext} data-music-next onClick={nextAlbum}>Próximo álbum</button>}
      </div>
      {musicFailed && <p className={styles.musicNote} role="status">O Spotify não respondeu. Tente de novo em instantes.</p>}
      <div ref={slot} className={styles.musicPlayer} data-music-player hidden={!musicOpen} />
    </div>}
  </>;
}
