import type { ReactNode } from "react";

/**
 * Interior page opening. Deliberately quieter than the homepage hero:
 * type, one rule, and air.
 */
export default function PageHero({
  kicker,
  title,
  lede,
  meta,
  dark = false,
  children,
}: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  meta?: { label: string; value: ReactNode }[];
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={dark ? "bg-lab" : "bg-page"}>
      {/* Top padding clears the fixed nav (80-96px) and no more. It was 160/192px,
          which left a band of dead page above every interior page's kicker. */}
      <div className="shell pb-14 pt-28 sm:pb-20 sm:pt-32">
        <p className={`label mb-10 ${dark ? "text-white/40" : "text-brand-dark"}`}>{kicker}</p>

        <h1 className={`h1 max-w-[18ch] text-balance ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h1>

        {lede && (
          <p className={`lede mt-8 max-w-[56ch] ${dark ? "text-white/65" : "text-charcoal"}`}>
            {lede}
          </p>
        )}

        {children}

        {meta && meta.length > 0 && (
          <dl
            className={`mt-16 grid gap-px border-t ${
              dark ? "border-white/10 bg-white/10" : "border-line bg-line"
            } sm:grid-cols-2 lg:grid-cols-4`}
          >
            {meta.map((item) => (
              <div key={item.label} className={`px-0 py-6 sm:px-6 ${dark ? "bg-lab" : "bg-page"}`}>
                <dt className={`label mb-3 ${dark ? "text-white/40" : "text-brand-dark"}`}>
                  {item.label}
                </dt>
                <dd className={`text-[0.9375rem] ${dark ? "text-white/85" : "text-ink"}`}>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
