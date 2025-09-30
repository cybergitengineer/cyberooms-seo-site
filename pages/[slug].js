// pages/[slug].js
import Head from "next/head";
import { getAllPosts, getPostBySlug } from "../lib/posts";

export default function PostPage({ post }) {
  const slug = post?.slug || "";
  const canonicalUrl =
    process.env.NEXT_PUBLIC_SITE_URL && slug
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`
      : undefined;

  return (
    <Head>
      <title>{post?.title || "Article"}</title>
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
    </Head>
  );
}
