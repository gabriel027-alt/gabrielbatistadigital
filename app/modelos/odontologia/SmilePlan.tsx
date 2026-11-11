/**
 * Illustration of digital smile planning, drawn in code (Forma's signature graphic).
 * Six anterior teeth in frontal golden proportion: central 1, lateral 0.618, canine 0.382.
 * Not a patient and not a result: a planning diagram.
 */
const W = 150;            // apparent width of a central incisor
const MID = 600;          // midline
const TOP = 210;          // cervical (gum) line
const kinds = [
  { kind: "central", width: W, height: 262 },
  { kind: "lateral", width: W * 0.618, height: 216 },
  { kind: "canine", width: W * 0.382, height: 246 },
] as const;

type Tooth = { x: number; width: number; height: number; kind: "central" | "lateral" | "canine"; side: 1 | -1 };

const teeth: Tooth[] = [];
for (const side of [-1, 1] as const) {
  let edge = MID;
  for (const tooth of kinds) {
    const x = side === 1 ? edge : edge - tooth.width;
    teeth.push({ x, width: tooth.width, height: tooth.height, kind: tooth.kind, side });
    edge += side * tooth.width;
  }
}

/** Crown outline in local coordinates: u from the side nearer the midline (0) to the outer side (1), v from gum (0) to edge (1). */
const shapes = {
  central: "M .16 .03 C .34 -.04 .66 -.04 .86 .04 C .95 .3 .98 .62 .99 .86 C 1 .97 .93 1.01 .82 1 C .6 .99 .3 1.01 .1 .995 C .02 .99 0 .93 .01 .85 C .02 .6 .05 .3 .16 .03 Z",
  lateral: "M .18 .04 C .38 -.03 .64 -.03 .84 .05 C .94 .3 .97 .58 .96 .8 C .95 .97 .84 1.01 .66 1 C .46 .99 .26 1.01 .13 .98 C .03 .95 .02 .86 .03 .76 C .05 .52 .08 .28 .18 .04 Z",
  canine: "M .22 .05 C .4 -.02 .62 -.02 .8 .06 C .96 .26 1.03 .5 .96 .76 C .86 .9 .66 1 .5 1.06 C .32 .99 .14 .9 .05 .78 C -.02 .52 .05 .28 .22 .05 Z",
} as const;

function crown({ x, width: w, height: h, kind, side }: Tooth) {
  const px = (u: number) => side === 1 ? x + u * w : x + w - u * w;
  const py = (v: number) => TOP + v * h;
  // Map every "u v" pair of the local path into page coordinates.
  return shapes[kind].replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, u: string, v: string) => `${px(Number(u)).toFixed(1)} ${py(Number(v)).toFixed(1)}`);
}
const boundaries = [...new Set(teeth.flatMap(t => [t.x, t.x + t.width]).map(v => Math.round(v * 10) / 10))].sort((a, b) => a - b);
const ratio = { central: "1", lateral: "0,618", canine: "0,382" } as const;

export function SmilePlan({ className }: { className?: string }) {
  return <svg className={className} viewBox="200 60 800 560" role="img" aria-labelledby="forma-plan-title" data-smile-plan>
    <title id="forma-plan-title">Ilustração do planejamento do sorriso: seis dentes da frente desenhados em proporção, sobre uma grade de medida</title>
    <defs>
      <linearGradient id="forma-ceramic" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ead8c4" />
        <stop offset=".45" stopColor="#fbfaf6" />
        <stop offset=".86" stopColor="#f6f1ea" />
        <stop offset="1" stopColor="#e2dbd6" />
      </linearGradient>
      <linearGradient id="forma-volume" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b79a86" stopOpacity=".5" />
        <stop offset=".22" stopColor="#e8dccb" stopOpacity="0" />
        <stop offset=".78" stopColor="#e8dccb" stopOpacity="0" />
        <stop offset="1" stopColor="#b79a86" stopOpacity=".5" />
      </linearGradient>
      <linearGradient id="forma-gloss" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g data-plan-grid>
      <line x1="210" y1={TOP} x2="990" y2={TOP} />
      <line x1="210" y1={TOP + 262} x2="990" y2={TOP + 262} />
      <line x1={MID} y1="70" x2={MID} y2="600" data-plan-midline />
      {boundaries.filter(v => v !== MID).map(v => <line key={v} x1={v} y1="120" x2={v} y2="560" />)}
    </g>
    <g data-plan-ratios>
      {teeth.map(t => <g key={`${t.kind}${t.side}`}>
        <line x1={t.x + 6} y1="150" x2={t.x + t.width - 6} y2="150" />
        <text x={t.x + t.width / 2} y="136" textAnchor="middle">{ratio[t.kind]}</text>
      </g>)}
      <text x="990" y={TOP - 12} textAnchor="end">linha gengival</text>
      <text x="990" y={TOP + 290} textAnchor="end">linha incisal</text>
      <text x={MID + 10} y="88">linha média</text>
    </g>
    <g data-plan-ceramic>
      {teeth.map(t => <g key={`c${t.kind}${t.side}`}>
        <path d={crown(t)} fill="url(#forma-ceramic)" />
        <path d={crown(t)} fill="url(#forma-volume)" />
        <path d={`M ${t.x + t.width * .38} ${TOP + 30} Q ${t.x + t.width * .3} ${TOP + t.height * .5} ${t.x + t.width * .4} ${TOP + t.height * .82}`} stroke="url(#forma-gloss)" strokeWidth={t.width * .12} strokeLinecap="round" fill="none" opacity=".75" />
      </g>)}
    </g>
    <g data-plan-outline>{teeth.map(t => <path key={`o${t.kind}${t.side}`} d={crown(t)} pathLength={1} />)}</g>
  </svg>;
}
