"use client";
import Image from "next/image";
import { useState, useSyncExternalStore, useRef, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { BrandInquiry } from "@/components/BrandInquiry";
import { Arrow } from "@/components/ui/icons";
import { bodies, cars, reportItems } from "@/lib/paddock";
import styles from "./paddock.module.css";
const subscribe = () => () => {};
export function PaddockStock({ children }: { children?: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [selected, setSelected] = useState<(typeof cars)[number] | null>(null);
  const report = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  function openReport(car: (typeof cars)[number], button: HTMLButtonElement) {
    opener.current = button;
    flushSync(() => setSelected(car));
    report.current?.showModal();
  }
  const [body, setBody] = useState("Todos");
  const shown = cars.filter(car => body === "Todos" || car.body === body);
  function choose(value: string) {
    if (value === body) return;
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(() => flushSync(() => setBody(value)));
    else setBody(value);
  }
  return <><section className={styles.stock} id="paddock-estoque" aria-labelledby="estoque-titulo">
    <div className={styles.stockHead}><div><p className={styles.eyebrow}>Sem pular a inspeção</p><h2 id="estoque-titulo">Escolha o carro. Abra o laudo.</h2></div><p>A condição vem antes da proposta.<br />O preço, você consulta depois.</p></div>
    <fieldset className={styles.filters}><legend>Carroceria</legend><div>{bodies.map(item => <button key={item} type="button" disabled={!hydrated} aria-pressed={body === item} onClick={() => choose(item)}>{item}</button>)}</div></fieldset>
    <p className={styles.count} role="status">{shown.length} {shown.length === 1 ? "carro" : "carros"}</p>
    <ul className={styles.cars} data-paddock-cars>{shown.map(car => <li key={car.id} style={{ viewTransitionName: `car-${car.id}` }}>
      <figure><Image src={`/images/paddock/${car.id}.webp`} alt={`${car.name}, sem logotipo, em um estúdio escuro com reflexo no piso`} width={3200} height={2400} sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw" quality={90} /></figure>
      <div className={styles.carCopy}><p>{car.body}</p><h3>{car.name}</h3><dl><div><dt>Ano</dt><dd>{car.year}</dd></div><div><dt>Quilometragem</dt><dd>{car.km}</dd></div><div><dt>Câmbio</dt><dd>{car.gear}</dd></div></dl><div className={styles.reportBrief}><span>Ficha de inspeção</span><ul>{reportItems.map(item => <li key={item.id}>{item.short}</li>)}</ul></div>
      {hydrated && <button id={`laudo-${car.id}`} className={styles.reportButton} type="button" onClick={event => openReport(car,event.currentTarget)}>Ver o laudo deste carro <Arrow size={17}/></button>}
      <p className={styles.price}>Consulte</p></div>
    </li>)}</ul>
  </section>
    <dialog ref={report} className={styles.reportDialog} aria-labelledby="paddock-ficha-titulo" onClose={() => { if (!document.querySelector("dialog[open]")) opener.current?.focus(); }}>
      <div className={styles.reportTop}><span>Paddock · Ficha de inspeção</span><button type="button" onClick={() => report.current?.close()} aria-label="Fechar ficha">Fechar ×</button></div>
      {selected && <><h2 id="paddock-ficha-titulo">{selected.name}</h2><p className={styles.reportSpecs}>{selected.year} · {selected.km} · {selected.gear}</p>
      <ul className={styles.reportChecks}>{reportItems.map(item => <li key={item.id}><span aria-hidden="true">✓</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ul>
      <p className={styles.reportNote}>Abra os registros de cada verificação na conversa. A condição atual e as informações do carro precisam ser confirmadas antes da proposta.</p><div className={styles.reportBottom}><span>Preço: Consulte</span><a href="#paddock-interesse" data-inquiry-car={selected.name} data-inquiry-return={`#laudo-${selected.id}`} className={styles.primary} onClick={() => report.current?.close()}>Conversar sobre este carro <Arrow size={18}/></a></div></>}
    </dialog>
    {children}
    <BrandInquiry key={selected?.id || "geral"} brand="paddock" initialAnswers={selected ? {carro:selected.name} : undefined}/>
  </>;
}
