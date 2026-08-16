import { NewsletterForm } from "medirevs-v2";

/**
 * The footer signup. Its chrome is written for a dark band — white/40 label,
 * white/15 field border, a white submit — so it only exists on dark. On paper
 * it renders invisible, which is not a bug in the component.
 */
export const OnDark = () => (
  <div className="bg-lab p-12">
    <div className="max-w-xl">
      <NewsletterForm />
    </div>
  </div>
);

/** In its real setting: the Footer's newsletter band, beside the copy. */
export const InBand = () => (
  <div className="bg-lab p-12 text-white">
    <div className="grid gap-10 sm:grid-cols-[1fr_1.1fr] sm:gap-16">
      <div>
        <p className="label mb-6 text-white/40">Newsletter</p>
        <h2 className="h3 max-w-[22ch] text-white">
          Notes on building health technology in Africa.
        </h2>
        <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/55">
          Now and then we write about digital health, clinical systems and what
          Medirevs Labs is working on. Nothing else.
        </p>
      </div>
      <div className="sm:pt-10">
        <NewsletterForm />
      </div>
    </div>
  </div>
);
