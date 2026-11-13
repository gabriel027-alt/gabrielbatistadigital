import Link from "next/link";
import styles from "./not-found.module.css";

/** 404 in the homepage's language: the portrait's dark, peach type and the red brand dot. */
export default function NotFound() {
  return <main className={styles.page}>
    <p className={styles.code}>404<span aria-hidden="true">.</span></p>
    <h1>Esta página não está por aqui.</h1>
    <p className={styles.text}>O endereço pode ter mudado. Os projetos e o contato estão na página inicial.</p>
    <Link href="/" className={styles.button}>Voltar ao início</Link>
  </main>;
}
