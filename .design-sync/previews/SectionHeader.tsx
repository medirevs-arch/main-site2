import { SectionHeader } from "medirevs-v2";

/** The standard section opening: numbered kicker, h2, lede. */
export const Numbered = () => (
  <SectionHeader
    index="02"
    kicker="What we build"
    title="Clinical software that holds up in the room it is used in."
    lede="Three products, one record. Built for facilities where the connection drops, the queue is long, and the paperwork still has to be right."
  />
);

/** Without `index` the rule and slash are dropped and the kicker stands alone. */
export const KickerOnly = () => (
  <SectionHeader
    kicker="Medirevs Labs"
    title="Instruments, not just interfaces."
    lede="Software can move a lab result across the country. It cannot produce the result."
  />
);

/** `dark` recolours the whole block for placement on a lab or navy band. */
export const OnDark = () => (
  <div className="bg-lab p-12">
    <SectionHeader
      dark
      index="04"
      kicker="The low-cost microscope"
      title="A teaching microscope a department can actually afford to own."
      lede="Built with a student team from the University of Ghana School of Engineering Sciences."
    />
  </div>
);

/** Title only — the compact form used above dense content. */
export const TitleOnly = () => <SectionHeader title="Selected writing" />;
