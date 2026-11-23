import { Gesture } from "./Gesture";
import styles from "./ScrollHint.module.css";

type Props = {
  desktop: string;
  phone: string;
  tone?: "dark" | "light";
  /** Where it sits on computers when the bottom centre belongs to the scene (a stamp, a ruler). */
  desktopAlign?: "center" | "right";
  /** On phones, at the top of the scene instead of the bottom (where a fixed control may sit). */
  phoneTop?: boolean;
};

/**
 * Interaction hint for a scroll scene (docs/DESIGN-SYSTEM.md, layer 1, "dica de interação"). Written in the brand's
 * own voice; "role" on computers and "deslize" on phones. Shown only while motion runs (data-brand-animated), and
 * useBrandMotion fades it out as soon as its scene starts. Place it inside the scene's sticky stage.
 */
export function ScrollHint({ desktop, phone, tone = "dark", desktopAlign = "center", phoneTop = false }: Props) {
  const classes = [styles.hint, tone === "light" && styles.light, desktopAlign === "right" && styles.right, phoneTop && styles.phoneTop].filter(Boolean).join(" ");
  // The gesture in place of the old arrow (23/11/2026): a finger swiping on phones, a mouse wheel on computers.
  return <p className={classes} data-scroll-hint>
    <Gesture touch={tone === "light" ? "#1b171440" : undefined} />
    <span className={styles.desktop}>{desktop}</span><span className={styles.phone}>{phone}</span>
  </p>;
}
