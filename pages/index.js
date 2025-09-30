// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { getAllPosts } from "../lib/posts"; // <-- your existing helper
import { getBaseUrl } from "../lib/siteUrl";

export default function Home({ posts }) {
  const base = getBaseUrl();
  const canonical = base ? `${base}/` : undefined;

  return (
    <>
      <Head>
        <title>Cyberooms Knowledge Base</title>
        <meta
          name="description"
          content="Static, SEO-friendly pages generated from Notion."
        />
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
            <li key={p.slug} style={{ margin: "0.5rem 0" }}>
              <Link href={`/${p.slug}`}>{p.title}</Link>
              <div style={{ fontSize: 12, opacity: 0.75 }}>
                {p.datePublished} · {p.author}
              </div>
              <div style={{ fontSize: 14 }}>{p.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts(); // reads your local content/ or data file
  return { props: { posts } };
}

