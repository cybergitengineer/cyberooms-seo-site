// In next-seo.config.js at the top
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
console.log('VERCEL_URL:', process.env.VERCEL_URL);
console.log('Final URL being used:', url);
const url =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://cyberooms-seo-site.vercel.app";

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