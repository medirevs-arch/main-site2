// design-sync host shim for `next/navigation`.
//
// Navigation and NavigationStudio call usePathname() to mark the active nav
// item. With no App Router mounted the real hook throws, so this returns a
// settable path instead: set `window.__dsPathname` before render (a preview
// can do this to show the active state for a given route). Wired in via
// compilerOptions.paths in tsconfig.ds.json.

declare global {
  interface Window {
    __dsPathname?: string;
  }
}

export function usePathname(): string {
  return (typeof window !== "undefined" && window.__dsPathname) || "/";
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  );
}

export function useParams<T extends Record<string, string | string[]>>(): T {
  return {} as T;
}

const noop = () => {};

export function useRouter() {
  return {
    push: noop,
    replace: noop,
    refresh: noop,
    back: noop,
    forward: noop,
    prefetch: noop,
  };
}

export function useSelectedLayoutSegment(): string | null {
  return null;
}

export function useSelectedLayoutSegments(): string[] {
  return [];
}

export function redirect(_url: string): never {
  throw new Error("redirect() is not available outside Next.js");
}

export function notFound(): never {
  throw new Error("notFound() is not available outside Next.js");
}
