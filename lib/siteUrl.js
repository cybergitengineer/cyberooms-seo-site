// lib/siteUrl.js
export function getBaseUrl() {
  // Single source of truth.
  // Always read from NEXT_PUBLIC_SITE_URL set in Vercel.
  const url = process.env.NEXT_PUBLIC_SITE_URL || "";
  return url.replace(/\/+$/, ""); // strip any trailing slashes
}

