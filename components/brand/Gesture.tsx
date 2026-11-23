import styles from "./Gesture.module.css";

/**
 * The gesture itself, drawn as a line (the homepage guide, 22/11/2026, brought to the brands on 23/11/2026): on phones
 * a finger presses with a soft touch and swipes up; on computers the wheel of a mouse rolls down. Still when motion is
 * reduced. `touch` is the colour of the press, so each brand can use its own accent.
 */
/** The hint's words: "Role…" on computers, "Deslize…" on phones. */
export function GestureText({ desktop, phone }: { desktop: string; phone: string }) {
  return <><span className={styles.onDesktop}>{desktop}</span><span className={styles.onPhone}>{phone}</span></>;
}

export function Gesture({ touch = "#ffffffb3" }: { touch?: string }) {
  return <span className={styles.gesture} aria-hidden="true">
    <svg className={styles.finger} viewBox="0 0 32 32" width="26" height="26">
      <g className={styles.hand}>
        <circle className={styles.touch} cx="12.7" cy="7" r="4.2" style={{ fill: touch }}/>
        <path d="M11 16V8.2a1.7 1.7 0 0 1 3.4 0V14m0-1.6a1.7 1.7 0 0 1 3.4 0V15m0-1.4a1.7 1.7 0 0 1 3.4 0v1.6m0-.4a1.7 1.7 0 0 1 3.4 0v3.6c0 4.4-2.9 7.6-7.2 7.6h-1c-2.4 0-4-1-5.4-2.8L6.6 20a1.6 1.6 0 0 1 2.5-2l1.9 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
    <svg className={styles.mouse} viewBox="0 0 32 32" width="24" height="24">
      <rect x="9" y="4" width="14" height="23" rx="7" fill="none" stroke="currentColor" strokeWidth="1.8"/>
      <rect className={styles.wheel} x="15" y="9" width="2" height="5" rx="1" fill="currentColor"/>
    </svg>
  </span>;
}
