import { NotFoundCopy } from "@/components/NotFoundCopy";

/** 404 in the homepage's language: the portrait's dark, peach type and the red brand dot. The words follow the
 * address's language (components/NotFoundCopy.tsx). Styles in app/globals.css (nf-*). */
export default function NotFound() {
  return <main className="nf-page">
    <p className="nf-code">404<span aria-hidden="true">.</span></p>
    <NotFoundCopy />
  </main>;
}
