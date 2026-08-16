import Scene3D from "@/components/three/Scene3D";
import AnimatedNetwork from "./AnimatedNetwork";

/**
 * The care network. Renders the SVG on the server, then upgrades to the 3D
 * scene where the device can take it. Everything meaningful is in the SVG, so
 * nothing is lost when it does not.
 */
export default function NetworkFigure({ className = "" }: { className?: string }) {
  return (
    <Scene3D
      scene="network"
      className={className}
      ratio={1.55}
      label="Patients, clinicians, pharmacies, laboratories and health facilities connected to one shared record at the centre."
    >
      <AnimatedNetwork className="w-full" />
    </Scene3D>
  );
}
