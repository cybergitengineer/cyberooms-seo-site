// lib/siteUrl.js
export function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return (raw || "").replace(/\/+$/, "");
}

export function makeCanonicalUrl(slug) {
  const base = getBaseUrl();
  if (!base || !slug) return "";
  return `${base.replace(/\/+$/, "")}/${slug}`.replace(/\/+$/, "");
}
