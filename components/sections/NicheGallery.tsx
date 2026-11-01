"use client";
import { Arrow, ArrowLeft } from "@/components/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { modelPreviewSizes } from "@/lib/model-preview-sizes";
import { nicheModels } from "@/lib/models";
const groups = ["Todos", "Jurídico", "Saúde", "Patrimônio", "Empresas", "Experiências"];
export function NicheGallery() {
  const [group, setGroup] = useState("Todos");
  const viewport = useRef<HTMLDivElement>(null);
  const models = nicheModels.filter(m => group === "Todos" || m.group === group);
  function move(direction: number) { const el = viewport.current; if (el) el.scrollBy({ left: direction * el.clientWidth * .85, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "paused" ? "instant" : "smooth" }); }
  return <section id="modelos" className="niche-gallery" aria-labelledby="niche-heading"><div className="shell">
    <div className="niche-gallery-heading"><div><p className="eyebrow">ENCONTRE UMA DIREÇÃO PARA O SEU NEGÓCIO</p><h2 id="niche-heading">Veja o que um site<br /><span className="serif">pode comunicar.</span></h2></div><p>17 modelos por nicho, além dos três estudos de portfólio.<br />Abra uma demonstração e explore o conteúdo, o visual e as interações.</p></div>
    <div className="niche-gallery-toolbar"><div className="niche-filters" role="group" aria-label="Filtrar modelos por setor">{groups.map(item => <button key={item} type="button" aria-pressed={group === item} onClick={() => { setGroup(item); if (viewport.current) viewport.current.scrollLeft = 0; }}>{item}</button>)}</div><div className="niche-arrows"><button type="button" aria-label="Ver modelos anteriores" onClick={() => move(-1)}><ArrowLeft size={16} /></button><button type="button" aria-label="Ver próximos modelos" onClick={() => move(1)}><ArrowLeft size={16} className="niche-arrow-next" /></button></div></div>
    <p className="niche-count" role="status">{models.length} {models.length === 1 ? "modelo disponível" : "modelos disponíveis"}. Role dentro de cada prévia para percorrer a página.</p>
    <div className="niche-gallery-track" ref={viewport}>{models.map(model => <article key={model.slug} className={`niche-preview-card accent-${model.style}`}>
      <div className="niche-preview-top"><span>{model.niche}</span><Arrow size={14} aria-hidden="true" /></div>
      <div className="niche-preview-window" tabIndex={0} role="region" aria-label={`Prévia rolável de ${model.brand}`}><Image src={`/images/models/previews-branded/${model.slug}.webp`} alt={`Captura da demonstração ${model.brand}, com apresentação, serviços e etapas de atendimento`} width={modelPreviewSizes[model.slug].width} height={modelPreviewSizes[model.slug].height} sizes="(max-width: 600px) 80vw, (max-width: 1000px) 45vw, 30vw" /></div>
      <div className="niche-preview-caption"><h3>{model.brand}</h3><p>{model.eyebrow.toLocaleLowerCase("pt-BR")}</p><Link href={`/modelos/${model.slug}`}>Abrir demonstração <Arrow size={14} aria-hidden="true" /></Link></div>
    </article>)}</div>
    <p className="niche-gallery-note">Marcas fictícias e imagens geradas. Modelos de referência para um projeto próprio; não representam clientes ou resultados comerciais.</p>
  </div></section>;
}
