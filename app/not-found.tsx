import Link from "next/link";
export default function NotFound() {
  return (
    <main className="shell section">
      <p className="eyebrow accent">404 / UM OUTRO CAMINHO</p>
      <h1 className="mt-8 text-5xl tracking-tight">
        Esta página não está por aqui.
      </h1>
      <p className="body-copy mt-6">
        Volte ao estúdio para conhecer nossas ideias e projetos.
      </p>
      <Link href="/" className="button button-primary mt-8">
        Voltar ao início ↗
      </Link>
    </main>
  );
}
