// scripts/syncNotion.mjs
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const dbId = process.env.NOTION_DB_ID;

// Utility — remove dashes from Notion IDs
const cleanId = (id) => id.replace(/-/g, '');

// Recursively convert Notion blocks to Markdown
async function getPageBlocks(pageId) {
  let results = [];
  let cursor;

  do {
    const { results: blocks, next_cursor } = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    for (const block of blocks) {
      const { type } = block;
      const text = block[type]?.rich_text?.map(t => t.plain_text).join(' ') || '';

      switch (type) {
        case 'heading_1':
          results.push(`# ${text}\n`);
          break;
        case 'heading_2':
          results.push(`## ${text}\n`);
          break;
        case 'heading_3':
          results.push(`### ${text}\n`);
          break;
        case 'paragraph':
          if (text.trim()) results.push(`${text}\n`);
          break;
        case 'bulleted_list_item':
          results.push(`- ${text}`);
          break;
        case 'numbered_list_item':
          results.push(`1. ${text}`);
          break;
        case 'quote':
          results.push(`> ${text}`);
          break;
        case 'callout':
          results.push(`💡 ${text}`);
          break;
        case 'image':
          const url = block.image?.file?.url || block.image?.external?.url;
          if (url) results.push(`![image](${url})`);
          break;
        default:
          break;
      }

      // Fetch nested content if exists
      if (block.has_children) {
        const nested = await getPageBlocks(block.id);
        if (nested) results.push(nested);
      }
    }

    cursor = next_cursor;
  } while (cursor);

  return results.join('\n\n');
}

async function main() {
  console.log('🚀 Connecting to Notion database...');
  const dbQuery = await notion.databases.query({ database_id: dbId });

  if (!dbQuery.results.length) {
    console.log('⚠️ No pages found.');
    return;
  }

  if (!fs.existsSync('content')) fs.mkdirSync('content');
  const jsonExport = [];

  for (const page of dbQuery.results) {
    const props = page.properties;
    const title = props['Article Title']?.title?.[0]?.plain_text || 'Untitled';
    const slug =
      props['Slug/URL']?.rich_text?.[0]?.plain_text ||
      title.toLowerCase().replace(/\s+/g, '-');
    const description =
      props['Meta Description']?.rich_text?.[0]?.plain_text || '';
    const published = props['Published']?.checkbox || false;

    if (!published) {
      console.log(`🚫 Skipping draft: ${title}`);
      continue;
    }

    console.log(`📄 Extracting content for "${title}"...`);
    const body = await getPageBlocks(cleanId(page.id));

    const markdown = `---\ntitle: "${title}"\nslug: "${slug}"\ndescription: "${description}"\n---\n\n${body}`;
    fs.writeFileSync(`content/${slug}.md`, markdown);
    console.log(`📝 Created content/${slug}.md`);

    jsonExport.push({ title, slug, description, body });
  }

  const jsonPath = path.join('content', 'notion_sync.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonExport, null, 2));
  console.log(`🗂  Wrote Notion data to ${jsonPath}`);
  console.log('✅ Synced Notion → content/ successfully!');
}

main();
