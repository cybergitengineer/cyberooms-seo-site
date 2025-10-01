// pages/[slug].js
import Head from "next/head";
import { getAllPosts, getPostBySlug } from "../lib/posts";
import { makeCanonicalUrl } from "../lib/siteUrl";

export default function PostPage({ post }) {
  const canonicalUrl = post?.slug ? makeCanonicalUrl(post.slug) : undefined;

  return (
    <>
      <Head>
        <title>{post?.title || "Article"}</title>
        <meta name="description" content={post?.description || ""} />

        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="article" />

        {/* Optional: keep previews out of the index */}
        {process.env.VERCEL_ENV !== "production" && (
          <meta name="robots" content="noindex, nofollow" />
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

export async function getStaticPaths() {
  const posts = getAllPosts();
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  return { props: { post } };
}
