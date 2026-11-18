"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import styles from "@/app/not-found.module.css";

/**
 * The 404's words in the language of the address that was asked for (/en, /es, /pt-pt), with the way back to that
 * language's homepage. The server renders the Portuguese; the browser reads the path and switches.
 */
const copy = {
  pt: { title: "Esta página não está por aqui.", text: "O endereço pode ter mudado. Os projetos e o contato estão na página inicial.", back: "Voltar ao início", href: "/", lang: "pt-BR" },
  "pt-PT": { title: "Esta página não está aqui.", text: "O endereço pode ter mudado. Os projetos e o contacto estão na página inicial.", back: "Voltar ao início", href: "/pt-pt", lang: "pt-PT" },
  en: { title: "This page isn't here.", text: "The address may have changed. The projects and the contact are on the home page.", back: "Back to the home page", href: "/en", lang: "en" },
  es: { title: "Esta página no está aquí.", text: "La dirección puede haber cambiado. Los proyectos y el contacto están en la página de inicio.", back: "Volver al inicio", href: "/es", lang: "es" },
};
type Key = keyof typeof copy;
const fromPath = (path: string): Key => path === "/en" || path.startsWith("/en/") ? "en" : path === "/es" || path.startsWith("/es/") ? "es" : path === "/pt-pt" || path.startsWith("/pt-pt/") ? "pt-PT" : "pt";
const subscribe = () => () => {};

export function NotFoundCopy() {
  const key = useSyncExternalStore(subscribe, () => fromPath(location.pathname), () => "pt" as Key);
  const t = copy[key];
  if (typeof document !== "undefined") document.documentElement.lang = t.lang;
  return <>
    <h1>{t.title}</h1>
    <p className={styles.text}>{t.text}</p>
    <Link href={t.href} className={styles.button}>{t.back}</Link>
  </>;
}
