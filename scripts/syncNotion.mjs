// scripts/syncNotion.mjs
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const dbId = process.env.NOTION_DB_ID;

// Helper to clean page IDs (remove dashes)
const cleanId = (id) => id.replace(/-/g, '');

// Helper: get text from a rich_text array safely
const extractRichText = (field) => {
  if (!field || !Array.isArray(field.rich_text)) return '';
  return field.rich_text.map((t) => t.plain_text || '').join('\n');
};

// Fetch Notion page blocks (for fallback)
async function getPageBlocks(pageId) {
  try {
    const blocks = await notion.blocks.children.list({ block_id: cleanId(pageId) });
    return blocks.results
      .map((b) => {
        if (b[b.type]?.rich_text) {
          return b[b.type].rich_text.map((r) => r.plain_text).join('');
        }
        return '';
      })
      .join('\n')
      .trim();
  } catch (err) {
    console.warn(`⚠️ Error reading blocks for ${pageId}:`, err.message);
    return '';
  }
}

async function main() {
  try {
    console.log('🚀 Connecting to Notion database...');
    const response = await notion.databases.query({ database_id: dbId });

    if (!response.results?.length) {
      console.log('⚠️ No pages found in Notion database.');
      return;
    }

    if (!fs.existsSync('content')) fs.mkdirSync('content');
    const jsonExport = [];

    for (const page of response.results) {
      const props = page.properties;
      const title = props?.['Article Title']?.title?.[0]?.plain_text || 'untitled';
      const slug =
        props?.['Slug/URL']?.rich_text?.[0]?.plain_text?.toLowerCase().replace(/\s+/g, '-') ||
        title.toLowerCase().replace(/\s+/g, '-');
      const description = extractRichText(props?.['Meta Description']);
      const published = props?.['Published']?.checkbox || false;

      // ✅ Extract content from the “Content” property
      let body = extractRichText(props?.['Content']);

      // If body is empty, try to pull from actual page blocks
      if (!body || body.trim().length === 0) {
        console.log(`🕵️ No inline content found for "${title}", fetching page blocks...`);
        body = await getPageBlocks(page.id);
      }

      console.log(`🧾 [${title}] Content length: ${body.length}`);

      // Skip drafts
      if (!published) {
        console.log(`🚫 Skipping draft: ${title}`);
        continue;
      }

      // Write markdown
      const markdown = `---
title: "${title}"
slug: "${slug}"
description: "${description}"
---

${body}`;

      const filePath = path.join('content', `${slug}.md`);
      fs.writeFileSync(filePath, markdown);
      console.log(`📝 Created ${filePath}`);

      jsonExport.push({ title, slug, description, published, body });
    }

    const jsonPath = path.join('content', 'notion_sync.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonExport, null, 2));
    console.log(`🗂 Wrote Notion data to ${jsonPath}`);
    console.log('✅ Synced Notion → content/ successfully!');
  } catch (err) {
    console.error('❌ Error syncing from Notion:', err);
  }
}

main();
