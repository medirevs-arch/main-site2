/**
 * The optical motif: concentric calibration rings and an aperture.
 * Used as the quiet structural accent across Labs and the dark bands.
 */

export function Aperture({
  className = "",
  blades = 8,
  tone = "var(--color-brand-bright)",
  spin = true,
}: {
  className?: string;
  blades?: number;
  tone?: string;
  spin?: boolean;
}) {
  const cx = 150;
  const cy = 150;
  const outer = 120;
  const inner = 46;

  return (
    <svg viewBox="0 0 300 300" fill="none" className={className} aria-hidden="true">
      <g stroke={tone} opacity="0.9">
        <circle cx={cx} cy={cy} r={outer + 16} strokeWidth="0.75" opacity="0.25" />
        <circle cx={cx} cy={cy} r={outer} strokeWidth="1" opacity="0.5" />
        <circle cx={cx} cy={cy} r={inner} strokeWidth="1" opacity="0.7" />
      </g>

      {/* Calibration ticks */}
      <g
        stroke={tone}
        opacity="0.45"
        style={
          spin
            ? { transformOrigin: "150px 150px", animation: "ring-spin 90s linear infinite" }
            : undefined
        }
      >
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * Math.PI * 2;
          const long = i % 5 === 0;
          const r1 = outer + 4;
          const r2 = outer + (long ? 14 : 8);
          return (
            <line
              key={i}
              x1={cx + Math.cos(angle) * r1}
              y1={cy + Math.sin(angle) * r1}
              x2={cx + Math.cos(angle) * r2}
              y2={cy + Math.sin(angle) * r2}
              strokeWidth={long ? 1 : 0.6}
            />
          );
        })}
      </g>

      {/* Aperture blades */}
      <g stroke={tone} strokeWidth="1" opacity="0.55">
        {Array.from({ length: blades }).map((_, i) => {
          const a1 = (i / blades) * Math.PI * 2;
          const a2 = ((i + 1) / blades) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M${cx + Math.cos(a1) * inner} ${cy + Math.sin(a1) * inner} L${
                cx + Math.cos(a2) * outer
              } ${cy + Math.sin(a2) * outer}`}
            />
          );
        })}
      </g>
    </svg>
  );
}

/**
 * A field of view: the circular frame used to hold motion or imagery.
 */
export function FieldRing({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" className={className} aria-hidden="true">
      <circle cx="200" cy="200" r="198" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="200" cy="200" r="176" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="200" y1="2" x2="200" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="200" y1="374" x2="200" y2="398" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="2" y1="200" x2="26" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="374" y1="200" x2="398" y2="200" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
