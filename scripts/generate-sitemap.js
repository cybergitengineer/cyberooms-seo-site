// scripts/generate-sitemap.js
const fs = require("fs");
const path = require("path");

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://cyberooms-seo-site.vercel.app").replace(/\/+$/, "");

// --- sitemap.xml (keep whatever you already had; example below) ---
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc></url>
  <url><loc>${baseUrl}/ai-security-tools-2025</loc></url>
</urlset>`;
fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);

// --- robots.txt points at *this* host’s sitemap ---
const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
fs.writeFileSync(path.join(process.cwd(), "public", "robots.txt"), robots);

console.log(`[generate] Wrote sitemap.xml and robots.txt for ${baseUrl}`);
