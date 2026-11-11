import { ModelIcon, type ModelIconName } from "@/components/ModelIcon";

/**
 * "A partilha se desenha": the estate at the top, one line down through the inventory, then branches to the heirs.
 * Illustrative diagram: shares depend on the law and each case, so no fractions are shown.
 */
const assets: { x: number; label: string; icon: ModelIconName }[] = [
  { x: 330, label: "Imóveis", icon: "home" },
  { x: 500, label: "Contas e aplicações", icon: "document" },
  { x: 670, label: "Empresa", icon: "handshake" },
];
const heirs = [200, 500, 800];
const SPLIT = 300;

export function EstateTree({ className }: { className?: string }) {
  return <svg className={className} viewBox="130 10 740 600" role="img" aria-labelledby="almeida-tree-title" data-estate-tree>
    <title id="almeida-tree-title">Ilustração da partilha: os bens da família seguem por uma única linha do inventário e se dividem entre os herdeiros</title>
    <g data-tree-assets>
      <line x1="250" y1="96" x2="750" y2="96" data-tree-rule />
      {assets.map(asset => <g key={asset.label} data-tree-asset>
        <circle cx={asset.x} cy="96" r="22" />
        <g transform={`translate(${asset.x - 11} 85)`}><ModelIcon name={asset.icon} size={22} /></g>
        <text x={asset.x} y="148" textAnchor="middle">{asset.label}</text>
      </g>)}
      <text x="500" y="40" textAnchor="middle" data-tree-heading>Patrimônio da família</text>
    </g>
    <path d={`M500 172 L500 ${SPLIT - 12}`} pathLength={1} data-tree-trunk />
    <g data-tree-knot>
      <circle cx="500" cy={SPLIT} r="12" />
      <text x="530" y={SPLIT - 30}>Inventário</text>
      <text x="530" y={SPLIT - 8} data-tree-note>cartório ou judicial</text>
    </g>
    <g data-tree-tax>
      <circle cx="500" cy={SPLIT} r="24" />
      <text x="530" y={SPLIT + 26} data-tree-note>imposto e avaliação</text>
    </g>
    {heirs.map(x => <path key={x} d={`M500 ${SPLIT + 12} C500 ${SPLIT + 120} ${x} ${SPLIT + 110} ${x} 500`} pathLength={1} data-tree-branch />)}
    <g data-tree-heirs>
      {heirs.map((x, index) => <g key={x}>
        <circle cx={x} cy="512" r="12" />
        <text x={x} y="560" textAnchor="middle">{["Herdeira", "Herdeiro", "Herdeiro"][index]}</text>
        <text x={x} y="586" textAnchor="middle" data-tree-note>registro em seu nome</text>
      </g>)}
    </g>
  </svg>;
}
