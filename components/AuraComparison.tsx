"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import styles from "@/app/propostas/aura/comparison.module.css";

export function AuraComparison() {
  const [position,setPosition]=useState(50);
  const id=useId();
  const sectionRef=useRef<HTMLElement>(null);
  const current=useRef(50), manual=useRef(false), dragging=useRef(false), frame=useRef(0);
  useEffect(()=>{
    const section=sectionRef.current, parent=section?.closest<HTMLElement>("[data-motion]");
    if(!section || !parent) return;
    const media=matchMedia("(prefers-reduced-motion: reduce)");
    let target=50, enabled=false;
    const stop=()=>{cancelAnimationFrame(frame.current);frame.current=0;};
    const tick=()=>{
      frame.current=0;
      if(!enabled || manual.current || dragging.current) return;
      const difference=target-current.current;
      current.current=Math.abs(difference)<.05 ? target : current.current+difference*.2;
      setPosition(Math.round(current.current*10)/10);
      if(current.current!==target) frame.current=requestAnimationFrame(tick);
    };
    const update=()=>{
      if(!enabled || manual.current || dragging.current) return;
      const travel=section.offsetHeight-innerHeight;
      const progress=Math.max(0,Math.min(1,-section.getBoundingClientRect().top/Math.max(1,travel)));
      const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
      target=progress<.4 ? 50*(1-ease(progress/.3)) : 100*ease((progress-.4)/.5);
      if(!frame.current) frame.current=requestAnimationFrame(tick);
    };
    const onScroll=()=>{if(dragging.current)return;manual.current=false;update();};
    const release=()=>{dragging.current=false;};
    const sync=()=>{
      enabled=!media.matches && parent.dataset.motion!=="off";
      if(enabled){section.dataset.comparisonAnimated="true";update();}
      else {stop();delete section.dataset.comparisonAnimated;}
    };
    const resize=new ResizeObserver(update);resize.observe(section);
    const motion=new MutationObserver(sync);motion.observe(parent,{attributes:true,attributeFilter:["data-motion"]});
    addEventListener("pointerup",release);addEventListener("pointercancel",release);
    media.addEventListener("change",sync);addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",update);sync();
    return()=>{removeEventListener("pointerup",release);removeEventListener("pointercancel",release);stop();resize.disconnect();motion.disconnect();media.removeEventListener("change",sync);removeEventListener("scroll",onScroll);removeEventListener("resize",update);delete section.dataset.comparisonAnimated;};
  },[]);
  const adjust=(value:number)=>{manual.current=true;cancelAnimationFrame(frame.current);frame.current=0;current.current=value;setPosition(value);};
  return <section id="aura-comparacao" ref={sectionRef} className={styles.section} aria-labelledby={`${id}-title`} data-aura-comparator>
    <div className={styles.stage} data-comparison-stage>
    <div className={styles.copy}>
      <p className={styles.eyebrow}>O detalhe encontra o todo</p>
      <h2 id={`${id}-title`}>Um outro olhar.<br/>A mesma expressão.</h2>
      <p>Deslize para observar como volumes e contornos participam da expressão do rosto.</p>
      <p className={styles.disclosure}>Comparação ilustrativa com imagens geradas. Não representa resultados clínicos.</p>
    </div>
    <div>
      <div className={styles.picture}>
        <Image src="/images/aura-sequence/continuous-before.webp" alt="Versão anterior ilustrativa da personagem" width={1024} height={1536} unoptimized/>
        <div className={styles.after} style={{clipPath:`inset(0 ${100-position}% 0 0)`}} data-comparison-reveal>
          <Image src="/images/aura-sequence/continuous-portrait.webp" alt="Versão final ilustrativa da mesma personagem" width={1024} height={1536} unoptimized/>
        </div>
        <span className={styles.afterLabel} style={{visibility:position>1 ? "visible" : "hidden"}}>Depois</span><span className={styles.beforeLabel} style={{visibility:position<99 ? "visible" : "hidden"}}>Antes</span>
        <div className={styles.divider} style={{left:`${position}%`}} aria-hidden="true"><span>↔</span></div>
        <input id={id} className={styles.slider} type="range" min="0" max="100" step="0.1" value={position} onChange={e=>adjust(Number(e.target.value))} onPointerDown={()=>{dragging.current=true;manual.current=true;cancelAnimationFrame(frame.current);frame.current=0;}} onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;}} onBlur={()=>{dragging.current=false;}} aria-label="Comparar antes e depois" aria-valuetext={`${position}% da versão depois visível`} />
      </div>
      <label className={styles.hint} htmlFor={id}>Continue o scroll ou ajuste a linha com o mouse, toque ou teclado.</label>
      <noscript><p className={styles.hint}>Comparação estática: depois à esquerda, antes à direita.</p></noscript>
    </div>
    </div>
  </section>;
}
