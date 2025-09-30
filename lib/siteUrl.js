// lib/siteUrl.js
export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.NEXT_PUBLIC_VERCEL_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`.replace(/\/$/, "");
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  return "";
}
