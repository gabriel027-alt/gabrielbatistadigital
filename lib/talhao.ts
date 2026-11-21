/**
 * Talhão Advocacia do Agro (docs/NOVOS-PROJETOS-REGISTROS.md). Informative legal language: the rules of rural credit
 * provide paths (prorrogação, renegociação) when a harvest fails for reasons outside the farmer's control; the office
 * shows which paths exist. No OAB number, numbers, deadlines, rates or promise of outcome.
 */
export const lawyer = { name: "Marina Couto", first: "Marina", role: "Advogada do agro" };

/** The aerial photo the plots were measured on (public/images/talhao/mapa-zenital.webp). */
export const mapSize = { w: 1672, h: 941 };

type Shape = { kind: "rect"; x: number; y: number; w: number; h: number } | { kind: "circle"; cx: number; cy: number; r: number };
export type Plot = { id: string; title: string; line: string; shape: Shape; marker: { x: number; y: number } };

/**
 * Each plot of the farm lights up with one situation, in reading order. Shapes measured on the photo by colour
 * (soy green, harvested straw, red soil, the irrigation pivot), in its own pixels.
 */
export const plots: Plot[] = [
  {
    id: "safra", title: "Safra frustrada", line: "Seca, chuva fora de hora ou praga: a perda que você não controla.",
    shape: { kind: "circle", cx: 1252, cy: 467, r: 330 }, marker: { x: 1252, y: 467 },
  },
  {
    id: "custeio", title: "Dívida de custeio", line: "A parcela vence mesmo quando a colheita não veio.",
    shape: { kind: "rect", x: 282, y: 4, w: 624, h: 296 }, marker: { x: 594, y: 152 },
  },
  {
    id: "maquina", title: "Máquina penhorada", line: "Execução sobre a colheitadeira, o trator ou os implementos.",
    shape: { kind: "rect", x: 92, y: 314, w: 806, h: 326 }, marker: { x: 495, y: 477 },
  },
  {
    id: "arrendamento", title: "Arrendamento e parceria", line: "Contratos de uso da terra que precisam ser lidos de novo.",
    shape: { kind: "rect", x: 930, y: 4, w: 648, h: 134 }, marker: { x: 1254, y: 71 },
  },
  {
    id: "garantia", title: "Terra em garantia", line: "Quando a própria fazenda sustenta o financiamento.",
    shape: { kind: "rect", x: 72, y: 646, w: 818, h: 291 }, marker: { x: 481, y: 791 },
  },
];
