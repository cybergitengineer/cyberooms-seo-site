// scripts/syncNotion.mjs
import 'dotenv/config';
import fs from 'fs';

// handle both CommonJS and ESM builds of the SDK
import * as Notion from '@notionhq/client';
const notion = new Notion.Client({ auth: process.env.NOTION_TOKEN });

const dbId = process.env.NOTION_DB_ID;

async function main() {
  try {
    console.log('🚀 Connecting to Notion database...');

    // v3+ clients expose the query method under notion.databases.list/query
    const response = await notion.databases.query({
      database_id: dbId,
    });

    if (!response.results?.length) {
      console.log('⚠️  No pages found in Notion database.');
      return;
    }

    if (!fs.existsSync('content')) fs.mkdirSync('content');

    for (const page of response.results) {
      const title =
        page.properties?.Name?.title?.[0]?.plain_text || 'untitled';
      const slug = title.toLowerCase().replace(/\s+/g, '-');
      const body =
        page.properties?.Content?.rich_text
          ?.map(block => block.plain_text)
          .join('\n') || '';

      const markdown = `# ${title}\n\n${body}`;
      fs.writeFileSync(`content/${slug}.md`, markdown);

      console.log(`📝  Created content/${slug}.md`);
    }

    console.log('✅  Synced Notion → content/ successfully!');
  } catch (err) {
    console.error('❌  Error syncing from Notion:', err);
  }
}

main();
