/**
 * The DoctoRevs journey: one continuous path with six stations.
 * The path draws on entry, then a single signal travels it on a loop.
 */

const STATIONS = [
  { label: "Patient", note: "Books an appointment" },
  { label: "Doctor", note: "Video or chat consultation" },
  { label: "Prescription", note: "Issued electronically" },
  { label: "Pharmacy", note: "Receives and fulfils" },
  { label: "Laboratory", note: "Request in, results back" },
  { label: "Follow-up", note: "Held in the patient record" },
];

const W = 1160;
const Y = 78;
const PAD = 70;
const STEP = (W - PAD * 2) / (STATIONS.length - 1);
const PATH = `M${PAD} ${Y} H${W - PAD}`;

export default function CareJourney({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${W} 190`}
        fill="none"
        className="w-full min-w-[760px]"
        role="img"
        aria-labelledby="journey-title journey-desc"
      >
        <title id="journey-title">A single episode of care in DoctoRevs</title>
        <desc id="journey-desc">
          {STATIONS.map((s) => `${s.label}: ${s.note}`).join(". ")}.
        </desc>

        <path d={PATH} stroke="var(--color-line)" strokeWidth="1" />
        <path
          d={PATH}
          stroke="var(--color-brand)"
          strokeWidth="1"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          style={{ animation: "draw 1.8s var(--ease) 200ms forwards" }}
        />

        <circle
          r="3.5"
          fill="var(--color-signal)"
          style={{ offsetPath: `path("${PATH}")`, animation: "travel 6s linear infinite 1.4s" }}
        />

        {STATIONS.map((station, index) => {
          const x = PAD + index * STEP;
          return (
            <g key={station.label}>
              <circle cx={x} cy={Y} r="15" fill="#fff" />
              <circle cx={x} cy={Y} r="15" stroke="var(--color-ink)" strokeWidth="1" opacity="0.16" />
              <circle cx={x} cy={Y} r="4" fill="var(--color-brand)" />
              <text x={x} y={Y - 34} textAnchor="middle" className="label" fill="var(--color-ink)">
                {String(index + 1).padStart(2, "0")}
              </text>
              <text
                x={x}
                y={Y + 46}
                textAnchor="middle"
                fill="var(--color-ink)"
                fontSize="15"
                fontWeight="500"
              >
                {station.label}
              </text>
              <text
                x={x}
                y={Y + 68}
                textAnchor="middle"
                fill="var(--color-slate)"
                fontSize="12.5"
              >
                {station.note}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
