import { LensFigure } from "medirevs-v2";

/**
 * A machined optical assembly: Scene3D with the SVG Aperture as its base
 * layer. On a WebGL device it becomes a real glass element whose aperture
 * opens as the page scrolls; otherwise the aperture stays as drawn. Nothing
 * meaningful is lost either way, which is the design.
 */
export const Default = () => (
  <div className="max-w-md">
    <LensFigure className="w-full" />
  </div>
);

/** `tone` recolours the fallback aperture — the Labs page runs it optic blue. */
export const Tones = () => (
  <div className="grid grid-cols-2 gap-8">
    <LensFigure className="w-full" tone="var(--color-optic)" />
    <LensFigure className="w-full" tone="var(--color-brand-bright)" />
  </div>
);

/** In the dark band it sits beside the copy it illustrates. */
export const InBand = () => (
  <div className="bg-lab p-12">
    <div className="grid items-center gap-12 sm:grid-cols-2">
      <div>
        <p className="label text-white/40">Optics</p>
        <h3 className="h3 mt-4 max-w-[20ch] text-white">
          A real instrument at the start of the chain.
        </h3>
      </div>
      <LensFigure className="w-full" />
    </div>
  </div>
);
