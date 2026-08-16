import { Scene3D, Aperture, OpticalStack } from "medirevs-v2";

/**
 * The 3D host. It takes an SVG child as its base layer and, only where the
 * device can carry it (webgl2, four or more cores, no reduced-motion or
 * Save-Data preference, and the section actually in view), loads three.js and
 * crossfades to a real scene driven by the same geometry.
 *
 * The contract is that nothing meaningful lives only in the 3D layer, so the
 * SVG is never a degraded version — and it is what these cards show, because
 * preview cards report reduced motion and Scene3D's first check honours it.
 * `LensFigure`, `NetworkFigure` and `OpticalStackFigure` are the three
 * ready-made pairings; use those unless you are wiring a new scene.
 */
export const WithAperture = () => (
  <div className="max-w-sm">
    <Scene3D
      scene="lens"
      ratio={1}
      label="A precision optical assembly with a machined focus ring and an aperture that opens as the page scrolls."
    >
      <Aperture className="h-full w-full" blades={12} tone="var(--color-optic)" />
    </Scene3D>
  </div>
);

/** `ratio` sets the host box; the child is centred inside it. */
export const Ratio = () => (
  <div className="grid grid-cols-2 items-start gap-8">
    <Scene3D scene="lens" ratio={1} label="Square host.">
      <Aperture className="h-full w-full" />
    </Scene3D>
    <Scene3D scene="lens" ratio={1.6} label="Landscape host.">
      <Aperture className="h-full w-full" />
    </Scene3D>
  </div>
);

/**
 * Any scene name in src/components/three/scenes — here the optical stack.
 * Its child is a tall annotated schematic, so the host needs real width for
 * the annotations to stay legible.
 */
export const WithOpticalStack = () => (
  <div className="max-w-2xl">
    <Scene3D
      scene="opticalStack"
      ratio={1.05}
      label="An exploded view of a transmitted light microscope on one optical axis."
    >
      <OpticalStack className="w-full [&_figcaption]:hidden" />
    </Scene3D>
  </div>
);
