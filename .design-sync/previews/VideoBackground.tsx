import { VideoBackground } from "medirevs-v2";

/**
 * The full-bleed looping media layer behind Hero, HeroStudio, LabsReveal and
 * FootageBand. It fills its positioned parent, so it always needs one.
 *
 * It refuses to fetch media under reduced motion, Save Data or a 2G-class
 * connection and shows the poster instead — which is the state these cards
 * render, and the reason they are deterministic.
 */
export const Default = () => (
  <div className="relative h-[420px] overflow-hidden">
    <VideoBackground
      webm="/media/hero-field.webm"
      mp4="/media/hero-field.mp4"
      poster="/media/hero-field-poster.jpg"
      label="An abstract optical field in which particles resolve into a connected network."
    />
  </div>
);

/** Bare media is never shipped on its own — a scrim carries the type over it. */
export const WithScrim = () => (
  <div className="relative flex h-[420px] items-end overflow-hidden bg-lab">
    <VideoBackground
      webm="/media/clinic-consultation.webm"
      mp4="/media/clinic-consultation.mp4"
      poster="/media/clinic-consultation-poster.jpg"
      label="A clinician and a patient during a consultation."
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(100deg, rgba(7,16,15,0.94) 0%, rgba(7,16,15,0.7) 45%, rgba(7,16,15,0.35) 100%)",
      }}
      aria-hidden="true"
    />
    <div className="shell relative w-full py-12">
      <p className="label mb-6 text-white/50">In the room</p>
      <p className="h2 max-w-[20ch] text-balance text-white">
        Care happens between two people, under time pressure.
      </p>
    </div>
  </div>
);

/**
 * `className` reaches the inner media with `[&_img]` / `[&_video]` selectors,
 * which is how the heroes reframe a landscape loop for their own composition.
 */
export const Reframed = () => (
  <div className="relative h-[420px] overflow-hidden">
    <VideoBackground
      webm="/media/studio-optic.webm"
      mp4="/media/studio-optic.mp4"
      poster="/media/studio-optic-poster.jpg"
      label="A precision optical component turning slowly in a bright studio."
      className="[&_img]:scale-[1.22] [&_img]:object-[68%_58%] [&_video]:scale-[1.22]"
    />
  </div>
);
