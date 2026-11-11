"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/icons";
import { concepts, previewVersion } from "@/lib/content";
import { nicheModels } from "@/lib/models";
import { projectFilms } from "@/lib/project-films";
import { ProjectFilmCard } from "@/components/ProjectFilmCard";
import { modelPreviewSizes } from "@/lib/model-preview-sizes";
const selected = [
  { name:"Vanguard", sector:"ARQUITETURA", slug:"vanguard", concept:true, line:"Espaço para uma outra perspectiva.",color:"stone" },
  { name:"Entre", sector:"PSICOLOGIA", slug:"psicologia", concept:false, line:"Uma presença que sabe acolher.",color:"sand" },
  { name:"Chronos Atelier", sector:"RELOJOARIA", slug:"chronos-atelier", concept:true, line:"O tempo merece um outro ritmo.",color:"watch" },
  { name:"Orla", sector:"RESIDÊNCIAS", slug:"imoveis", concept:false, line:"O extraordinário está nos detalhes.",color:"sea" },
  { name:"Aura", sector:"HARMONIZAÇÃO FACIAL", slug:"aura-aesthetics", concept:true, line:"Expressão, movimento e identidade.",color:"aura" },
  { name:"Raiz", sector:"DIREITO DO AGRO", slug:"agro", concept:false, line:"Uma identidade conectada ao campo.",color:"field" },
];
const groups=["Todos","Jurídico","Saúde","Patrimônio","Empresas","Experiências"];
export function SelectedWork(){
 const [group,setGroup]=useState("Todos");
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  const section=root.current;if(!section)return;
  const cards=[...section.querySelectorAll<HTMLElement>(".signature-work-card")];
  const visible=new Set<HTMLElement>();let frame=0;
  const media=matchMedia("(prefers-reduced-motion: reduce)");
  const update=()=>{frame=0;visible.forEach(card=>{if(media.matches){card.style.setProperty("--work-shift","0px");return}if(document.documentElement.dataset.motion==="paused")return;const box=card.getBoundingClientRect();card.style.setProperty("--work-shift",`${Math.max(-22,Math.min(22,(innerHeight*.5-box.top)*.05))}px`)});};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)visible.add(e.target as HTMLElement);else visible.delete(e.target as HTMLElement)});schedule()});cards.forEach(c=>observer.observe(c));
  addEventListener("scroll",schedule,{passive:true});media.addEventListener("change",schedule);addEventListener("atelier-motion",schedule);
  return()=>{observer.disconnect();cancelAnimationFrame(frame);removeEventListener("scroll",schedule);media.removeEventListener("change",schedule);removeEventListener("atelier-motion",schedule)};
 },[]);
 return <section id="portfolio" className="signature-work" ref={root}><div className="sig-shell"><div className="signature-work-heading"><div><p className="signature-kicker">IDEIAS COM IDENTIDADE PRÓPRIA</p><h2>O trabalho<br /><em>fala primeiro.</em></h2></div><p>Direções diferentes. O mesmo olhar para<br />a marca, o conteúdo e a experiência.<br /><a href="#modelos">Explorar todos os nichos <Arrow size={16}/></a></p></div>
 <div className="signature-work-grid">{selected.map((work,i)=>{const image=work.concept?`/images/screens/${previewVersion}/${work.slug}-desktop.webp`:`/images/models/previews-branded/${work.slug}.webp`;const href=work.concept?`/conceitos/${work.slug}`:`/modelos/${work.slug}`;const film=work.slug==="aura-aesthetics"?projectFilms.aura:work.slug==="imoveis"?projectFilms.orla:null;if(film)return <ProjectFilmCard key={work.slug} film={film} position={i+1}/>;return <article key={work.slug} className={`signature-work-card work-${work.color}${work.concept?" project-card":""}`}><Link href={href} className="signature-work-link"><div className="signature-work-art"><span className="signature-work-number">0{i+1} / {work.sector}</span><div className="signature-work-window"><div className="signature-window-top"><span aria-hidden="true">● ● ●</span><span>{work.name}</span><Arrow size={12}/></div><div className="signature-window-screen"><Image className="project-cover" src={image} alt={`Interface do projeto ${work.name}`} width={work.concept?1200:modelPreviewSizes[work.slug].width} height={work.concept?2200:modelPreviewSizes[work.slug].height} sizes="(max-width:760px) 85vw, 42vw" /></div></div><span className="signature-work-open">Explorar projeto <Arrow size={17}/></span></div><div className="signature-work-caption"><div><h3>{work.name}</h3><p>{work.line}</p></div><Arrow size={26}/></div></Link></article>})}</div>
 <details id="modelos" className="signature-catalog"><summary><span>Outros universos.<em>Encontre o seu.</em></span><span>20 PROJETOS PARA EXPLORAR <b aria-hidden="true">+</b></span></summary><div className="signature-catalog-content"><div className="niche-filters" role="group" aria-label="Filtrar modelos por setor">{groups.map(g=><button key={g} type="button" aria-pressed={g===group} onClick={()=>setGroup(g)}>{g}</button>)}</div><div className="signature-catalog-grid">{nicheModels.filter(m=>group==="Todos"||m.group===group).map(model=><Link className="niche-preview-card" key={model.slug} href={model.slug==="imoveis"?"#orla-filme":`/modelos/${model.slug}`}><div><Image src={`/images/models/people/${model.slug}.webp`} alt={`Direção visual de ${model.brand}`} width={800} height={450} sizes="(max-width:760px) 85vw, 28vw" /></div><span>{model.niche}</span><h3>{model.brand}<Arrow size={18}/></h3></Link>)}{group==="Todos"&&concepts.map(model=><Link className="signature-concept-index" key={model.slug} href={model.slug==="aura-aesthetics" ? "#aura-filme" : `/conceitos/${model.slug}`}><span>{model.slug==="aura-aesthetics" ? "Filme do projeto" : model.category}</span><h3>{model.name}<Arrow size={18}/></h3></Link>)}</div></div></details>
 </div></section>
}
