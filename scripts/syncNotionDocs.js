const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

// Init Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const rootPageId = process.env.NOTION_PARENT_PAGE_ID;

// Converts markdown to Notion blocks (very basic)
function mdToBlocks(md) {
  return md.split('\n').map(line => ({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      text: [{ type: 'text', text: { content: line || ' ' } }]
    }
  }));
}

// Recursively create nested structure
async function ensurePageHierarchy(baseId, parts) {
  let parentId = baseId;
  for (const name of parts) {
    const res = await notion.search({ query: name });
    let page = res.results.find(p =>
      p.parent?.page_id === parentId &&
      p.object === 'page' &&
      p.properties?.title?.[0]?.text?.content === name
    );

    if (!page) {
      page = await notion.pages.create({
        parent: { page_id: parentId },
        properties: {
          title: [{ type: 'text', text: { content: name } }]
        }
      });
    }
    parentId = page.id;
  }
  return parentId;
}

async function syncDocs() {
  const files = glob.sync('**/*.md', { ignore: ['node_modules/**', 'dist/**'] });

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { content } = matter(raw);
    const relative = path.relative('.', filePath);
    const parts = relative.split(path.sep);

    const fileName = parts.pop().replace(/\.md$/, '');
    const parentId = await ensurePageHierarchy(rootPageId, parts);

    // Create or update the page
    await notion.pages.create({
      parent: { page_id: parentId },
      properties: {
        title: [{ type: 'text', text: { content: fileName } }]
      },
      children: mdToBlocks(content)
    });

    console.log(`✅ Synced ${relative} to Notion`);
  }
}

syncDocs().catch((err) => {
  console.error(err);
  process.exit(1);
});