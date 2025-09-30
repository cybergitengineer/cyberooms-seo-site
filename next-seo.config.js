const url =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://cyberooms-seo-site.vercel.app"; // safe default for preview

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
