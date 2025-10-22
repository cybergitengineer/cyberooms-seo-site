/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: { unoptimized: true },
  trailingSlash: true,
  distDir: 'out', // 👈 ensures Next.js builds directly to /out
};

module.exports = nextConfig;
