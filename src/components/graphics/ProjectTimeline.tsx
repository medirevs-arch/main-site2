/**
 * Project timeline.
 *
 * Milestones carry a status and, deliberately, no dates — none have been
 * confirmed. `date` is optional: fill it in and it appears; leave it out and
 * the row reads "[Date to be confirmed]" rather than inventing one.
 */

export type Milestone = {
  phase: string;
  body: string;
  status: "complete" | "active" | "planned";
  date?: string;
};

const STATUS_LABEL: Record<Milestone["status"], string> = {
  complete: "Complete",
  active: "In progress",
  planned: "Planned",
};

export default function ProjectTimeline({
  milestones,
  dark = false,
}: {
  milestones: Milestone[];
  dark?: boolean;
}) {
  return (
    <ol className="relative">
      {milestones.map((milestone, index) => {
        const isLast = index === milestones.length - 1;
        const accent =
          milestone.status === "complete"
            ? "var(--color-signal)"
            : milestone.status === "active"
              ? "var(--color-optic)"
              : dark
                ? "rgba(255,255,255,0.25)"
                : "var(--color-mist)";

        return (
          <li key={milestone.phase} className="relative grid grid-cols-[auto_1fr] gap-6 pb-12 last:pb-0 sm:gap-10">
            {/* Rail */}
            <div className="relative flex w-4 justify-center">
              <span
                className="mt-2 h-3 w-3 shrink-0 rounded-full border-2"
                style={{
                  borderColor: accent,
                  background: milestone.status === "planned" ? "transparent" : accent,
                }}
                aria-hidden="true"
              />
              {!isLast && (
                <span
                  className="absolute top-6 bottom-[-3rem] w-px"
                  style={{ background: dark ? "rgba(255,255,255,0.14)" : "var(--color-line)" }}
                  aria-hidden="true"
                />
              )}
            </div>

            <div data-reveal="rise" style={{ ["--delay" as string]: `${index * 70}ms` }}>
              <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <h3 className={`h3 ${dark ? "text-white" : "text-ink"}`}>{milestone.phase}</h3>
                <span className="label" style={{ color: accent }}>
                  {STATUS_LABEL[milestone.status]}
                </span>
              </div>

              <p className={`label mb-4 ${dark ? "text-white/35" : "text-mist"}`}>
                {milestone.date ?? "[Date to be confirmed]"}
              </p>

              <p className={`max-w-[52ch] leading-relaxed ${dark ? "text-white/60" : "text-charcoal"}`}>
                {milestone.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
