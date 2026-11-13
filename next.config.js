/**
 * In the Vercel production deployment only the homepage and the approved brand pages are public.
 * Review routes (old template models, old concepts, every /propostas page) redirect home there, while local runs
 * and Vercel previews keep them for review and for the test suite. HIDE_REVIEW_ROUTES=1 simulates production.
 */
const hideReviewRoutes = process.env.VERCEL_ENV === "production" || process.env.HIDE_REVIEW_ROUTES === "1";
const oldTemplateModels = ["agro", "ciberseguranca", "consultoria", "contabilidade", "dermatologia", "educacao", "energia", "gastronomia", "imoveis", "interiores", "logistica", "medicina", "psicologia", "seguros"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Keep the original source out of the browser in production (this is Next's default; stated so it is not switched on by accident).
  productionBrowserSourceMaps: false,
  async redirects() {
    if (!hideReviewRoutes) return [];
    return [
      { source: `/modelos/:slug(${oldTemplateModels.join("|")})`, destination: "/", permanent: false },
      { source: "/conceitos/:path*", destination: "/", permanent: false },
      { source: "/propostas", destination: "/", permanent: false },
      { source: "/propostas/:path*", destination: "/", permanent: false },
    ];
  },
  async headers() {
    return [
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
