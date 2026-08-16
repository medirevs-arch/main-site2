// design-sync host shim for `next/image`.
//
// The real component rewrites src through Next's optimizer endpoint
// (/_next/image?url=…), which does not exist outside a Next server — every
// image would 404. This renders a plain <img> and resolves site-absolute
// srcs ("/medirevs-logo.png") through the inlined public-asset map, so brand
// imagery travels with the bundle instead of depending on an origin.
// Wired in via compilerOptions.paths in tsconfig.ds.json.

import type { ImgHTMLAttributes } from "react";
import { PUBLIC_ASSETS } from "./public-assets";

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  // Next-only props, accepted and dropped so they never reach the DOM.
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
  overrideSrc?: string;
};

export default function Image({
  src,
  alt,
  width,
  height,
  style,
  priority,
  fill,
  quality: _quality,
  sizes,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  unoptimized: _unoptimized,
  loader: _loader,
  overrideSrc: _overrideSrc,
  loading,
  ...rest
}: ImageProps) {
  const resolved = PUBLIC_ASSETS[src] ?? src;
  const fillStyle = fill
    ? ({ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } as const)
    : undefined;

  return (
    <img
      src={resolved}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      loading={priority ? "eager" : (loading ?? "lazy")}
      decoding="async"
      style={fillStyle ? { ...fillStyle, ...style } : style}
      {...rest}
    />
  );
}
