"use client";

import { useRef, useState } from "react";
import { Arrow } from "@/components/ui/icons";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import styles from "./DiagnosisQuiz.module.css";

/**
 * "Não sabe por onde começar?" (22/11/2026, asked by the user): two taps, then where Gabriel would start, and the
 * conversation on WhatsApp already carrying the answers. A suggestion, never a verdict: no score, no price, no deadline,
 * no promise. Nothing is stored or sent; the answers leave only inside the message, if the visitor chooses to send it.
 *
 * The three steps share one grid cell, so the block keeps its height while the visitor answers: nothing below moves,
 * and the scroll scenes measured around it stay right. Without JavaScript the old "Sob medida" line is shown instead.
 */
export type DiagnosisCopy = {
  /** "{n} de {total}" (a string, because the copy crosses from the server page to this client component). */
  title: string; intro: string; stepOf: string;
  q1: string; businesses: { id: string; label: string; msg: string }[];
  q2: string; situations: { id: string; label: string; start: string; why: string; msg: string }[];
  resultLabel: string; confirm: string; talk: string; note: string; restart: string; back: string;
  greeting: string; closing: string;
  fallback: { lead: string; text: string; href: string };
};

export function DiagnosisQuiz({ copy: t, place, business: preset, callClassName, className }: { copy: DiagnosisCopy; place: string; business?: string; callClassName?: string; className?: string }) {
  const [business, setBusiness] = useState<string | undefined>(preset);
  const [situation, setSituation] = useState<string>();
  const root = useRef<HTMLDivElement>(null);
  const step = situation ? 3 : business ? 2 : 1;
  const total = preset ? 1 : 2;
  const focus = (n: number) => requestAnimationFrame(() => root.current?.querySelector<HTMLElement>(`[data-step="${n}"] [data-focus]`)?.focus({ preventScroll: true }));
  const go = (next: { business?: string; situation?: string }, n: number) => { setBusiness(next.business); setSituation(next.situation); focus(n); };
  const chosenBusiness = t.businesses.find(item => item.id === business);
  const chosen = t.situations.find(item => item.id === situation);
  const message = chosen ? [t.greeting, chosenBusiness?.msg, chosen.msg, t.closing].filter(Boolean).join(" ") : "";
  // Inactive steps stay in the grid cell (so the height never changes) but are invisible and unreachable.
  const panel = (n: number) => ({ "data-step": n, "data-active": step === n, className: styles.panel, inert: step !== n });
  const count = (n: number) => t.stepOf.replace("{n}", String(n)).replace("{total}", String(total));

  return <div className={`${styles.quiz} ${className ?? ""}`} ref={root} data-diagnosis data-diagnosis-step={step}>
    <div className={styles.head}><h3>{t.title}</h3><p>{t.intro}</p></div>
    <div className={styles.stage}>
      {!preset && <div {...panel(1)}>
        <p className={styles.count}>{count(1)}</p>
        <h4 tabIndex={-1} data-focus>{t.q1}</h4>
        <div className={styles.options}>{t.businesses.map(item => <button key={item.id} type="button" onClick={() => go({ business: item.id }, 2)}>{item.label}</button>)}</div>
      </div>}
      <div {...panel(2)}>
        {total > 1 && <p className={styles.count}>{count(2)}</p>}
        <h4 tabIndex={-1} data-focus>{t.q2}</h4>
        <div className={styles.options}>{t.situations.map(item => <button key={item.id} type="button" onClick={() => go({ business, situation: item.id }, 3)}>{item.label}</button>)}</div>
        {!preset && <button type="button" className={styles.textButton} onClick={() => go({}, 1)}>← {t.back}</button>}
      </div>
      <div {...panel(3)}>
        <p className={styles.count}>{t.resultLabel}</p>
        {/* Every answer is laid out in the same cell, so the longest one sets the height whichever is chosen. */}
        <div className={styles.answers}>{t.situations.map(item => <div key={item.id} className={styles.answer} data-active={item.id === situation} aria-hidden={item.id !== situation}>
          <h4 tabIndex={-1} data-focus={item.id === situation ? "" : undefined}>{item.start}</h4>
          <p className={styles.why}>{item.why}</p>
        </div>)}</div>
        <p className={styles.confirm}>{t.confirm}</p>
        <div className={styles.actions}>
          <a className={callClassName ?? styles.call} href={buildWhatsAppUrl(message || undefined)} target="_blank" rel="noopener noreferrer" data-track-place={place}>{t.talk} <Arrow size={16} /></a>
          <button type="button" className={styles.textButton} onClick={() => go({ business: preset }, preset ? 2 : 1)}>{t.restart}</button>
        </div>
        <p className={styles.note}>{t.note}</p>
      </div>
    </div>
    <noscript><a className={styles.fallback} href={t.fallback.href} target="_blank" rel="noopener noreferrer" data-track-place={`${place}-sem-js`}><span><strong>{t.fallback.lead}</strong> {t.fallback.text}</span><Arrow size={20} /></a></noscript>
  </div>;
}
