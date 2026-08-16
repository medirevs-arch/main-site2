import { Gallery, MEDIREVS_ASSETS } from "medirevs-v2";

// Gallery renders plain <img>, not next/image, so srcs have to be real URLs.
const items = [
  {
    src: MEDIREVS_ASSETS["/media/labs-objective-poster.jpg"],
    alt: "The objective assembly on the Medirevs Labs bench",
    caption: "The objective assembly, printed and mounted in the lab.",
    wide: true,
  },
  {
    src: MEDIREVS_ASSETS["/media/clinic-consultation-poster.jpg"],
    alt: "A clinician and a patient during a consultation",
    caption: "A consultation in progress at a partner facility.",
  },
  {
    src: MEDIREVS_ASSETS["/media/doctorevs-network-poster.jpg"],
    alt: "The DoctoRevs network visualised",
    caption: "The DoctoRevs record, moving between clinic, pharmacy and lab.",
    conceptual: true,
  },
];

/** With images configured. `wide: true` lets the first one span both columns. */
export const WithImages = () => (
  <Gallery items={items} placeholderLabel="Lab" />
);

/**
 * The empty state is the interesting one: with nothing configured, Gallery
 * draws labelled frames so the section already holds its final shape.
 */
export const Placeholders = () => (
  <Gallery items={[]} placeholderLabel="Lab bench" />
);

/** `columns={3}` tightens the grid for smaller, more numerous images. */
export const ThreeColumn = () => (
  <Gallery items={items.map((i) => ({ ...i, wide: false }))} placeholderLabel="Field" columns={3} />
);

/** `dark` moves the frames and captions onto a dark band. */
export const OnDark = () => (
  <div className="bg-lab p-12">
    <Gallery dark items={[]} placeholderLabel="Microscope" columns={3} />
  </div>
);
