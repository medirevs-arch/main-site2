// design-sync host shim for `next/link`.
//
// The DS bundle runs in a plain React page with no Next.js App Router, so the
// real Link (which reads AppRouterContext for prefetch/navigation) cannot
// mount. Components in this repo only ever pass `href`, `className` and
// children, so an anchor is a faithful stand-in: same element, same semantics,
// same styling hooks. Wired in via compilerOptions.paths in tsconfig.ds.json.

import type { AnchorHTMLAttributes, ReactNode } from "react";

type Href = string | { pathname?: string; query?: Record<string, string> };

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: Href;
  children?: ReactNode;
  // Next-only props, accepted and dropped so they never reach the DOM.
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean | null;
  legacyBehavior?: boolean;
  locale?: string | false;
};

function toHref(href: Href): string {
  if (typeof href === "string") return href;
  const path = href?.pathname ?? "#";
  const query = href?.query
    ? "?" + new URLSearchParams(href.query).toString()
    : "";
  return path + query;
}

export default function Link({
  href,
  children,
  replace: _replace,
  scroll: _scroll,
  shallow: _shallow,
  passHref: _passHref,
  prefetch: _prefetch,
  legacyBehavior: _legacyBehavior,
  locale: _locale,
  ...rest
}: LinkProps) {
  return (
    <a href={toHref(href)} {...rest}>
      {children}
    </a>
  );
}
