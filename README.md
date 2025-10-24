# SEO AI Pipeline — Step 2: Static Build (Next.js SSG)

This is a ready-to-run starter that turns your transformed Notion JSON into a **static, LLM and classic search engine SEO-friendly website**.

## What’s inside
- **Next.js (pages router)** with **SSG** (`getStaticProps`/`getStaticPaths`)
- **Data source:** `data/posts.json` (replace with your Extract/Transform output)
- **SEO**: `<head>` meta tags + **JSON-LD** per page
- **Sitemap & robots**: generated at build (`public/sitemap.xml`, `public/robots.txt`)
- **Static export**: `next.config.js` is set to `output: 'export'`

## Prereqs
- Node.js 18+ and npm

## Quick start
```bash
npm install
# Optionally set your prod URL so canonical/sitemap are correct:
# PowerShell:   $env:SITE_URL="https://cyberooms.com"
# macOS/Linux:  export SITE_URL="https://cyberooms.com"

npm run dev
```

Visit http://localhost:3000

## Build for static hosting / Vercel
```bash
# (Optional) set the canonical URL
export SITE_URL="https://cyberooms.com"

npm run build
# Output will be in .next (and static export in out/ for Next 13.4+)
# Deploy to Vercel: `vercel` (or connect repo in the Vercel UI)
```

> If your Next version writes to `out/` automatically when `output: 'export'` is set, deploy that folder to any CDN or GitHub Pages.

## Replace sample data with your Notion JSON
1. Swap the sample `data/posts.json` with the JSON produced in **Step 1 (Extract/Transform)**.
2. Each object should include at least:
```json
{
  "title": "Example Title",
  "slug": "example-title",
  "description": "Short summary for meta tags.",
  "content": "<p>Sanitized HTML content here</p>",
  "author": "Your Name",
  "datePublished": "YYYY-MM-DD",
  "updatedAt": "YYYY-MM-DD",
  "schemaType": "Article"
}
```
3. Re-run:
```bash
npm run build
```

## JSON-LD customization
- See `components/SEO.js`. For each post page, we inject Article JSON-LD with `headline`, `author`, `datePublished`, etc.
- Change `schemaType` per post if needed (e.g., `HowTo`, `Product`, `FAQPage`) and extend the JSON-LD accordingly in `pages/[slug].js`.

## Sitemap & robots
- `npm run build` runs `scripts/generate-sitemap.js` first.
- It reads `data/posts.json` and writes `public/sitemap.xml` and `public/robots.txt`.
- Ensure the `SITE_URL` env is set for correct canonical links. Defaults to `https://cyberooms.com`.

## Deployment tips
- **Vercel**: straightforward — connect repo, set `SITE_URL` in Project → Settings → Environment Variables, then deploy.
- **Static CDNs** (Cloudflare Pages, Netlify, GitHub Pages): deploy the `out/` directory after `npm run build`.
- **Scheduled rebuilds**: Use Vercel Cron or GitHub Actions to re-build daily so Google sees fresh timestamps.

## Next steps (Step 3 preview)
- Add richer **JSON-LD** per content type (FAQ, HowTo, Product, Course).
- Add an **RSS/Atom feed** for subscribers.
- Wire this to your Notion ETL so `data/posts.json` is generated automatically before build.

# Cyberooms AI SEO Site

Static SEO-optimized site powered by **Next.js** + **Markdown content** + **Vercel hosting**.  
Deployed at: [https://ai.cyberooms.com](https://ai.cyberooms.com)

---

## 🚀 Project Overview
- **Content source**: Markdown files in `/content` + metadata in `data/posts.json`.
- **Pages**: 
  - Homepage → lists articles.
  - Dynamic `[slug].js` → renders each article with SEO meta, OpenGraph, Schema.org.
- **Hosting**: Vercel (`ai.cyberooms.com` subdomain).
- **SEO**:
  - Canonical URLs from `lib/siteUrl.js`.
  - `robots.txt` and `sitemap.xml` in `/public`.
  - Rich snippets enabled (Schema.org `Article`).

---

## 📂 Folder Structure

seo-ai-notion-static/
│
├── content/ # Markdown articles (e.g., ai-security-tools-2025.md)
├── data/posts.json # Metadata (title, slug, desc, etc.)
├── lib/
│ ├── posts.js # Markdown → HTML parser
│ └── siteUrl.js # Canonical base URL resolver
├── pages/
│ ├── index.js # Homepage listing
│ ├── [slug].js # Dynamic article pages
│ └── _app.js # Global app wrapper
├── public/
│ ├── robots.txt # Robots file
│ └── sitemap.xml # Sitemap
├── styles/globals.css # Global CSS
└── .env.local # Local-only environment variables


---

## 🛠 Environment Variables

Configured in **Vercel → Project → Settings → Environment Variables**:

```env
NEXT_PUBLIC_SITE_URL=https://ai.cyberooms.com

