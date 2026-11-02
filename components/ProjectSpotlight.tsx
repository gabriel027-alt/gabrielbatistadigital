"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/icons";
import { nicheModels } from "@/lib/models";
import { modelPreviewSizes } from "@/lib/model-preview-sizes";
import { modelBrands } from "@/lib/model-brands";

const selections = [
  { slug: "patrimonio", label: "Confiança", title: "O peso certo para cada palavra.", text: "Na advocacia patrimonial, a interface precisa transmitir discrição. Azul profundo, tipografia editorial e caminhos claros para entender o atendimento.", detail: "HIERARQUIA EDITORIAL / SERVIÇOS / JORNADA DE CONTATO" },
  { slug: "psicologia", label: "Proximidade", title: "Uma presença que sabe acolher.", text: "Para a psicologia, o ritmo muda. Tons naturais, espaços de respiro e uma apresentação que explica o atendimento antes de convidar à conversa.", detail: "TONS NATURAIS / LEITURA CALMA / ATENDIMENTO" },
  { slug: "imoveis", label: "Desejo", title: "O espaço também comunica.", text: "Na apresentação de residências, a fotografia conduz. Informações sobre o imóvel e a região organizam a descoberta, com uma navegação que deixa o espaço respirar.", detail: "FOTOGRAFIA / CURADORIA / EXPLORAÇÃO" },
];
export function ProjectSpotlight() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    function update() {
      frame = 0;
      if (!el) return;
      if (media.matches) { el.style.setProperty("--showcase-progress", "0"); return; }
      if (document.documentElement.dataset.motion === "paused") return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight - rect.top) / (innerHeight + rect.height)));
      el.style.setProperty("--showcase-progress", progress.toFixed(4));
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); media.removeEventListener("change", schedule); };
  }, []);
  const item = selections[active];
  const model = nicheModels.find(m => m.slug === item.slug)!;
  const size = modelPreviewSizes[item.slug];
  return <div className="project-spotlight" ref={root}>
    <div className="spotlight-intro"><span className="spotlight-index">01 — DIREÇÃO APLICADA</span><p>O mesmo cuidado.<br /><span>Uma expressão para cada negócio.</span></p><span className="spotlight-annotation">DA IDENTIDADE À INTERFACE <Arrow size={20} /></span></div>
    <div className="spotlight-selector" role="group" aria-label="Explorar direções de marca">{selections.map((choice, index) => <button key={choice.slug} type="button" aria-pressed={index === active} onClick={() => setActive(index)}><span>0{index + 1}</span>{choice.label}<Arrow size={17} /></button>)}</div>
    <div className={`spotlight-stage spotlight-${item.slug}`}>
      <div className="spotlight-copy" key={`copy-${item.slug}`}><p className="spotlight-sector">{model.niche} / ESTUDO AUTORAL</p><h3>{item.title}</h3><p>{item.text}</p><span className="spotlight-detail">{item.detail}</span><Link href={`/modelos/${item.slug}`}>Explorar {model.brand}<Arrow size={18} /></Link></div>
      <div className="spotlight-art" key={item.slug}>
        <div className="spotlight-scene"><Image src={`/images/models/people/${item.slug}.webp`} alt={modelBrands[item.slug].humanAlt} fill sizes="(max-width: 760px) 90vw, 55vw" /></div>
        <div className="spotlight-browser"><div className="spotlight-browser-bar"><i aria-hidden="true">● ● ●</i><span>{model.brand}</span><span>↗</span></div><div className="spotlight-screen"><Image src={`/images/models/previews-branded/${item.slug}.webp`} alt={`Interface completa da demonstração ${model.brand}`} width={size.width} height={size.height} sizes="(max-width: 760px) 70vw, 37vw" /></div></div>
        <span className="spotlight-art-caption">MARCA + CONTEÚDO + EXPERIÊNCIA</span>
      </div>
    </div>
    <div className="spotlight-foot"><span>Três direções em destaque. Explore os outros nichos abaixo.</span><span>DEMONSTRAÇÕES · MARCAS E PERSONAGENS FICTÍCIOS</span></div>
  </div>;
}
