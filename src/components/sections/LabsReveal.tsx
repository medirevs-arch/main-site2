import Link from "next/link";
import VideoBackground from "@/components/VideoBackground";
import { Aperture } from "@/components/graphics/Aperture";
import { Button } from "@/components/ui";
import { LABS } from "@/lib/site";

/**
 * The transition into Medirevs Labs.
 *
 * The page inverts to the laboratory palette, and the microscope loop is held
 * inside a circular aperture — the same optical geometry that runs through the
 * rest of the site, here doing the work of a doorway.
 */
export default function LabsReveal() {
  return (
    <section className="relative overflow-hidden bg-lab">
      <div className="lattice-dark absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="shell relative band-tall">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-24">
          <div>
            <p className="label mb-8 flex items-center gap-3 text-white/40">
              <span style={{ color: "var(--color-optic)" }}>05</span>
              <span className="text-white/20" aria-hidden="true">
                /
              </span>
              Research and devices
            </p>

            <h2 className="h1 text-white" data-reveal>
              {/* The space matters: without it this reads as "MedirevsLabs"
                  to a screen reader. */}
              Medirevs{" "}
              <br />
              <span style={{ color: "var(--color-optic)" }}>Labs</span>
            </h2>

            <p className="lede mt-8 max-w-[46ch] text-white/70" data-reveal style={{ ["--delay" as string]: "80ms" }}>
              {LABS.positioning} Software reaches a clinic over a network. Some
              things have to be built with your hands.
            </p>

            <p className="mt-6 max-w-[52ch] leading-relaxed text-white/55" data-reveal style={{ ["--delay" as string]: "140ms" }}>
              Labs is our engineering side. We research and build physical medical
              equipment for the places that have the least of it.
            </p>

            <div className="mt-12 border-t border-white/10 pt-8">
              <p className="label mb-3 text-white/40">First project</p>
              <Link href="/labs/low-cost-microscope" className="group/link inline-block">
                <span className="h3 text-white transition-colors group-hover/link:text-optic">
                  The Low-Cost Microscope
                </span>
                <span className="mt-3 block max-w-[44ch] text-[0.9375rem] leading-relaxed text-white/55">
                  Affordable microscopes for labs and teaching, built with a student
                  team from the {LABS.collaborator.institution}{" "}
                  {LABS.collaborator.unit}.
                </span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/labs" variant="light">
                Enter Medirevs Labs
              </Button>
            </div>
          </div>

          {/* Aperture holding the microscope loop */}
          <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
            <div className="absolute inset-[8%] overflow-hidden rounded-full">
              <VideoBackground
                webm="/media/labs-objective.webm"
                mp4="/media/labs-objective.mp4"
                poster="/media/labs-objective-poster.jpg"
                label="A macro view of a laboratory microscope objective lens."
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(7,16,15,0) 45%, rgba(7,16,15,0.85) 100%)",
                }}
                aria-hidden="true"
              />
            </div>
            <Aperture
              className="absolute inset-0 h-full w-full"
              tone="var(--color-optic)"
              blades={10}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
