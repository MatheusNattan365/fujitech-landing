import { cn } from "@/lib/utils";

const nodes = [
  { cx: 80, cy: 70 },
  { cx: 220, cy: 40 },
  { cx: 360, cy: 110 },
  { cx: 140, cy: 200 },
  { cx: 300, cy: 230 },
  { cx: 460, cy: 180 },
  { cx: 520, cy: 70 },
];

const links: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 3],
  [1, 3],
  [2, 4],
  [3, 4],
  [2, 5],
  [4, 5],
  [2, 6],
  [5, 6],
];

export function ConnectionGraph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 280"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      fill="none"
    >
      {links.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={nodes[from].cx}
          y1={nodes[from].cy}
          x2={nodes[to].cx}
          y2={nodes[to].cy}
          stroke="#2EE6D6"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
      ))}
      {nodes.map((node) => (
        <g key={`${node.cx}-${node.cy}`}>
          <circle cx={node.cx} cy={node.cy} r="10" fill="#2EE6D6" fillOpacity="0.16" />
          <circle cx={node.cx} cy={node.cy} r="3.5" fill="#2EE6D6" />
        </g>
      ))}
    </svg>
  );
}
