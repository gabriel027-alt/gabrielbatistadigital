"use client";

import { Arrow } from "@/components/ui/icons";
import type { ProjectFilm } from "@/lib/project-films";

export function ProjectFilmCard({ film, position }: { film: ProjectFilm; position: number }) {
  return <article className={`signature-work-card project-card work-${film.id} signature-video-project`} id={`${film.id}-filme`} data-aura-video-project={film.id === "aura" ? "" : undefined} data-orla-video-project={film.id === "orla" ? "" : undefined}>
    <div className="signature-work-art"><span className="signature-work-number">0{position} / {film.sector}</span>
      <div className="signature-work-window"><div className="signature-window-top"><span aria-hidden="true">● ● ●</span><span>{film.name}</span><span>Filme do projeto</span></div>
        <div className="signature-window-screen"><video data-project-film={film.id} controls playsInline preload="none" poster={film.poster} aria-label={film.label} onPlay={event => {
          const video = event.currentTarget;
          video.closest("section")?.querySelectorAll<HTMLVideoElement>("video[data-project-film]").forEach(other => { if (other !== video && !other.paused) other.pause(); });
        }}><source src={film.source} type="video/mp4"/><track kind="captions" src={film.captions} srcLang="pt-BR" label="Português"/>Seu navegador não reproduz este vídeo.</video></div>
      </div><span className="signature-work-open">Assista à experiência</span>
    </div>
    <div className="signature-work-caption"><div><h3>{film.name}</h3><p>{film.description}</p></div></div>
    <a className="signature-aura-contact" href={film.contact} target="_blank" rel="noopener noreferrer">{film.action}<Arrow size={17}/></a>
    <p className="signature-aura-contact-note">Converse com Gabriel pelo WhatsApp.</p>
  </article>;
}
