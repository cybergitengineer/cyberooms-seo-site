import fs from "fs";
import path from "path";
import { marked } from "marked";

const dataPath = path.join(process.cwd(), "data", "posts.json");
const contentDir = path.join(process.cwd(), "content");

function readPostsJson() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("posts.json must be an array");
  return parsed;
}

function mdToHtml(md) {
  if (!md) return "";
  return marked.parse(md);
}

export function getAllPosts() {
  const posts = readPostsJson();
  return posts.map((p) => ({
    title: p.title || "Untitled",
    slug: p.slug,
    description: p.description || "",
    author: p.author || "Cyberooms",
    datePublished: p.datePublished || "",
    updatedAt: p.updatedAt || p.datePublished || "",
    schemaType: p.schemaType || "Article",
    keywords: p.keywords || [],
  }));
}

export function getPostBySlug(slug) {
  const posts = readPostsJson();
  const base = posts.find((p) => p.slug === slug);
  if (!base) return null;

  const mdPath = path.join(contentDir, `${slug}.md`);
  let contentSource = "";

  if (fs.existsSync(mdPath)) {
    contentSource = fs.readFileSync(mdPath, "utf-8");
  } else if (base.content) {
    contentSource = base.content;
  }

  const contentHtml = mdToHtml(contentSource);
  console.log("[build] slug:", slug, "md length:", contentSource?.length ?? 0);

  return {
    ...base,
    author: base.author || "Cyberooms",
    description: base.description || "",
    datePublished: base.datePublished || "",
    updatedAt: base.updatedAt || base.datePublished || "",
    contentHtml,
  };
}
