export function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  const normalized = (raw || "").replace(/\/+$/, "");
  return normalized;
}

export function makeCanonicalUrl(slug) {
  const base = getBaseUrl();
  return `${base}/${slug}`.replace(/\/+$/, "");
}
