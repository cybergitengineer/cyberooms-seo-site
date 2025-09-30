// lib/siteUrl.js

/**
 * Returns the base URL for canonical/OG/meta tags.
 * Uses the NEXT_PUBLIC_SITE_URL environment variable,
 * trims any trailing slash, and ensures consistency.
 *
 * Example:
 *   process.env.NEXT_PUBLIC_SITE_URL = "https://cyberooms.com/ai/"
 *   -> getBaseUrl() = "https://cyberooms.com/ai"
 */
export function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "";
  
  if (!raw) {
    console.warn(
      "[siteUrl] NEXT_PUBLIC_SITE_URL is not defined. Falling back to empty string."
    );
    return "";
  }

  // Normalize: remove trailing slashes
  return raw.replace(/\/+$/, "");
}

