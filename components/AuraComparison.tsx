"use client";

import Image from "next/image";
import { useId, useState } from "react";
import styles from "@/app/propostas/aura/comparison.module.css";

export function AuraComparison() {
  const [position,setPosition]=useState(50);
  const id=useId();
  return <section className={styles.section} aria-labelledby={`${id}-title`} data-aura-comparator>
    <div className={styles.copy}>
      <p className={styles.eyebrow}>O detalhe encontra o todo</p>
      <h2 id={`${id}-title`}>Um outro olhar.<br/>A mesma expressão.</h2>
      <p>Arraste para observar as duas versões da personagem, no mesmo enquadramento e sob a mesma luz.</p>
      <p className={styles.disclosure}>Simulação ilustrativa com imagens geradas. Não representa uma paciente nem prevê resultado clínico.</p>
    </div>
    <div>
      <div className={styles.picture}>
        <Image src="/images/aura-sequence/continuous-before.webp" alt="Versão anterior ilustrativa da personagem" width={1024} height={1536} unoptimized/>
        <div className={styles.after} style={{clipPath:`inset(0 ${100-position}% 0 0)`}} data-comparison-reveal>
          <Image src="/images/aura-sequence/continuous-portrait.webp" alt="Versão final ilustrativa da mesma personagem" width={1024} height={1536} unoptimized/>
        </div>
        <span className={styles.afterLabel}>Depois</span><span className={styles.beforeLabel}>Antes</span>
        <div className={styles.divider} style={{left:`${position}%`}} aria-hidden="true"><span>↔</span></div>
        <input id={id} className={styles.slider} type="range" min="0" max="100" value={position} onChange={e=>setPosition(Number(e.target.value))} aria-label="Comparar antes e depois" aria-valuetext={`${position}% da versão depois visível`} />
      </div>
      <label className={styles.hint} htmlFor={id}>Arraste a linha ou use as setas do teclado.</label>
      <noscript><p className={styles.hint}>Comparação estática: depois à esquerda, antes à direita.</p></noscript>
    </div>
  </section>;
}
