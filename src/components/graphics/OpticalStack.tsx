/**
 * An exploded view of a generic optical stack, with engineering annotations
 * that reveal on hover and on keyboard focus.
 *
 * This is a schematic of how transmitted-light microscopy is arranged in
 * general — illumination, stage, objective, tube, eyepiece. It is explicitly
 * NOT a depiction of the Medirevs Labs prototype, and carries no dimensions,
 * magnifications or materials, because none have been confirmed.
 */

const PARTS = [
  { id: "eyepiece", y: 44, label: "Eyepiece", note: "Where the image is viewed or captured", r: 34 },
  { id: "tube", y: 128, label: "Tube", note: "Sets the optical path length", r: 26 },
  { id: "objective", y: 212, label: "Objective", note: "The primary magnifying element", r: 30 },
  { id: "stage", y: 296, label: "Stage", note: "Holds and positions the specimen", r: 54 },
  { id: "condenser", y: 372, label: "Condenser", note: "Shapes light onto the specimen", r: 32 },
  { id: "illumination", y: 448, label: "Illumination", note: "The light source beneath the stage", r: 22 },
];

const CX = 190;

export default function OpticalStack({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 620 500"
        fill="none"
        className="w-full"
        role="img"
        aria-labelledby="stack-title stack-desc"
      >
        <title id="stack-title">The arrangement of a transmitted-light microscope</title>
        <desc id="stack-desc">
          {PARTS.map((p) => `${p.label}: ${p.note}`).join(". ")}. A general schematic,
          not a depiction of the Medirevs Labs prototype.
        </desc>

        {/* Optical axis */}
        <line
          x1={CX}
          y1="20"
          x2={CX}
          y2="480"
          stroke="var(--color-optic)"
          strokeWidth="1"
          strokeDasharray="3 6"
          opacity="0.5"
        />

        {PARTS.map((part, index) => (
          <g key={part.id} className="group/part" tabIndex={0} role="listitem">
            {/* Element */}
            <ellipse
              cx={CX}
              cy={part.y}
              rx={part.r}
              ry={part.r * 0.32}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.75"
            />
            <ellipse
              cx={CX}
              cy={part.y + 9}
              rx={part.r}
              ry={part.r * 0.32}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />
            <line x1={CX - part.r} y1={part.y} x2={CX - part.r} y2={part.y + 9} stroke="currentColor" opacity="0.5" />
            <line x1={CX + part.r} y1={part.y} x2={CX + part.r} y2={part.y + 9} stroke="currentColor" opacity="0.5" />

            {/* Leader line */}
            <line
              x1={CX + part.r + 10}
              y1={part.y + 4}
              x2={368}
              y2={part.y + 4}
              stroke="currentColor"
              strokeWidth="0.75"
              opacity="0.3"
            />
            <circle cx={368} cy={part.y + 4} r="2" fill="currentColor" opacity="0.6" />

            {/* Annotation */}
            <text x={382} y={part.y + 1} className="label" fill="currentColor">
              {String(index + 1).padStart(2, "0")} / {part.label}
            </text>
            <text
              x={382}
              y={part.y + 20}
              fontSize="12.5"
              fill="currentColor"
              opacity="0"
              className="transition-opacity duration-300 group-hover/part:opacity-60 group-focus/part:opacity-60"
            >
              {part.note}
            </text>
          </g>
        ))}
      </svg>

      <figcaption className="label mt-6 opacity-50">
        A general diagram of transmitted light microscopy. This is not the Medirevs
        Labs prototype
      </figcaption>
    </figure>
  );
}
