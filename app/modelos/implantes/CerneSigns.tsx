"use client";

import { useEffect, useState } from "react";
import { signs } from "@/lib/cerne";
import styles from "./cerne.module.css";

/**
 * "Isso acontece com você?" (after the Radian benefit list, made a choice instead of a scroll scene): each sign is a
 * large line; touching or pointing at it lights it up and shows the treatment that usually answers it. The answers are
 * in the HTML under each line and only fold away once this script runs, so without JavaScript every one is open.
 */
export function CerneSigns() {
  const [active, setActive] = useState(signs[0].id);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <ol className={styles.signList} data-cerne-signs data-ready={ready}>
    {signs.map(item => {
      const on = item.id === active;
      return <li key={item.id} data-active={on}>
        <button type="button" className={styles.signLine} aria-expanded={ready ? on : true} aria-controls={`sinal-${item.id}`} onClick={() => setActive(item.id)} onPointerEnter={event => { if (event.pointerType === "mouse") setActive(item.id); }}>{item.sign}</button>
        <div className={styles.signAnswer} id={`sinal-${item.id}`}><p className={styles.signTreatment}>Costuma responder: <strong>{item.answer}</strong></p><p>{item.text}</p></div>
      </li>;
    })}
  </ol>;
}
