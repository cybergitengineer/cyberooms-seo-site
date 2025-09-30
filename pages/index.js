// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { getAllPosts } from "../lib/posts";
import { getBaseUrl } from "../lib/siteUrl";

export default function Home({ posts }) {
  const base = getBaseUrl();

  return (
    <>
      <Head>
        <title>Cyberooms Knowledge Base</title>
        <meta
          name="description"
          content="Static, SEO-friendly pages generated from Notion."
        />
        {base && <link rel="canonical" href={base} />}
        {base && <meta property="og:url" content={base} />}
        <meta property="og:type" content="website" />
      </Head>

      <div className="container">
        <h1 className="site-title">Cyberooms Knowledge Base</h1>
        <p className="meta">
          Static, SEO-friendly pages generated from Notion.
        </p>
        <hr />

        <ul>
          {posts.map((p) => (
            <li key={p.slug} style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ margin: "0 0 0.25rem 0", fontWeight: 600 }}>
                <Link href={`/${p.slug}`} legacyBehavior>
                  <a>{p.title}</a>
                </Link>
              </h3>
              <p className="meta">
                <time dateTime={p.datePublished}>{p.datePublished}</time> ·{" "}
                {p.author}
              </p>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}
