"use client";
import { useState } from "react";
import Image from "next/image";
import { conceptDetails, type ConceptTheme } from "@/lib/concept-content";
export function ConceptExplorer({ theme }: { theme: ConceptTheme }) {
  const [active, setActive] = useState(0);
  const data = conceptDetails[theme];
  const item = data.items[active];
  return <section className="concept-explorer" aria-labelledby="explorer-title">
    <div className="explorer-photo"><Image key={item.image} src={`/images/concepts/${item.image}.webp`} alt={item.subtitle} fill sizes="(max-width: 900px) 90vw, 50vw" /></div>
    <div className="explorer-copy"><p className="eyebrow">{data.label}</p><h2 id="explorer-title">{data.section}</h2>
      <div className="explorer-tabs" role="tablist" aria-label="Explorar o conceito">{data.items.map((entry, i) => <button key={entry.title} role="tab" type="button" id={`explorer-tab-${i}`} aria-selected={active === i} aria-controls="explorer-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
        let next = i;
        if (e.key === "ArrowRight") next = (i + 1) % 3;
        else if (e.key === "ArrowLeft") next = (i + 2) % 3;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = 2;
        else return;
        e.preventDefault(); setActive(next); document.getElementById(`explorer-tab-${next}`)?.focus();
      }}>{entry.title}</button>)}</div>
      <div id="explorer-panel" className="explorer-panel" role="tabpanel" aria-labelledby={`explorer-tab-${active}`} tabIndex={0}>
        <div className="explorer-item-copy" key={active}><h3>{item.subtitle}</h3><p>{item.description}</p><dl className="concept-facts">{item.facts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>
      </div>
      <small>DEMONSTRAÇÃO CONCEITUAL · MARCA E IMAGENS FICTÍCIAS</small>
    </div>
  </section>;
}
