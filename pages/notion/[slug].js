import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import Head from "next/head";

export default function PostPage({ post }) {
  if (!post)
    return <div className="container">Post not found.</div>;

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.description || ""} />
        <meta name="ai-search" content="optimized-for-llm" />
        <meta name="llm-friendly" content="true" />
        <meta
          name="robots"
          content="index,follow,max-snippet:-1,max-image-preview:large"
        />
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

// 🧩 Generate all slugs from both Markdown and Notion
export async function getStaticPaths() {
  const notionPath = path.join(process.cwd(), "content", "notion_sync.json");
  const markdownDir = path.join(process.cwd(), "content");

  let paths = [];

  // Markdown-based slugs
  const markdownFiles = fs
    .readdirSync(markdownDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      params: { slug: file.replace(".md", "") },
    }));

  paths.push(...markdownFiles);

  // Notion-based slugs
  if (fs.existsSync(notionPath)) {
    const jsonData = fs.readFileSync(notionPath, "utf-8");
    const data = JSON.parse(jsonData);

    const notionSlugs =
      data.results
        ?.filter((item) => item.properties?.Published?.checkbox)
        .map((item) => ({
          params: {
            slug:
              item.properties?.["Slug/URL"]?.rich_text?.[0]?.plain_text ||
              item.id,
          },
        })) || [];

    paths.push(...notionSlugs);
  }

  return { paths, fallback: false };
}

// ⚙️ Load either Markdown or Notion post content
export async function getStaticProps({ params }) {
  const { slug } = params;
  const notionPath = path.join(process.cwd(), "content", "notion_sync.json");
  const markdownPath = path.join(process.cwd(), "content", `${slug}.md`);

  // ✅ If a markdown file exists
  if (fs.existsSync(markdownPath)) {
    const markdownFile = fs.readFileSync(markdownPath, "utf-8");
    const { data: frontmatter, content } = matter(markdownFile);
    return {
      props: {
        post: {
          title: frontmatter.title,
          description: frontmatter.description || "",
          author: frontmatter.author || "Cyberooms AI",
          date: frontmatter.date || "",
          content: marked(content),
        },
      },
    };
  }

  // ✅ Otherwise, fall back to Notion JSON
  if (fs.existsSync(notionPath)) {
    const jsonData = fs.readFileSync(notionPath, "utf-8");
    const data = JSON.parse(jsonData);
    const item = data.results.find(
      (i) =>
        i.properties?.["Slug/URL"]?.rich_text?.[0]?.plain_text === slug &&
        i.properties?.Published?.checkbox
    );

    if (item) {
      const title = item.properties?.["Article Title"]?.title?.[0]?.plain_text;
      const description =
        item.properties?.["Meta Description"]?.rich_text?.[0]?.plain_text || "";
      const content =
        item.properties?.Content?.rich_text?.[0]?.plain_text ||
        "This content is synced from Notion.";

      return {
        props: {
          post: {
            title,
            description,
            author:
              item.properties?.Author?.people?.[0]?.name || "Cyberooms AI",
            date: item.properties?.["Publish Date"]?.date?.start || "",
            content: marked.parse(content),
          },
        },
      };
    }
  }

  return { props: { post: null } };
}
