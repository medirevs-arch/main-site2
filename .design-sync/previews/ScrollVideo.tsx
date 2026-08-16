import { ScrollVideo } from "medirevs-v2";

/**
 * A video scrubbed by scroll position rather than played: a tall scroll track
 * with a sticky viewport inside it, whose currentTime follows how far down
 * the track you are. Nothing autoplays, and scrolling back up runs it
 * backwards.
 *
 * Under reduced motion, Save Data or a slow connection it fetches no video at
 * all and holds the poster — the documented fallback, and what these cards
 * show. `heightVh` is dialled down from the site's 300-340 so the card is a
 * card rather than three screens of empty track.
 */
export const Default = () => (
  <ScrollVideo
    mp4="/media/doctorevs-network.mp4"
    poster="/media/doctorevs-network-poster.jpg"
    label="A consultation on a phone opens out into a wider network of connected care."
    heightVh={130}
  />
);

/** `children` overlay the sticky viewport — the product pages put type there. */
export const WithOverlay = () => (
  <ScrollVideo
    mp4="/media/labs-objective.mp4"
    webm="/media/labs-objective.webm"
    poster="/media/labs-objective-poster.jpg"
    label="A microscope objective turning under studio light."
    heightVh={130}
  >
    <div className="pointer-events-none absolute inset-0 flex items-end">
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{ background: "linear-gradient(to top, rgba(7,16,15,0.9), rgba(7,16,15,0))" }}
        aria-hidden="true"
      />
      <div className="shell relative w-full pb-12">
        <p className="label mb-4 text-white/50">Project 01</p>
        <p className="h2 max-w-[18ch] text-balance text-white">
          The instrument at the start of the chain.
        </p>
      </div>
    </div>
  </ScrollVideo>
);
