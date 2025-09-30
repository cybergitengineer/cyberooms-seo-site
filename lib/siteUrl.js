// lib/siteUrl.js
export function getBaseUrl() {
  // Single source of truth. No fallback to SITE_URL or hard-coded domains.
  const url = process.env.NEXT_PUBLIC_SITE_URL || "";
  return url.replace(/\/+$/, "");
}
