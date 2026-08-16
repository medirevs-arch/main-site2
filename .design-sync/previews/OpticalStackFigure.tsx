import { OpticalStackFigure } from "medirevs-v2";

/**
 * OpticalStack wrapped in Scene3D plus the disclaimer caption. Where WebGL is
 * available the flat schematic is upgraded to a real 3D stack that pulls
 * apart on scroll; where it is not, the SVG simply stays. Both are true
 * renders of this component — which one you get depends on the device.
 */
export const Default = () => (
  <div className="max-w-xl">
    <OpticalStackFigure />
  </div>
);

/** On the dark band, `text-white` is how the Labs page tones it. */
export const OnDark = () => (
  <div className="bg-lab p-12">
    <div className="max-w-xl">
      <OpticalStackFigure className="text-white" />
    </div>
  </div>
);
