"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "@/app/propostas/aura/photo-sequence.module.css";

const chapters = [
  { key: "portrait", title: "A expressão vem primeiro.", copy: "Antes de olhar para um detalhe, é preciso entender o conjunto.", x:.5, y:.5, zoom:1.04, side:.72 },
  { key: "malar", title: "Zigomático.", copy: "Projeção e volume da região malar participam da leitura do terço médio. A relação com os demais traços faz parte da avaliação.", x:.73, y:.55, zoom:2.45, side:.72 },
  { key: "lips", title: "Lábios.", copy: "Contorno, proporção e movimento são considerados juntos. O objetivo precisa respeitar a expressão e o que você deseja preservar.", x:.5, y:.66, zoom:2.65, side:.28 },
  { key: "chin", title: "Queixo e mandíbula.", copy: "O queixo e a linha mandibular se relacionam com as proporções do rosto. Possibilidades e limites dependem da avaliação individual.", x:.5, y:.78, zoom:2.45, side:.72 },
  { key: "nose", title: "A relação com o nariz.", copy: "Nariz, lábios e queixo são lidos em conjunto. Nem toda mudança de forma é indicada ou possível com preenchimento.", x:.5, y:.56, zoom:2.55, side:.28 },
  { key: "portrait", title: "O detalhe encontra o todo.", copy: "Um planejamento individual considera as relações entre os traços, a sua expressão e as suas expectativas.", x:.5, y:.5, zoom:1.04, side:.72 },
];

export function AuraPhotoSequence() {
  const ref = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const section = ref.current, canvas = canvasRef.current, parent = section?.closest<HTMLElement>("[data-motion]");
    if (!section || !canvas || !parent) return;
    let disposed = false, near = false, pending = false;
    let revert: (() => void) | undefined;
    async function sync() {
      if (parent!.dataset.motion === "off") { revert?.(); revert = undefined; return; }
      if (!near || pending || revert || disposed) return;
      pending = true;
      try {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        const source = section!.querySelector<HTMLImageElement>("[data-camera-source]");
        if (!source) return;
        source.loading = "eager";
        await source.decode();
        if (disposed || parent!.dataset.motion === "off" || !source.naturalWidth || source.dataset.cameraFallback) return;
        const texture = document.createElement("canvas");
        texture.width = source.naturalWidth; texture.height = source.naturalHeight;
        const buffer = texture.getContext("2d"), context = canvas!.getContext("2d");
        if (!buffer || !context) return;
        buffer.drawImage(source,0,0);
        // Feather only the outer studio background so the portrait has no visible rectangular edge.
        buffer.globalCompositeOperation = "destination-in";
        const horizontal = buffer.createLinearGradient(0,0,texture.width,0);
        horizontal.addColorStop(0,"transparent"); horizontal.addColorStop(.09,"black"); horizontal.addColorStop(.91,"black"); horizontal.addColorStop(1,"transparent");
        buffer.fillStyle = horizontal; buffer.fillRect(0,0,texture.width,texture.height);
        const vertical = buffer.createLinearGradient(0,0,0,texture.height);
        vertical.addColorStop(0,"transparent"); vertical.addColorStop(.025,"black"); vertical.addColorStop(.96,"black"); vertical.addColorStop(1,"transparent");
        buffer.fillStyle = vertical; buffer.fillRect(0,0,texture.width,texture.height);
        // Each region uses a feathered patch; eyes, hair and other identity cues stay on the original master.
        const before = new window.Image();
        before.src = "/images/aura-sequence/continuous-before.webp";
        const patches: HTMLCanvasElement[] = [];
        try {
          await before.decode();
          const regions = [ [[.27,.55,.18,.11],[.74,.55,.18,.11]], [[.5,.66,.19,.075]], [[.5,.78,.29,.11]], [[.5,.55,.12,.12]] ];
          regions.forEach(ellipses => {
            const patch = document.createElement("canvas"); patch.width=texture.width; patch.height=texture.height;
            const ctx=patch.getContext("2d")!;
            ellipses.forEach(([cx,cy,rx,ry]) => {
              ctx.save(); ctx.translate(cx*patch.width,cy*patch.height); ctx.scale(rx*patch.width,ry*patch.height);
              const fade=ctx.createRadialGradient(0,0,.48,0,0,1); fade.addColorStop(0,"black"); fade.addColorStop(1,"transparent");
              ctx.fillStyle=fade; ctx.fillRect(-1,-1,2,2); ctx.restore();
            });
            ctx.globalCompositeOperation="source-in"; ctx.drawImage(before,0,0,patch.width,patch.height); patches.push(patch);
          });
        } catch { /* A missing comparison keeps the original photographic chapter usable. */ }
        if (disposed || parent!.dataset.motion === "off") return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia(); revert = () => media.revert();
        media.add("(min-height: 700px) and (prefers-reduced-motion: no-preference)", () => {
          section!.dataset.sequenceAnimated = "true";
          const stage = section!.querySelector<HTMLElement>("[data-camera-stage]")!;
          const notes = Array.from(section!.querySelectorAll<HTMLElement>("[data-photo-copy]"));
          const state = { progress:0 };
          let width = 1, height = 1, previousProgress = -1;
          const draw = () => {
            const progress = Math.round(Math.max(0,Math.min(1,state.progress))*10000)/10000;
            if (previousProgress === progress) return;
            previousProgress = progress;
            const frame = Math.round(progress*239);
            // Camera arrives first, holds while the local comparison develops, then travels again.
            const stops = [0,.14,.34,.54,.74,.96];
            const departures = [.06,.26,.46,.66,.86,1];
            let index=0;
            while(index<5 && progress>=stops[index+1]) index++;
            const next=Math.min(5,index+1);
            const fraction=next===index ? 0 : Math.max(0,Math.min(1,(progress-departures[index])/(stops[next]-departures[index])));
            const t=fraction*fraction*fraction*(fraction*(fraction*6-15)+10);
            const a = chapters[index], b = chapters[next];
            const mix = (start:number,end:number) => start+(end-start)*t;
            const mobile = width<900, pictureHeight = mobile ? height*.64 : height;
            const zoom = mix(a.zoom,b.zoom);
            const scale = pictureHeight/texture.height*zoom;
            const anchor = mobile ? .5 : mix(a.side,b.side);
            const targetY = mobile ? pictureHeight*.49 : height*.48;
            const x = width*anchor-mix(a.x,b.x)*texture.width*scale;
            const y = targetY-mix(a.y,b.y)*texture.height*scale;
            context!.clearRect(0,0,width,height);
            context!.drawImage(texture,x,y,texture.width*scale,texture.height*scale);
            const reveals=patches.map((patch,i)=>{
              const start=stops[i+1]+.025, end=departures[i+1]-.02;
              const value=Math.max(0,Math.min(1,(progress-start)/(end-start)));
              const reveal=value*value*(3-2*value);
              if(reveal<1) {
                context!.globalAlpha=1-reveal;
                context!.drawImage(patch,x,y,texture.width*scale,texture.height*scale);
              }
              return reveal;
            });
            context!.globalAlpha=1;
            canvas!.dataset.comparison=reveals.map(value=>value.toFixed(3)).join(",");
            // A soft, moving edge maintains room for the copy while the same photograph travels.
            context!.globalCompositeOperation = "destination-in";
            const mask = context!.createLinearGradient(width*(anchor-.50),0,width*(anchor+.50),0);
            mask.addColorStop(0,"transparent"); mask.addColorStop(.17,"black"); mask.addColorStop(.83,"black"); mask.addColorStop(1,"transparent");
            context!.fillStyle = mask; context!.fillRect(0,0,width,height);
            context!.globalCompositeOperation = "source-over";
            const active = fraction>.5 ? next : index;
            notes.forEach((note,i) => {
              // Copy switches only after the camera has moved toward its new focus.
              note.style.visibility = i===active ? "visible" : "hidden";
              note.style.opacity = i===active ? String(1-.65*Math.sin(Math.PI*fraction)) : "0";
              note.dataset.active = String(i===active);
              const label=note.querySelector<HTMLElement>("[data-comparison-label]");
              if(label) {
                const value=reveals[i-1];
                label.textContent=value===undefined ? "Comparação indisponível" : value<.02 ? "Antes · simulação" : value>.98 ? "Depois · simulação" : "Antes → Depois · simulação";
              }
              if (mobile) { note.style.left = ""; note.style.right = ""; }
              else { note.style.left = chapters[i].side>.5 ? "4%" : "64%"; note.style.right = "auto"; }
            });
            canvas!.dataset.frame = String(frame);
            canvas!.dataset.camera = `${mix(a.x,b.x).toFixed(4)},${mix(a.y,b.y).toFixed(4)},${zoom.toFixed(4)},${anchor.toFixed(4)}`;
          };
          const resize = new ResizeObserver(() => {
            width = stage.clientWidth; height = stage.clientHeight;
            const dpr = Math.min(devicePixelRatio,1.5);
            canvas!.width = Math.round(width*dpr); canvas!.height = Math.round(height*dpr);
            context!.setTransform(dpr,0,0,dpr,0,0); context!.imageSmoothingQuality = "high";
            previousProgress = -1; draw();
          });
          resize.observe(stage);
          gsap.to(state,{progress:1,ease:"none",onUpdate:draw,scrollTrigger:{trigger:section!,start:"top top",end:"bottom bottom",scrub:.38,invalidateOnRefresh:true}});
          ScrollTrigger.refresh();
          return () => { resize.disconnect(); notes.forEach(note=>{note.removeAttribute("style"); delete note.dataset.active;}); delete section!.dataset.sequenceAnimated; };
        },section!);
      } catch { revert?.(); revert = undefined; delete section!.dataset.sequenceAnimated; } finally { pending = false; }
    }
    const observe = new IntersectionObserver(entries => { near = entries.some(entry=>entry.isIntersecting); if (near) void sync(); },{rootMargin:"700px"}); observe.observe(section);
    const motion = new MutationObserver(()=>{void sync();}); motion.observe(parent,{attributes:true,attributeFilter:["data-motion"]});
    return () => { disposed = true; observe.disconnect(); motion.disconnect(); revert?.(); delete section.dataset.sequenceAnimated; };
  },[]);
  return <section ref={ref} id="aura-olhar" className={styles.track} data-photo-track aria-labelledby="aura-photo-title">
    <div className={styles.stage} data-camera-stage>
      <header className={styles.heading}><h2 id="aura-photo-title">O seu rosto. Por inteiro.</h2><span>Proporção. Expressão. Identidade.</span></header>
      <figure className={styles.source}><Image data-camera-source src="/images/aura-sequence/continuous-portrait.webp" alt="Personagem feminina gerada, usada como base fotográfica contínua para os enquadramentos faciais" width={1024} height={1536} unoptimized onError={event=>{
        const image=event.currentTarget;
        if (!image.dataset.cameraFallback) { image.dataset.cameraFallback="true"; image.src="/images/aura-sequence/portrait.webp"; }
      }}/></figure>
      <canvas ref={canvasRef} className={styles.canvas} data-photo-camera aria-hidden="true"/>
      <div className={styles.notes}>{chapters.map((chapter,index)=><article key={index} className={styles.copy} data-photo-copy data-region={chapter.key}>{index>0 && index<5 && <span className={styles.comparisonLabel} data-comparison-label>Antes → Depois · simulação</span>}<h3>{chapter.title}</h3><p>{chapter.copy}</p>{index>0 && index<5 && <details className={styles.staticComparison}><summary>Ver comparação ilustrativa</summary><div><figure><Image src="/images/aura-sequence/continuous-before.webp" width={1024} height={1536} alt="Antes — variação digital ilustrativa da personagem" unoptimized/><figcaption>Antes · imagem gerada</figcaption></figure><figure><Image src="/images/aura-sequence/continuous-portrait.webp" width={1024} height={1536} alt="Depois — variação digital ilustrativa, sem previsão de resultado clínico" unoptimized/><figcaption>Depois · imagem gerada</figcaption></figure></div></details>}</article>)}</div>
      <footer className={styles.foot}><span>Simulação ilustrativa · Imagens geradas · Não prevê resultado clínico</span><a href="#aura-avaliacao">Entender a avaliação ↓</a></footer>
    </div>
  </section>;
}
