import { FieldRing } from "medirevs-v2";

/**
 * The quieter half of the optical motif: two concentric rings with four tick
 * marks, no iris. It draws in currentColor at 20-35% opacity on 1px strokes
 * in a 400-unit viewBox — so it is built to frame a whole panel, and below
 * roughly 250px the hairlines fall under a pixel and vanish. Every cell here
 * shows it at a size it is actually used at.
 */
export const Default = () => (
  <div className="h-72 w-72 text-slate">
    <FieldRing className="h-full w-full" />
  </div>
);

/**
 * How the Labs page uses it: absolutely positioned over a dark panel at
 * white/25, framing the content rather than sitting beside it.
 */
export const AsOverlay = () => (
  <div className="relative h-80 overflow-hidden rounded-sm bg-lab">
    <FieldRing className="absolute inset-0 h-full w-full text-white/25" />
    <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
      <p className="label text-white/40">Project 01</p>
      <h3 className="h3 mt-4 max-w-[20ch] text-white">The low-cost microscope</h3>
    </div>
  </div>
);

/** The same framing on paper, where it takes a brand tone instead. */
export const OnPaper = () => (
  <div className="relative h-80 overflow-hidden rounded-sm border border-line bg-paper">
    <FieldRing className="absolute inset-0 h-full w-full text-brand" />
    <div className="relative flex h-full flex-col items-center justify-center px-10 text-center">
      <p className="label text-brand-dark">Field of view</p>
      <h3 className="h3 mt-4 max-w-[20ch] text-ink">A frame for motion or imagery</h3>
    </div>
  </div>
);
