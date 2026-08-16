import { Aperture } from "medirevs-v2";

/**
 * The optical motif — concentric calibration rings around an iris. It is the
 * structural accent across Labs and the dark bands, and it fills whatever box
 * it is given.
 */
export const Default = () => (
  <div className="h-80 w-80">
    <Aperture className="h-full w-full" />
  </div>
);

/** `blades` sets the iris leaf count — the demo page uses 12. */
export const Blades = () => (
  <div className="flex items-center gap-8">
    {[6, 8, 12].map((blades) => (
      <figure key={blades}>
        <Aperture className="h-44 w-44" blades={blades} />
        <figcaption className="label mt-3 text-slate">{blades} blades</figcaption>
      </figure>
    ))}
  </div>
);

/** `tone` takes any colour value — the accents are brand-bright and optic. */
export const Tones = () => (
  <div className="flex items-center gap-8">
    <Aperture className="h-44 w-44" tone="var(--color-brand-bright)" />
    <Aperture className="h-44 w-44" tone="var(--color-optic)" />
    <Aperture className="h-44 w-44" tone="var(--color-signal)" />
  </div>
);

/** On the dark band it is used at full size behind or beside content. */
export const OnDark = () => (
  <div className="flex items-center gap-10 bg-lab p-10">
    <Aperture className="h-56 w-56" blades={12} tone="var(--color-brand-bright)" />
    <div>
      <p className="label text-white/40">Medirevs Labs</p>
      <h3 className="h3 mt-3 max-w-[18ch] text-white">
        Optics worked out in the open.
      </h3>
    </div>
  </div>
);
