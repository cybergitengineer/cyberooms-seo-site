// scripts/syncNotion.mjs 
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import * as Notion from '@notionhq/client';

const notion = new Notion.Client({ auth: process.env.NOTION_TOKEN });
const dbId = process.env.NOTION_DB_ID;

async function main() {
  try {
    console.log('🚀 Connecting to Notion database...');

    const response = await notion.databases.query({
      database_id: dbId,
    });

    if (!response.results?.length) {
      console.log('⚠️  No pages found in Notion database.');
      return;
    }

    if (!fs.existsSync('content')) fs.mkdirSync('content');

    const jsonExport = [];

    for (const page of response.results) {
      const title = page.properties?.Name?.title?.[0]?.plain_text || 'untitled';
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      const description =
        page.properties?.Description?.rich_text?.[0]?.plain_text || '';
      const body =
        page.properties?.Content?.rich_text
          ?.map(block => block.plain_text)
          .join('\n') || '';

      // ✅ Clean Markdown with SEO-friendly front matter
      const markdown = `---
title: "${title}"
description: "${description}"
slug: "${slug}"
---

${body}`;

      fs.writeFileSync(`content/${slug}.md`, markdown);
      console.log(`📝  Created content/${slug}.md`);

      jsonExport.push({ title, slug, description, body });
    }

    // ✅ Save simplified JSON file for debugging
    const jsonPath = path.join('content', 'notion_sync.json');
    fs.writeFileSync(jsonPath, JSON.stringify(jsonExport, null, 2));
    console.log(`🗂  Wrote Notion data to ${jsonPath}`);
    console.log('✅  Synced Notion → content/ successfully!');
  } catch (err) {
    console.error('❌  Error syncing from Notion:', err);
  }
}

main();
