import { TextLink } from "medirevs-v2";

/**
 * The inline "keep reading" link. The underline is drawn on hover, so at rest
 * it is type plus an arrow — that resting state is what a card can show.
 */
export const Default = () => (
  <div className="flex flex-col items-start gap-5">
    <TextLink href="/products/doctorevs">Explore DoctoRevs</TextLink>
    <TextLink href="/mission">Read our mission</TextLink>
  </div>
);

/** Colour comes from the caller, which is how the site tunes it per band. */
export const Tinted = () => (
  <div className="flex flex-col items-start gap-5">
    <TextLink href="/blog" className="text-ink">
      All writing
    </TextLink>
    <TextLink href="/labs" className="text-brand-dark">
      Medirevs Labs
    </TextLink>
  </div>
);

/** On a dark band the caller passes a white-ish tone. */
export const OnDark = () => (
  <div className="flex flex-col items-start gap-5 bg-lab p-10">
    <TextLink href="/labs/low-cost-microscope" className="text-white">
      The low-cost microscope
    </TextLink>
    <TextLink href="/blog" className="text-white/70">
      Notes from the lab
    </TextLink>
  </div>
);

/** `external` renders a target-blank anchor instead of the router link. */
export const External = () => (
  <TextLink href="https://doctorevs.com" external className="text-brand-dark">
    doctorevs.com
  </TextLink>
);
