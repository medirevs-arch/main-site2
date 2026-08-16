import { EditorialStatement } from "medirevs-v2";

/**
 * The full-bleed pull quote the site uses between bands. It carries `.shell`
 * itself, so it wants the page's own width — no wrapper.
 */
export const Default = () => (
  <EditorialStatement>
    Healthcare. Connected. Evolved.
  </EditorialStatement>
);

/** The longer form: a statement plus the sentence that qualifies it. */
export const WithFootnote = () => (
  <EditorialStatement footnote="Medirevs builds clinical software, health data tools and medical technology for healthcare in Africa — starting in Ghana, designed for the network that is actually there.">
    We build for the clinic as it is, not the clinic in the brochure.
  </EditorialStatement>
);
