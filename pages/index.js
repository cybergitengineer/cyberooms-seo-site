// pages/index.js
import Head from "next/head";
import Link from "next/link";

/**
 * Homepage listing
 */
export default function Home({ posts }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "")
    : "";

  return (
    <>
      <Head>
        <title>Cyberooms Knowledge Base</title>
        <meta
          name="description"
          content="Static, SEO-friendly pages generated from Notion."
        />
        {/* Optional canonical for the listing page */}
        {base && <link rel="canonical" href={base} />}
      </Head>

      <div className="container">
        <h1 className="site-title">Cyberooms Knowledge Base</h1>
        <p className="tagline">Static, SEO-friendly pages generated from Notion.</p>
        <hr className="divider" />

        <ul className="post-list">
          {posts.map((p) => (
            <li key={p.slug} className="post-item">
              <h2 className="post-title">
                <Link href={`/${p.slug}`}>{p.title}</Link>
              </h2>
              <div className="post-meta">
                <time dateTime={p.datePublished}>{p.datePublished}</time> · {p.author}
              </div>
              {p.description && <p className="post-desc">{p.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * Dynamic import keeps fs/path server-only.
 */
export async function getStaticProps() {
  const { getAllPosts } = await import("../lib/posts");
  const posts = getAllPosts();
  return { props: { posts } };
}
