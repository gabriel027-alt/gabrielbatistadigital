import Image from "next/image";
const descriptions = {
  chronos: "Relógio mecânico dourado em composição editorial de alta relojoaria",
  vanguard: "Residência de concreto e pedra com espelho de água e luz natural",
  aura: "Composição de vidro, seda e orquídeas em tons de marfim e champanhe",
};
export function ConceptPhoto({ theme, preload = false }: { theme: keyof typeof descriptions; preload?: boolean }) {
  return <div className="demo-photo"><Image src={`/images/concepts/${theme}.webp`} alt={descriptions[theme]} fill sizes="(max-width: 900px) 100vw, 55vw" preload={preload} /></div>;
}
