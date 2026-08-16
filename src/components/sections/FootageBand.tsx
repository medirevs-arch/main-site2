import Image from "next/image";
import VideoBackground from "@/components/VideoBackground";
import type { ReactNode } from "react";

/**
 * A full-bleed band of documentary imagery with a line of type over it.
 *
 * Used sparingly. Real clinical settings rather than staged portraits, and
 * decorative, so nothing essential is said only here.
 *
 * `webm`/`mp4` are optional: with them the band runs a loop, without them
 * `poster` is rendered as a still. A photograph is usually the stronger
 * choice — a documentary moment reads better held than looped.
 */
export default function FootageBand({
  webm,
  mp4,
  poster,
  label,
  kicker,
  children,
  caption,
  tone = "teal",
  height = "tall",
}: {
  webm?: string;
  mp4?: string;
  poster: string;
  /** Describes the footage for assistive tech. */
  label: string;
  kicker?: string;
  children: ReactNode;
  caption?: string;
  /** Which colour the scrim leans into. */
  tone?: "teal" | "navy";
  height?: "tall" | "short";
}) {
  const scrim =
    tone === "teal"
      ? "linear-gradient(92deg, rgba(20,85,79,0.95) 0%, rgba(20,85,79,0.82) 42%, rgba(20,85,79,0.42) 72%, rgba(7,16,15,0.55) 100%)"
      : "linear-gradient(92deg, rgba(15,23,34,0.95) 0%, rgba(15,23,34,0.84) 42%, rgba(15,23,34,0.45) 72%, rgba(15,23,34,0.6) 100%)";

  return (
    <section
      className={`relative overflow-hidden ${
        height === "tall" ? "min-h-[78svh]" : "min-h-[56svh]"
      } flex items-end`}
      style={{ background: tone === "teal" ? "var(--color-brand-deep)" : "var(--color-navy-deep)" }}
    >
      {mp4 ? (
        <VideoBackground
          webm={webm}
          mp4={mp4}
          poster={poster}
          label={label}
          className="[&_img]:object-[60%_35%] [&_video]:object-[60%_35%]"
        />
      ) : (
        <Image
          src={poster}
          alt={label}
          fill
          sizes="100vw"
          className="object-cover object-[60%_40%]"
        />
      )}

      <div className="absolute inset-0" style={{ background: scrim }} aria-hidden="true" />

      <div className="shell relative w-full py-16 sm:py-24">
        {kicker && (
          <p className="label mb-8 flex items-center gap-3 text-white/55">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--color-signal)" }}
              aria-hidden="true"
            />
            {kicker}
          </p>
        )}

        <p className="h2 max-w-[20ch] text-balance text-white" data-reveal>
          {children}
        </p>

        {caption && <p className="label mt-10 max-w-[46ch] text-white/45">{caption}</p>}
      </div>
    </section>
  );
}
