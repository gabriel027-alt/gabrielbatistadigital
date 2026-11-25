/**
 * In the Vercel production deployment only the homepage is public; the approved brands appear there as films.
 * Review routes (old template models, old concepts, every /propostas page) redirect home there, while local runs
 * and Vercel previews keep them for review and for the test suite. HIDE_REVIEW_ROUTES=1 simulates production.
 */
const hideReviewRoutes = process.env.VERCEL_ENV === "production" || process.env.HIDE_REVIEW_ROUTES === "1";
/** Taken offline on 12/11/2026 by the user's decision while the projects were rebuilt; back online on 25/11/2026 by his
 *  order. Set to true to put the holding page back. */
const siteOffline = hideReviewRoutes && false;
/** The brand sites the homepage links to ("Ver o site"); the only model and proposal pages public in production. */
const publicSites = Object.values(require("./lib/public-brand-sites.json"));
/** The page names under a prefix that stay public, as a regex alternation that matches the whole segment. */
const except = prefix => `(?:${publicSites.filter(path => path.startsWith(prefix)).map(path => path.slice(prefix.length)).join("|")})$`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // 90 for the portrait and project samples, which are shown large on Full HD screens.
  images: { qualities: [75, 90] },
  // Keep the original source out of the browser in production (this is Next's default; stated so it is not switched on by accident).
  productionBrowserSourceMaps: false,
  async redirects() {
    // While the site is offline, every production page goes to the holding page (static files keep working).
    if (siteOffline) return [{ source: "/((?!em-breve|_next|images|icon|favicon|robots\\.txt).*)", destination: "/em-breve", permanent: false }];
    if (!hideReviewRoutes) return [];
    return [
      // Since 24/11/2026 (the user's request) the featured brands have "Ver o site" on the homepage, so those pages are
      // public (lib/public-brand-sites.json); every other model and proposal still goes home.
      { source: "/modelos", destination: "/", permanent: false },
      { source: `/modelos/:path((?!${except("/modelos/")}).*)`, destination: "/", permanent: false },
      { source: "/conceitos/:path*", destination: "/", permanent: false },
      { source: "/propostas", destination: "/", permanent: false },
      { source: `/propostas/:path((?!${except("/propostas/")}).*)`, destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
      // The brand sites are portfolio pieces, not real businesses: kept out of search results.
      ...publicSites.map(source => ({ source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] })),
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
