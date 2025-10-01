const url =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (typeof process.env.VERCEL_URL !== 'undefined' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://cyberooms-seo-site.vercel.app");

export default {
  title: "Cyberooms Knowledge Base",
  description: "AI-driven security knowledge base and insights from Cyberooms.",
  openGraph: {
    type: "website",
    url,
    site_name: "Cyberooms",
  },
  twitter: { cardType: "summary_large_image" },
};