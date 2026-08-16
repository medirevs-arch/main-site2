import { PageHero, StatusChip, TextLink } from "medirevs-v2";

/**
 * The interior page opening. The tall top padding is deliberate — it clears
 * the fixed navigation on a real page, so a card shows more air above the
 * kicker than a cropped screenshot would.
 */
export const Default = () => (
  <PageHero
    kicker="Products"
    title="Three products, one record."
    lede="Clinical software, health data tools and medical technology, built for healthcare in Africa."
  />
);

/** `meta` draws a hairline definition grid under the lede. */
export const WithMeta = () => (
  <PageHero
    kicker="Medirevs Labs / Project 01"
    title="The low-cost microscope."
    lede="A teaching microscope a department can afford to own, built with a student team from the University of Ghana School of Engineering Sciences."
    meta={[
      { label: "Status", value: "In development" },
      { label: "Partner", value: "UG School of Engineering Sciences" },
      { label: "Discipline", value: "Optics, mechanical design" },
      { label: "First build", value: "2026" },
    ]}
  />
);

/** `children` slot under the lede — here the product status and a link out. */
export const WithChildren = () => (
  <PageHero
    kicker="Products / 01"
    title="DoctoRevs."
    lede="One platform connecting patients, doctors, pharmacists and medical laboratories."
  >
    <div className="mt-10 flex flex-wrap items-center gap-5">
      <StatusChip status="Beta" />
      <TextLink href="https://doctorevs.com" external className="text-brand-dark">
        doctorevs.com
      </TextLink>
    </div>
  </PageHero>
);

/** `dark` is what Medirevs Labs uses — it stays dark in both site builds. */
export const OnDark = () => (
  <PageHero
    dark
    kicker="Medirevs Labs"
    title="Instruments, not just interfaces."
    lede="A hardware lab inside a software company, because somewhere at the start of the chain a physical instrument has to exist, work, and be affordable."
    meta={[
      { label: "Founded", value: "2026" },
      { label: "Based", value: "Accra, Ghana" },
      { label: "Focus", value: "Biomedical instrumentation" },
    ]}
  />
);
