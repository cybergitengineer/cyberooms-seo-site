import Head from "next/head";
import { getAllPosts, getPostBySlug } from "../lib/posts";
import { makeCanonicalUrl } from "../lib/siteUrl";

export default function PostPage({ post }) {
  if (!post) return <div className="container">Post not found.</div>;

  const canonical = makeCanonicalUrl(post.slug);

  // Inline JSON-LD string
  const jsonLd = canonical
    ? `{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "${post.title}",
      "description": "${post.description}",
      "datePublished": "${post.datePublished}",
      "dateModified": "${post.updatedAt || post.datePublished}",
      "author": {"@type": "Person", "name": "${post.author || "Edgar Pfuma"}"},
      "publisher": {
        "@type": "Organization",
        "name": "Cyberooms AI",
        "logo": {"@type": "ImageObject","url": "https://ai.cyberooms.com/logo.png"}
      },
      "mainEntityOfPage": {"@type": "WebPage","@id": "${canonical}"},
      "keywords": "${post.keywords || ""}",
      "inLanguage": "en",
      "url": "${canonical}"
    }`
    : "";

  return (
    <>
      <Head>
        <title>{post.title || "Article"}</title>
        <meta name="description" content={post.description || ""} />
        <meta name="ai-search" content="optimized-for-llm" />
        <meta name="llm-friendly" content="true" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        {canonical && <link rel="canonical" href={canonical} />}
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title || "Article"} />
        <meta property="og:description" content={post.description || ""} />
      </Head>

      <div className="container">
        <h1 className="site-title">{post.title}</h1>
        <p className="meta">
          <time dateTime={post.datePublished}>{post.datePublished}</time> · {post.author}
        </p>
        <hr />
        <article dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }} />

        {/* ✅ Guaranteed static JSON-LD output */}
        {jsonLd && (
          <div
            id="structured-data"
            dangerouslySetInnerHTML={{
              __html: `<script type="application/ld+json">${jsonLd}</script>`,
            }}
          />
        )}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { notFound: true };
  return { props: { post } };
}
