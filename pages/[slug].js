// pages/[slug].js
import Head from "next/head";

/**
 * Article page
 * Expects `post` prop with:
 *  - title, slug, description, author, datePublished, updatedAt, contentHtml
 * Canonical/OG URLs are built from NEXT_PUBLIC_SITE_URL.
 */
export default function PostPage({ post }) {
  const slug = post?.slug || "";
  const canonicalUrl =
    process.env.NEXT_PUBLIC_SITE_URL && slug
      ? `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "")}/${slug}`
      : undefined;

  return (
    <>
      <Head>
        <title>{post?.title || "Article"}</title>
        <meta name="description" content={post?.description || ""} />

        {/* Canonical + OG */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post?.title || "Article"} />
        <meta property="og:description" content={post?.description || ""} />

        {/* JSON-LD */}
        {canonicalUrl && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post?.title,
                description: post?.description,
                datePublished: post?.datePublished,
                dateModified: post?.updatedAt || post?.datePublished,
                author: { "@type": "Person", name: post?.author || "Cyberooms" },
                mainEntityOfPage: canonicalUrl,
              }),
            }}
          />
        )}
      </Head>

      <div className="container">
        <h1 className="site-title">{post?.title}</h1>
        <p className="meta">
          <time dateTime={post?.datePublished}>{post?.datePublished}</time> · {post?.author}
        </p>
        <hr />
        <article dangerouslySetInnerHTML={{ __html: post?.contentHtml || "" }} />
      </div>
    </>
  );
}

/**
 * Use dynamic imports so server-only code (fs/path) doesn't end up in the client bundle.
 */
export async function getStaticPaths() {
  const { getAllPosts } = await import("../lib/posts");
  const posts = getAllPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { getPostBySlug } = await import("../lib/posts");
  const post = getPostBySlug(params.slug);
  return { props: { post } };
}
