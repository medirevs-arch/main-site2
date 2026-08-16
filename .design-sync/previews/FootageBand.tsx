import { FootageBand } from "medirevs-v2";

/**
 * A full-bleed band of documentary footage with one line of type over it.
 * Used sparingly, and always decorative — nothing essential is said only here.
 *
 * Cards render the poster frame rather than the loop: VideoBackground checks
 * prefers-reduced-motion before pulling any media, and preview cards report
 * it, so this is the same still a reduced-motion visitor sees.
 */
export const Teal = () => (
  <FootageBand
    webm="/media/clinic-consultation.webm"
    mp4="/media/clinic-consultation.mp4"
    poster="/media/clinic-consultation-poster.jpg"
    label="A clinician and a patient during a consultation."
    kicker="In the room"
    caption="Filmed at a partner facility in Accra. Footage is documentary, not staged."
  >
    Care happens in a room, between two people, under time pressure.
  </FootageBand>
);

/** `tone="navy"` swaps the scrim for the data/diagnostics palette. */
export const Navy = () => (
  <FootageBand
    tone="navy"
    webm="/media/doctorevs-network.mp4"
    mp4="/media/doctorevs-network.mp4"
    poster="/media/doctorevs-network-poster.jpg"
    label="The DoctoRevs record moving between clinic, pharmacy and laboratory."
    kicker="The record"
    caption="One record, following the patient rather than the building."
  >
    The handover is where the record usually breaks.
  </FootageBand>
);

/** `height="short"` for a band that punctuates rather than opens. */
export const Short = () => (
  <FootageBand
    height="short"
    webm="/media/clinic-clinician.webm"
    mp4="/media/clinic-clinician.mp4"
    poster="/media/clinic-clinician-poster.jpg"
    label="A clinician working at a laptop in a clinic."
  >
    Built for the clinic as it is.
  </FootageBand>
);
