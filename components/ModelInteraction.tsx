"use client";
import { Arrow } from "@/components/ui/icons";
import { useState } from "react";
import { modelPreparation } from "@/lib/models";
import type { NicheModel } from "@/lib/models";
export function ModelInteraction({ model }: { model: NicheModel }) {
  const [selected, setSelected] = useState(0);
  const [consumption, setConsumption] = useState("12000");
  const [daytime, setDaytime] = useState("70");
  const item = model.services[selected];
  const valid = Number.isFinite(Number(consumption)) && Number(consumption) > 0 && Number(consumption) <= 10000000;
  return <section className="model-explorer" aria-labelledby="explore-title">
    <div><p className="model-kicker">EXPLORAR / {model.niche}</p><h2 id="explore-title">{model.slug === "energia" ? "Comece entendendo o seu consumo." : model.slug === "imoveis" ? "Qual paisagem combina com a sua rotina?" : model.slug === "psicologia" ? "A primeira conversa, sem mistério." : "Conheça os caminhos possíveis."}</h2></div>
    {model.slug === "energia" ? <div className="model-calculator">
      <label htmlFor="monthly-kwh">Consumo mensal informado (kWh)<input id="monthly-kwh" type="number" min="1" max="10000000" value={consumption} onChange={e => setConsumption(e.target.value)} /></label>
      <label htmlFor="daytime-share">Parcela do consumo no período diurno: {daytime}%<input id="daytime-share" type="range" min="0" max="100" step="5" value={daytime} onChange={e => setDaytime(e.target.value)} /></label>
      <output aria-live="polite">{valid ? <><strong>{new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(Number(consumption) * Number(daytime) / 100)} kWh/mês</strong><span>Consumo diurno estimado a partir dos valores que você informou.</span></> : "Informe um consumo maior que zero e até 10 milhões de kWh."}</output>
      <p>Não é dimensionamento de sistema nem previsão de economia. A distribuição real do consumo exige medições ou dados da operação.</p>
    </div> : <div>
      <div className="model-choice-list" role="group" aria-label="Escolha um tema para explorar">{model.services.map((service, i) => <button type="button" key={service.title} aria-pressed={selected === i} onClick={() => setSelected(i)}><span>0{i + 1}</span>{service.title}<Arrow size={14} aria-hidden="true" /></button>)}</div>
      <div className="model-choice-result" aria-live="polite"><h3>{item.title}</h3><p>{modelPreparation[model.slug]?.[selected]}</p><p className="model-fine">Explore esta orientação sem enviar dados pessoais. O contato ao final é com o desenvolvedor do modelo.</p></div>
    </div>}
  </section>;
}
