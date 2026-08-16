import { Arrow } from "medirevs-v2";

/**
 * The 14x10 line arrow every call to action ends with. It draws in
 * currentColor and slides right when a `group/btn` or `group/link` ancestor
 * is hovered, so on its own it is just the glyph.
 */
export const Default = () => (
  <div className="flex items-center gap-8 text-ink">
    <Arrow />
    <span className="text-brand">
      <Arrow />
    </span>
    <span className="text-slate">
      <Arrow />
    </span>
  </div>
);

/** Inherits the surrounding type colour and size context. */
export const InType = () => (
  <p className="label inline-flex items-center gap-2 text-brand-dark">
    Continue reading
    <Arrow />
  </p>
);

/** Scaled up via className — the stroke stays 1.4 and thins optically. */
export const Scaled = () => (
  <div className="flex items-center gap-8 text-ink">
    <Arrow />
    <Arrow className="scale-150" />
    <Arrow className="scale-[2.5]" />
  </div>
);

/** On dark it is the same glyph in white. */
export const OnDark = () => (
  <div className="flex items-center gap-8 bg-lab p-10 text-white">
    <Arrow />
    <span className="text-brand-bright">
      <Arrow />
    </span>
  </div>
);
