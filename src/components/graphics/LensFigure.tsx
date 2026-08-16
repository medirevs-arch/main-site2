import Scene3D from "@/components/three/Scene3D";
import { Aperture } from "./Aperture";

/**
 * A machined optical assembly with a real glass element. Scroll opens the
 * aperture. The SVG aperture stays as the fallback layer.
 */
export default function LensFigure({
  className = "",
  tone = "var(--color-optic)",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <Scene3D
      scene="lens"
      className={className}
      ratio={1}
      label="A precision optical assembly with a machined focus ring and an aperture that opens as the page scrolls."
    >
      <Aperture className="h-full w-full" tone={tone} blades={12} />
    </Scene3D>
  );
}
