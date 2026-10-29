"use client";
import { useState } from "react";
import Image from "next/image";
type Theme = "chronos" | "vanguard" | "aura";
const content = {
  chronos: { title: "O detalhe muda tudo.", intro: "Explore a direção de uma peça conceitual.", tabs: ["Mostrador", "Movimento", "Acabamento"], copy: ["Geometria, luz e marcações precisas. O mostrador organiza o tempo com uma composição silenciosa.", "Uma leitura visual da engenharia relojoeira. Ritmo, precisão e proporção orientam este estudo de design.", "O contraste entre metal escovado e couro cria uma experiência tátil, traduzida para a tela."], position: ["50% 45%", "80% 60%", "15% 25%"] },
  vanguard: { title: "Um espaço. Três perspectivas.", intro: "Observe como luz, matéria e paisagem constroem a experiência.", tabs: ["Luz", "Matéria", "Paisagem"], copy: ["A abertura do volume enquadra a luz e transforma a passagem das horas em parte da arquitetura.", "Concreto, pedra e vidro articulam uma composição de superfícies, peso e transparência.", "Água e vegetação aproximam interior e exterior. Um exercício visual de permanência e respiro."], position: ["70% 20%", "90% 30%", "10% 85%"] },
  aura: { title: "Uma experiência que acolhe.", intro: "Explore os princípios desta direção de marca.", tabs: ["Escuta", "Harmonia", "Presença"], copy: ["Informação clara e uma conversa cuidadosa são o ponto de partida desta experiência digital conceitual.", "A combinação de texturas naturais, luz e espaço traduz equilíbrio sem excessos.", "Uma jornada simples, com leitura confortável e próximos passos compreensíveis. Este conceito não oferece atendimento médico."], position: ["70% 50%", "25% 40%", "50% 80%"] },
} as const;
export function ConceptExplorer({ theme }: { theme: Theme }) {
  const [active, setActive] = useState(0);
  const c = content[theme];
  return <section className="concept-explorer" aria-labelledby="explorer-title">
    <div className="explorer-photo"><Image src={`/images/concepts/${theme}.webp`} alt={`Detalhe visual do conceito ${theme}`} fill sizes="(max-width: 900px) 90vw, 50vw" style={{ objectPosition: c.position[active] }} /></div>
    <div className="explorer-copy"><p className="eyebrow">UM OLHAR MAIS PRÓXIMO</p><h2 id="explorer-title">{c.title}</h2><p>{c.intro}</p>
      <div className="explorer-tabs" role="tablist" aria-label="Explorar o conceito">{c.tabs.map((tab, i) => <button key={tab} role="tab" type="button" id={`explorer-tab-${i}`} aria-selected={active === i} aria-controls="explorer-panel" tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={e => {
        let next = i;
        if (e.key === "ArrowRight") next = (i + 1) % 3;
        else if (e.key === "ArrowLeft") next = (i + 2) % 3;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = 2;
        else return;
        e.preventDefault(); setActive(next); document.getElementById(`explorer-tab-${next}`)?.focus();
      }}>{tab}</button>)}</div>
      <div id="explorer-panel" className="explorer-panel" role="tabpanel" aria-labelledby={`explorer-tab-${active}`} tabIndex={0}><span>0{active + 1}</span><p key={active}>{c.copy[active]}</p></div>
      <small>ESTUDO AUTORAL · ESPECIFICAÇÕES E CENÁRIO ILUSTRATIVOS</small>
    </div>
  </section>;
}
