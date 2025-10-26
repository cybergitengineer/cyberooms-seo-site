import fs from "fs";
import path from "path";
import Head from "next/head";

export default function NotionPost({ post }) {
  if (!post) return <div className="container">Post not found.</div>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description || ""} />
        <meta name="ai-search" content="optimized-for-llm" />
        <meta name="llm-friendly" content="true" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
      </Head>

      <div className="container">
        <h1>{post.title}</h1>
        <p>
          <strong>Author:</strong> {post.author || "Cyberooms AI"} <br />
          <strong>Date:</strong> {post.date || "N/A"}
        </p>
        <article dangerouslySetInnerHTML={{ __html: post.content || "" }} />
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), "content", "notion_sync.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const paths = data.results.map((item) => ({
    params: { slug: item.id },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "content", "notion_sync.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  const post = data.results.find((item) => item.id === params.slug);

  return { props: { post: post || null } };
}
