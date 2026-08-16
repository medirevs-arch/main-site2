/**
 * The connected-care system, drawn as an SVG network.
 *
 * Pure SVG + CSS: paths draw themselves via stroke-dashoffset, signals travel
 * via offset-path. No JavaScript, no canvas, no library. Both animations are
 * neutralised by the global prefers-reduced-motion rule, which leaves the
 * finished diagram on screen.
 */

const HUB = { x: 462, y: 262 };

const NODES = [
  { id: "patient", label: "Patient", x: 150, y: 118, anchor: "start" as const },
  { id: "clinician", label: "Clinician", x: 470, y: 62, anchor: "middle" as const },
  { id: "pharmacy", label: "Pharmacy", x: 786, y: 150, anchor: "end" as const },
  { id: "laboratory", label: "Laboratory", x: 742, y: 428, anchor: "end" as const },
  { id: "facility", label: "Health facility", x: 196, y: 402, anchor: "start" as const },
];

// Peer relationships that exist independently of the hub.
const PEERS: [number, number][] = [
  [0, 1],
  [1, 3],
  [2, 3],
  [0, 4],
];

const line = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  `M${a.x} ${a.y} L${b.x} ${b.y}`;

export default function AnimatedNetwork({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 900 500"
        fill="none"
        className="w-full"
        role="img"
        aria-labelledby="network-title network-desc"
      >
        <title id="network-title">The Medirevs care network</title>
        <desc id="network-desc">
          A diagram showing patients, clinicians, pharmacies, laboratories and health
          facilities connected to one another and to a shared record at the centre.
        </desc>

        {/* Hub → node connections */}
        <g stroke="var(--color-brand)" strokeWidth="1" opacity="0.55">
          {NODES.map((node, index) => (
            <path
              key={node.id}
              d={line(HUB, node)}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              style={{
                animation: `draw 1.1s var(--ease) forwards`,
                animationDelay: `${180 + index * 130}ms`,
              }}
            />
          ))}
        </g>

        {/* Peer connections, drawn lighter */}
        <g stroke="var(--color-optic)" strokeWidth="1" opacity="0.3">
          {PEERS.map(([a, b], index) => (
            <path
              key={`${a}-${b}`}
              d={line(NODES[a], NODES[b])}
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset="1"
              style={{
                animation: `draw 1.3s var(--ease) forwards`,
                animationDelay: `${900 + index * 150}ms`,
              }}
            />
          ))}
        </g>

        {/* Travelling signals — one per spoke, staggered so the diagram never
            reads as busy. */}
        <g>
          {NODES.map((node, index) => (
            <circle
              key={`signal-${node.id}`}
              r="3"
              fill="var(--color-signal)"
              style={{
                offsetPath: `path("${line(node, HUB)}")`,
                animation: `travel 3.6s linear infinite`,
                animationDelay: `${index * 900}ms`,
              }}
            />
          ))}
        </g>

        {/* Hub: the shared record */}
        <g>
          <circle cx={HUB.x} cy={HUB.y} r="52" stroke="var(--color-brand)" strokeWidth="1" opacity="0.25" />
          <circle cx={HUB.x} cy={HUB.y} r="34" stroke="var(--color-brand)" strokeWidth="1" opacity="0.45" />
          <circle cx={HUB.x} cy={HUB.y} r="7" fill="var(--color-brand)" />
          <text
            x={HUB.x}
            y={HUB.y + 84}
            textAnchor="middle"
            className="label"
            fill="var(--color-brand-dark)"
          >
            One record
          </text>
        </g>

        {/* Nodes */}
        <g>
          {NODES.map((node) => (
            <g key={`node-${node.id}`}>
              <circle cx={node.x} cy={node.y} r="17" fill="#fff" />
              <circle cx={node.x} cy={node.y} r="17" stroke="var(--color-ink)" strokeWidth="1" opacity="0.18" />
              <circle cx={node.x} cy={node.y} r="4.5" fill="var(--color-ink)" />
              <text
                x={node.anchor === "start" ? node.x - 26 : node.anchor === "end" ? node.x + 26 : node.x}
                y={node.anchor === "middle" ? node.y - 30 : node.y + 5}
                textAnchor={node.anchor === "start" ? "end" : node.anchor === "end" ? "start" : "middle"}
                className="label"
                fill="var(--color-charcoal)"
              >
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </figure>
  );
}
