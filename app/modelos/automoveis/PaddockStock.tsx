"use client";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { bodies, cars } from "@/lib/paddock";
import styles from "./paddock.module.css";
const subscribe = () => () => {};
export function PaddockStock() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [body, setBody] = useState("Todos");
  const shown = cars.filter(car => body === "Todos" || car.body === body);
  function choose(value: string) {
    if (value === body) return;
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(() => flushSync(() => setBody(value)));
    else setBody(value);
  }
  return <section className={styles.stock} id="paddock-estoque" aria-labelledby="estoque-titulo">
    <div className={styles.stockHead}><div><p className={styles.eyebrow}>O próximo encontro</p><h2 id="estoque-titulo">Encontre o seu desenho.</h2></div><p>Escolha a carroceria.<br />Veja cada carro de perto.</p></div>
    <fieldset className={styles.filters}><legend>Carroceria</legend><div>{bodies.map(item => <button key={item} type="button" disabled={!hydrated} aria-pressed={body === item} onClick={() => choose(item)}>{item}</button>)}</div></fieldset>
    <p className={styles.count} role="status">{shown.length} {shown.length === 1 ? "carro" : "carros"}</p>
    <ul className={styles.cars}>{shown.map(car => <li key={car.id} style={{ viewTransitionName: `car-${car.id}` }}>
      <figure><Image src={`/images/paddock/${car.id}.webp`} alt={`${car.name}, sem logotipo, em um estúdio escuro com reflexo no piso`} width={3200} height={2400} sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw" quality={90} /></figure>
      <div className={styles.carCopy}><p>{car.body}</p><h3>{car.name}</h3><dl><div><dt>Ano</dt><dd>{car.year}</dd></div><div><dt>Quilometragem</dt><dd>{car.km}</dd></div><div><dt>Câmbio</dt><dd>{car.gear}</dd></div></dl><p className={styles.price}>Consulte</p></div>
    </li>)}</ul>
  </section>;
}
