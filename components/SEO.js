// Add this function
function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 
         (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
}

// Then use it
const jsonLd = {
  "@context": "https://schema.org",
  "url": `${getSiteUrl()}/${slug}`,  // ← Changed
  // ...
};
import Head from 'next/head'

// JSON-LD generator
export function generateJsonLd({ title, description, slug }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${siteUrl}/${slug}`,
    author: { "@type": "Person", name: "Edgar Pfuma" },
    publisher: {
      "@type": "Organization",
      name: "Cyberooms AI",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`
      }
    }
  };
}


export default function SEO({ title, description, url, type = 'article', jsonLd = null }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={url || ''} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </Head>
  )
}
