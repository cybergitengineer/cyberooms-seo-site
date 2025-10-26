// scripts/syncNotion.mjs
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const dbId = process.env.NOTION_DB_ID;

// Clean Notion ID (remove dashes)
const cleanId = (id) => id.replace(/-/g, '');

// Recursively get Notion page content and render Markdown
async function getPageContent(pageId) {
  const blocks = [];
  let cursor;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      const { type } = block;
      const text = block[type]?.rich_text
        ?.map((t) => t.plain_text)
        .join(' ')
        .trim();

      switch (type) {
        case 'heading_1':
          blocks.push(`# ${text}\n`);
          break;
        case 'heading_2':
          blocks.push(`## ${text}\n`);
          break;
        case 'heading_3':
          blocks.push(`### ${text}\n`);
          break;
        case 'bulleted_list_item':
          blocks.push(`- ${text}`);
          break;
        case 'numbered_list_item':
          blocks.push(`1. ${text}`);
          break;
        case 'quote':
          blocks.push(`> ${text}`);
          break;
        case 'callout':
          blocks.push(`💡 ${text}`);
          break;
        case 'paragraph':
          if (text) blocks.push(text);
          break;
        case 'image':
          const imgUrl =
            block.image?.file?.url || block.image?.external?.url || '';
          if (imgUrl) blocks.push(`![Image](${imgUrl})`);
          break;
        default:
          break;
      }

      // Handle nested blocks
      if (block.has_children) {
        const nested = await getPageContent(block.id);
        if (nested) blocks.push(nested);
      }
    }

    cursor = response.next_cursor;
  } while (cursor);

  return blocks.join('\n\n');
}

async function main() {
  console.log('🚀 Connecting to Notion database...');
  const response = await notion.databases.query({ database_id: dbId });

  if (!response.results?.length) {
    console.log('⚠️ No pages found.');
    return;
  }

  if (!fs.existsSync('content')) fs.mkdirSync('content');
  const jsonExport = [];

  for (const page of response.results) {
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

    console.log(`📄 Fetching full content for "${title}"...`);
    const body = await getPageContent(cleanId(page.id));

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
