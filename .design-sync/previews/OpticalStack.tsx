import { OpticalStack } from "medirevs-v2";

/**
 * An exploded view of transmitted-light microscopy — eyepiece, tube,
 * objective, stage, condenser, illumination on one axis. Deliberately a
 * general schematic, not the Medirevs Labs prototype: it carries no
 * dimensions, magnifications or materials, because none are confirmed.
 *
 * Annotations reveal on hover and keyboard focus, so a still shows the
 * resting state.
 */
export const Default = () => (
  <div className="max-w-xl">
    <OpticalStack className="w-full" />
  </div>
);

/** On the dark Labs surface, which is where the microscope pages use it. */
export const OnDark = () => (
  <div className="bg-lab p-12 text-white">
    <div className="max-w-xl">
      <OpticalStack className="w-full" />
    </div>
  </div>
);
