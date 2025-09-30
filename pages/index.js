// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { getBaseUrl } from "../lib/siteUrl";

// minimal demo list; your actual posts list code can remain
export default function Home({ posts = [] }) {
  const base = getBaseUrl();
  const canonical = base ? `${base}/` : undefined;

  return (
    <>
      <Head>
        <title>Cyberooms Knowledge Base</title>
        <meta name="description" content="Static, SEO-friendly pages generated from Notion." />
        {canonical && <link rel="canonical" href={canonical} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:type" content="website" />
      </Head>

      <div className="container">
        <h1 className="site-title">Cyberooms Knowledge Base</h1>
        <p className="meta">Static, SEO-friendly pages generated from Notion.</p>
        <hr />
        <ul>
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/${p.slug}`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
