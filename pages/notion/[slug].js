import "github-markdown-css/github-markdown-light.css";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.description || "",
              author: {
                "@type": "Person",
                name: "Cyberooms AI Team",
              },
              publisher: {
                "@type": "Organization",
                name: "Cyberooms",
                logo: {
                  "@type": "ImageObject",
                  url: "https://ai.cyberooms.com/logo.png",
                },
              },
              datePublished: new Date().toISOString(),
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://ai.cyberooms.com/notion/${post.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
              },
            }),
          }}
        />
      </Head>


      <main className="container markdown-body" style={{ padding: "2rem" }}>
        <h1>{post.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
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
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Missing file for slug: ${params.slug}`);
      return {
        props: {
          post: {
            title: "Notion Sync Pending",
            description: `The page **${params.slug}** hasn’t been synced from Notion yet.`,
            content: "This content will appear automatically after the next Notion sync.",
          },
        },
      };
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(fileContent);

    return {
      props: {
        post: {
          ...data,
          title: data.title || params.slug,
          description: data.description || "",
          content,
        },
      },
    };
  } catch (error) {
    console.error("❌ Error loading markdown:", error);
    return {
      props: {
        post: {
          title: "Error Loading Page",
          description: "There was an issue loading this content.",
          content: "<p>Please check the logs or retry syncing from Notion.</p>",
        },
      },
    };
  }
}
