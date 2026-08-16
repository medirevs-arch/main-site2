import { ProductGlyph } from "medirevs-v2";

/**
 * One glyph per product, all cut from the same optical geometry — a 120px
 * field, 1px strokes, concentric structure — so they read as a set. It has no
 * intrinsic size: it fills its box and draws in currentColor.
 */
export const TheSet = () => (
  <div className="grid grid-cols-3 gap-10 text-brand">
    {(["doctorevs", "ehr", "data-ai"] as const).map((product) => (
      <figure key={product}>
        <ProductGlyph product={product} className="h-40 w-40" />
        <figcaption className="label mt-4 text-slate">{product}</figcaption>
      </figure>
    ))}
  </div>
);

/** Colour is inherited, so the glyph takes the band it sits in. */
export const Tones = () => (
  <div className="flex items-center gap-10">
    <ProductGlyph product="doctorevs" className="h-28 w-28 text-brand" />
    <ProductGlyph product="ehr" className="h-28 w-28 text-optic" />
    <ProductGlyph product="data-ai" className="h-28 w-28 text-signal" />
  </div>
);

/**
 * How ProductEcosystem actually uses it: oversized, bled off the corner of a
 * panel at low opacity as a watermark.
 */
export const AsWatermark = () => (
  <div className="relative h-64 overflow-hidden rounded-sm border border-line bg-paper">
    <div className="lattice absolute inset-0 opacity-50" aria-hidden="true" />
    <div className="absolute -right-16 -top-16 h-72 w-72 text-brand opacity-[0.13]" aria-hidden="true">
      <ProductGlyph product="doctorevs" className="h-full w-full" />
    </div>
    <div className="relative p-10">
      <p className="label text-mist">Telemedicine platform</p>
      <h3 className="h2 mt-3">DoctoRevs</h3>
    </div>
  </div>
);

/** On dark it is the same geometry in white. */
export const OnDark = () => (
  <div className="flex items-center gap-10 bg-lab p-10 text-white/70">
    <ProductGlyph product="doctorevs" className="h-28 w-28" />
    <ProductGlyph product="ehr" className="h-28 w-28" />
    <ProductGlyph product="data-ai" className="h-28 w-28" />
  </div>
);
