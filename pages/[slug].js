// pages/[slug].js
import Head from "next/head";
import { getAllPosts, getPostBySlug } from "../lib/posts";
import { getBaseUrl } from "../lib/siteUrl";

export default function PostPage({ post }) {
  const base = getBaseUrl();
  const url = base && post?.slug ? `${base}/${post.slug}` : undefined;

  return (
    <>
      <Head>
        <title>{post?.title || "Article"}</title>
        <meta name="description" content={post?.description || ""} />
        {url && <link rel="canonical" href={url} />}
        {url && <meta property="og:url" content={url} />}
        <meta property="og:type" content="article" />
        {url && (
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
                mainEntityOfPage: url,
              }),
            }}
          />
        )}
      </Head>

      <div className="container">
        <h1 className="site-title">{post?.title}</h1>
        <p className="meta">
          <time dateTime={post?.datePublished}>{post?.datePublished}</time> ·{" "}
          {post?.author}
        </p>
        <hr />
        {/* Render parsed HTML with fallback */}
        <article
          className="content"
          dangerouslySetInnerHTML={{
            __html: post?.contentHtml || "<p>[No content found]</p>",
          }}
        />
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
  return { props: { post } };
}
