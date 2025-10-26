/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // ✅ Required for static HTML exports (Next.js 13+)
  output: 'export',

  // ✅ Prevent image optimization errors in static builds
  images: {
    unoptimized: true,
  },

  // ✅ Optional but useful for GitHub/Vercel paths
  trailingSlash: true,
};

module.exports = nextConfig;
