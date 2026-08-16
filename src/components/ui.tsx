import Link from "next/link";
import type { ReactNode } from "react";

/* ---------------- Buttons ---------------- */

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost" | "light";
  external?: boolean;
  className?: string;
};

const BUTTON_BASE =
  "group/btn inline-flex items-center gap-2.5 rounded-sm px-6 py-3.5 text-[0.9375rem] font-medium transition-colors duration-200";

const BUTTON_VARIANTS: Record<string, string> = {
  solid: "bg-brand text-white hover:bg-brand-dark",
  outline: "border border-brand/35 text-brand-dark hover:border-brand hover:bg-brand/[0.06]",
  ghost: "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
  light: "bg-white text-ink hover:bg-white/90",
};

export function Button({ href, children, variant = "solid", external, className = "" }: ButtonProps) {
  const cls = `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      {children}
      <Arrow />
    </>
  );

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-300 ease-out group-hover/btn:translate-x-1 group-hover/link:translate-x-1 ${className}`}
    >
      <path d="M9 1L13 5L9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
      <path d="M13 5H0" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/* ---------------- Text link with drawn underline ---------------- */

export function TextLink({
  href,
  children,
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  const cls = `group/link inline-flex items-center gap-2 text-[0.9375rem] font-medium ${className}`;
  const inner = (
    <>
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover/link:scale-x-100" />
      </span>
      <Arrow />
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

/* ---------------- Section header ---------------- */

export function SectionHeader({
  index,
  kicker,
  title,
  lede,
  dark = false,
  className = "",
}: {
  index?: string;
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {(index || kicker) && (
        <p className={`label mb-8 flex items-center gap-3 ${dark ? "text-white/45" : "text-brand-dark"}`}>
          {index && <span className={dark ? "text-brand-bright" : "text-brand"}>{index}</span>}
          {index && kicker && (
            <span className={dark ? "text-white/20" : "text-brand/40"} aria-hidden="true">
              /
            </span>
          )}
          {kicker}
        </p>
      )}
      <h2 className={`h2 measure ${dark ? "text-white" : "text-ink"}`} data-reveal>
        {title}
      </h2>
      {lede && (
        <p
          className={`lede measure mt-6 ${dark ? "text-white/65" : "text-charcoal"}`}
          data-reveal
          style={{ ["--delay" as string]: "90ms" }}
        >
          {lede}
        </p>
      )}
    </div>
  );
}

/* ---------------- Status chip ---------------- */

export function StatusChip({
  status,
  dark = false,
}: {
  status: string;
  dark?: boolean;
}) {
  const live = status === "Beta" || status === "Early access";
  return (
    <span
      className={`label inline-flex items-center gap-2 rounded-full border px-3 py-1.5 ${
        dark ? "border-white/15 text-white/70" : "border-line text-slate"
      }`}
    >
      <span
        className="relative flex h-1.5 w-1.5"
        style={{ color: live ? "var(--color-signal)" : "var(--color-mist)" }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-current"
          style={live ? { animation: "pulse-signal 2.4s ease-in-out infinite" } : undefined}
        />
      </span>
      {status}
    </span>
  );
}

/* ---------------- Editorial statement ---------------- */

export function EditorialStatement({
  children,
  footnote,
  className = "",
}: {
  children: ReactNode;
  footnote?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`shell ${className}`}>
      <p
        className="h1 mx-auto max-w-[19ch] text-balance text-center text-ink sm:max-w-[24ch]"
        data-reveal
      >
        {children}
      </p>
      {footnote && (
        <p
          className="mx-auto mt-10 max-w-[52ch] text-center text-[1.0625rem] leading-relaxed text-slate"
          data-reveal
          style={{ ["--delay" as string]: "120ms" }}
        >
          {footnote}
        </p>
      )}
    </div>
  );
}
