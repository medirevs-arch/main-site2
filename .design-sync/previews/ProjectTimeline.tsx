import { ProjectTimeline } from "medirevs-v2";

// The Medirevs Labs milestones, verbatim from src/app/labs/page.tsx. None
// carry a date — the component prints "[Date to be confirmed]" rather than
// inventing one, which is the point of the placeholder.
const milestones = [
  {
    phase: "Research",
    status: "active",
    body: "Working out where microscopy actually fails in practice. Cost, servicing, training, and the conditions these instruments live in.",
  },
  {
    phase: "Design",
    status: "active",
    body: "Working through the optics and the mechanical design with the student team.",
  },
  {
    phase: "Prototype",
    status: "planned",
    body: "Building real units, so we can test the design against reality instead of against drawings.",
  },
] as const;

/** The rail: filled dot for complete, optic blue for active, hollow for planned. */
export const Default = () => (
  <div className="max-w-2xl">
    <ProjectTimeline milestones={milestones as never} />
  </div>
);

/** All three statuses at once, so the accent colours can be compared. */
export const AllStatuses = () => (
  <div className="max-w-2xl">
    <ProjectTimeline
      milestones={
        [
          {
            phase: "Scoping",
            status: "complete",
            date: "Q1 2026",
            body: "Signed off with the student team and the department. A date is shown here because this one is confirmed.",
          },
          milestones[0],
          milestones[2],
        ] as never
      }
    />
  </div>
);

/** `dark` is what the Labs page uses — the rail and body invert. */
export const OnDark = () => (
  <div className="bg-lab p-12">
    <div className="max-w-2xl">
      <ProjectTimeline dark milestones={milestones as never} />
    </div>
  </div>
);
