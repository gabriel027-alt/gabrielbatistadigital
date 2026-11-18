import { NotFoundCopy } from "@/components/NotFoundCopy";
import styles from "./not-found.module.css";

/** 404 in the homepage's language: the portrait's dark, peach type and the red brand dot. The words follow the
 * address's language (components/NotFoundCopy.tsx). */
export default function NotFound() {
  return <main className={styles.page}>
    <p className={styles.code}>404<span aria-hidden="true">.</span></p>
    <NotFoundCopy />
  </main>;
}
