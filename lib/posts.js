// lib/posts.js
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

  let contentSource = "";
  let sourceUsed = "none";

  // 1) Prefer contentPath if provided
  if (base.contentPath) {
    // If it's absolute, use as-is; otherwise relative to /content
    const fromPath = path.isAbsolute(base.contentPath)
      ? base.contentPath
      : path.join(contentDir, base.contentPath);

    if (fs.existsSync(fromPath)) {
      contentSource = fs.readFileSync(fromPath, "utf-8");
      sourceUsed = `contentPath:${fromPath}`;
    }
  }

  // 2) Fallback to /content/<slug>.md
  if (!contentSource) {
    const slugPath = path.join(contentDir, `${slug}.md`);
    if (fs.existsSync(slugPath)) {
      contentSource = fs.readFileSync(slugPath, "utf-8");
      sourceUsed = `slugPath:${slugPath}`;
    }
  }

  // 3) Fallback to inline "content" JSON field
  if (!contentSource && base.content) {
    contentSource = base.content;
    sourceUsed = "inline:content";
  }

  const contentHtml = mdToHtml(contentSource);

  // Build-time log (shows in Vercel logs)
  console.log(
    `[build:getPostBySlug] slug=${slug} source=${sourceUsed} length=${contentSource?.length || 0}`
  );

  return {
    ...base,
    author: base.author || "Cyberooms",
    description: base.description || "",
    datePublished: base.datePublished || "",
    updatedAt: base.updatedAt || base.datePublished || "",
    contentHtml,
  };
}
