import { NetworkFigure } from "medirevs-v2";

/**
 * AnimatedNetwork wrapped in Scene3D. The SVG renders first and the 3D scene
 * takes over where the device can carry it — everything meaningful lives in
 * the SVG, so the fallback is not a degraded version, just a quieter one.
 */
export const Default = () => (
  <div className="max-w-2xl">
    <NetworkFigure />
  </div>
);

/**
 * How the homepage pairs it: the claim on one side, the figure on the other,
 * on the `bg-wash` band. The underlying SVG is a light-surface graphic, so
 * that band (or paper) is where it belongs.
 */
export const InSection = () => (
  <div className="grid items-center gap-12 bg-wash p-12 sm:grid-cols-2">
    <div>
      <p className="label text-brand-dark">01 / The problem</p>
      <h2 className="h2 mt-6 max-w-[16ch]">
        The record is the thing that keeps getting lost.
      </h2>
      <p className="lede mt-6 max-w-[46ch]">
        A visit touches a clinic, a pharmacy and a laboratory. Each one keeps
        its own version of what happened.
      </p>
    </div>
    <NetworkFigure />
  </div>
);
