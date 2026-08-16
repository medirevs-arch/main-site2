import Scene3D from "@/components/three/Scene3D";
import OpticalStack from "./OpticalStack";

/**
 * The optical stack. Scrolling pulls the elements apart and lets them settle
 * back together. A general arrangement, not the Medirevs Labs prototype.
 */
export default function OpticalStackFigure({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <Scene3D
        scene="opticalStack"
        ratio={1.05}
        label="An exploded view of a transmitted light microscope: eyepiece, tube, objective, stage, condenser and illumination arranged on one optical axis."
      >
        <OpticalStack className="w-full [&_figcaption]:hidden" />
      </Scene3D>

      <figcaption className="label mt-6 opacity-50">
        A general diagram of transmitted light microscopy. This is not the Medirevs
        Labs prototype
      </figcaption>
    </figure>
  );
}
