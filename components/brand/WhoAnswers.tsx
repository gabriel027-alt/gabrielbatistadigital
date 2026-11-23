import styles from "./WhoAnswers.module.css";

/**
 * Who answers the first contact (docs/DESIGN-SYSTEM.md, layer 3, "Clareza", 23/11/2026): one short line near the top's
 * call, for the brands without a named professional (the service channel by its role: reception, team). The brand's
 * own fonts and colours come by inheritance; `className` places it where the brand's top reads best.
 */
export function WhoAnswers({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`${styles.who} ${className ?? ""}`} data-who-answers>{children}</p>;
}
