import { CareJourney } from "medirevs-v2";

/**
 * The DoctoRevs journey: one continuous path with six stations — patient,
 * doctor, prescription, pharmacy, laboratory, follow-up. The path draws on
 * entry and a single signal loops along it; a still shows the drawn path.
 *
 * It sets `min-w-[760px]` on its scroller, so it wants a wide stage.
 */
export const Default = () => <CareJourney />;

/** In its band, under the section header that introduces it. */
export const InSection = () => (
  <div className="py-8">
    <p className="label mb-8 text-brand-dark">03 / One visit, end to end</p>
    <h2 className="h2 measure mb-12">
      A single visit usually involves four different people.
    </h2>
    <CareJourney />
  </div>
);
