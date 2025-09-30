// pages/index.js
import Head from "next/head";

export default function Home() {
  // Use the environment variable (fall back to a default if not set)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <Head>
        <title>Cyberooms Knowledge Base</title>
        <meta
          name="description"
          content="Static, SEO-friendly pages generated from Notion."
        />
        {/* 👇 Canonical URL now points to your environment variable */}
        <link rel="canonical" href={siteUrl} />
        <meta property="og:url" content={siteUrl} />
      </Head>

      <main>
        <h1>Welcome to Cyberooms Knowledge Base</h1>
        <p>
          This site is powered by Next.js and Notion. Deployed on Vercel.
        </p>
      </main>
    </>
  );
}
