// lib/siteUrl.js

/**
 * Single source of truth for your public site origin.
 * - In Production: MUST be set via NEXT_PUBLIC_SITE_URL (e.g. https://cyberooms.com/ai)
 * - In Preview/Dev: we still return the production base for canonical,
 *   so we never leak vercel.app into <link rel="canonical"> or og:url.
 */
export function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_SITE_URL; // expected like: https://cyberooms.com/ai
  if (!base) {
    // Be loud in production if the var is missing.
    if (process.env.VERCEL_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is not set. Set it to your canonical origin (e.g. https://cyberooms.com/ai)."
      );
    }
    // Local/dev fallback only to keep dev server running; this does NOT get deployed.
    return "http://localhost:3000";
  }
  return base.replace(/\/+$/, ""); // strip trailing slash
}

/**
 * Convenience helper to build absolute URLs for a given slug.
 */
export function makeCanonicalUrl(slug) {
  const base = getBaseUrl();
  const clean = String(slug || "").replace(/^\/+/, ""); // remove leading slash
  return `${base}/${clean}`;
}
