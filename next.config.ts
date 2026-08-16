import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Dev only. `next dev` binds 0.0.0.0 and prints a Network URL, but Next 16
  // blocks cross-origin requests to /_next/* by default — so opening that
  // Network URL (from a phone, or a browser that remembered the LAN address)
  // gets the HTML and none of the JavaScript chunks. The page then renders
  // with no hydration: reveal animations never fire so copy looks missing,
  // menus don't open, and layout collapses into empty bands. The client
  // retries the blocked HMR socket forever, which pegs the dev server.
  //
  // Private ranges only, and `allowedDevOrigins` has no effect on a
  // production build.
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.*.*", "172.*.*.*", "10.*.*.*"],

  // The previous site's URLs, preserved.
  async redirects() {
    return [
      { source: "/doctorevs", destination: "/products/doctorevs", permanent: true },
      { source: "/medirevs-ehr", destination: "/products/ehr", permanent: true },
      { source: "/products/ai-ehr", destination: "/products/ehr", permanent: true },
      { source: "/data-solutions", destination: "/products/data-ai", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
