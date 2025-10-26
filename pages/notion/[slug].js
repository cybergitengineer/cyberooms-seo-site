import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";

// ──────────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────────
export default function NotionPost({ post }) {
  if (!post) return <div className="container">Post not found.</div>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description || ""} />
      </Head>

      <main className="container">
        <h1>{post.title}</h1>
        <article
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ lineHeight: "1.6em", marginTop: "1.5em" }}
        />
      </main>
    </>
  );
}

// ──────────────────────────────────────────────
// Generate all dynamic paths from Markdown files
// ──────────────────────────────────────────────
export async function getStaticPaths() {
  const contentDir = path.join(process.cwd(), "content");

  // Only process Markdown files (.md)
  const files = fs
    .readdirSync(contentDir)
    .filter((file) => file.endsWith(".md"));

  const paths = files.map((file) => ({
    params: { slug: file.replace(/\.md$/, "") },
  }));

  return { paths, fallback: false };
}

// ──────────────────────────────────────────────
// Fetch and parse content for each slug
// ──────────────────────────────────────────────
export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "content", `${params.slug}.md`);

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(fileContent);

    return {
      props: {
        post: {
          ...data,
          title: data.title || params.slug,
          description: data.description || "",
          content: content.replace(/\n/g, "<br />"),
        },
      },
    };
  } catch (error) {
    console.error("Error loading markdown:", error);
    return { props: { post: null } };
  }
}
