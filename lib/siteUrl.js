// lib/siteUrl.js
export function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  const normalized = (raw || "").replace(/\/+$/, "");

  // DEBUG: log during build (check Vercel logs once, then remove)
  console.log(
    `[build:getBaseUrl] NEXT_PUBLIC_SITE_URL="${process.env.NEXT_PUBLIC_SITE_URL}" VERCEL_URL="${process.env.VERCEL_URL}" → using "${normalized}"`
  );

  return normalized;
}
