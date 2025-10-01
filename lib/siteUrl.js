export function getBaseUrl() {
  const raw = 
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof process.env.VERCEL_URL !== 'undefined' && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://cyberooms-seo-site.vercel.app");
  
  // Normalize: remove trailing slashes
  return raw.replace(/\/+$/, "");
}