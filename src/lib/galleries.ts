/**
 * ============================================================
 *  EDITABLE IMAGE GALLERIES
 * ============================================================
 *
 *  To add a photo or screenshot:
 *
 *  1. Drop the file into  /public/gallery/
 *  2. Add an entry to the matching array below.
 *  3. Save. That's it — no component changes needed.
 *
 *  Every entry needs `src`, `alt` and `caption`. `alt` is what a
 *  screen-reader user hears, so describe the image; `caption` is the
 *  visible line underneath it.
 *
 *  Set `wide: true` to let an image span two columns.
 *
 *  While an array is empty the page renders labelled placeholder frames
 *  instead, so the layout is already correct when the real images arrive.
 * ============================================================
 */

export type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  /** Marks an image as a concept visual rather than finished hardware. */
  conceptual?: boolean;
  wide?: boolean;
};

/** DoctoRevs product screenshots and photography. */
export const DOCTOREVS_GALLERY: GalleryItem[] = [
  // {
  //   src: "/gallery/doctorevs-booking.png",
  //   alt: "The DoctoRevs appointment booking screen on a mobile phone",
  //   caption: "Booking an appointment",
  // },
];

/** Medirevs Labs — collaboration and visit photography. */
export const LABS_COLLABORATION_GALLERY: GalleryItem[] = [
  {
    src: "/media/blogs/ses-partnership.jpg",
    alt: "The Medirevs team with staff of the School of Engineering Sciences at the University of Ghana, following a courtesy call on the Dean.",
    caption:
      "Medirevs at the School of Engineering Sciences, University of Ghana — delivering supplies to the student team building the low-cost microscope.",
    wide: true,
  },
];

/** Low-cost microscope — prototype and research photography. */
export const MICROSCOPE_GALLERY: GalleryItem[] = [
  // {
  //   src: "/gallery/microscope-prototype-01.jpg",
  //   alt: "…",
  //   caption: "…",
  // },
];

/** How many placeholder frames to draw while a gallery is still empty. */
export const PLACEHOLDER_COUNT = 3;
