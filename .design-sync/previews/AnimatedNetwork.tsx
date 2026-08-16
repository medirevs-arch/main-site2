import { AnimatedNetwork, SectionHeader } from "medirevs-v2";

/**
 * The care network as a flat SVG: patient, clinician, pharmacy, laboratory
 * and health facility, each tied to one record at the centre, plus the peer
 * links between them. Paths draw themselves on entry and a signal travels
 * them on a loop; a card shows the settled diagram.
 *
 * Note it is a light-surface graphic — node discs are filled white and the
 * labels are charcoal, with no dark variant. On the site it sits on the
 * `bg-wash` band, which is where these cards put it too.
 */
export const Default = () => (
  <div className="max-w-3xl">
    <AnimatedNetwork className="w-full" />
  </div>
);

/** The homepage band, verbatim in shape: header on the left, figure right. */
export const InBand = () => (
  <div className="bg-wash p-12">
    <div className="grid items-center gap-14 sm:grid-cols-[0.8fr_1.2fr]">
      <SectionHeader
        index="02"
        kicker="The system"
        title="One visit, five people, one record."
      />
      <AnimatedNetwork className="w-full" />
    </div>
  </div>
);
