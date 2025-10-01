// pages/[slug].js
import Head from "next/head";
import { getAllPosts, getPostBySlug } from "../lib/posts";
import { makeCanonicalUrl } from "../lib/siteUrl";

export default function PostPage({ post }) {
  // Guard just in case (build will also 404 via getStaticProps)
  if (!post) {
    return <div className="container">Post not found.</div>;
  }

  const canonical = makeCanonicalUrl(post.slug);

  return (
    <>
      <Head>
        <title>{post.title || "Article"}</title>
        <meta name="description" content={post.description || ""} />
        {canonical && <link rel="canonical" href={canonical} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title || "Article"} />
        <meta property="og:description" content={post.description || ""} />

        {/* JSON-LD */}
        {canonical && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.description,
                datePublished: post.datePublished,
                dateModified: post.updatedAt || post.datePublished,
                author: { "@type": "Person", name: post.author || "Cyberooms" },
                mainEntityOfPage: canonical,
              }),
            }}
          />
        )}
      </Head>

      <div className="container">
        <h1 className="site-title">{post.title}</h1>
        <p className="meta">
          <time dateTime={post.datePublished}>{post.datePublished}</time> · {post.author}
        </p>
        <hr />
        <article dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false, // all pages are generated at build time
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);

  // If no post for this slug, return a 404
  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
}
