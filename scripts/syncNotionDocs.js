// console.log('🔍 Environment check:');
// console.log('NOTION_TOKEN exists:', !!process.env.NOTION_TOKEN);
// console.log('NOTION_TOKEN format:', process.env.NOTION_TOKEN?.substring(0, 10) + '...');
// console.log('NOTION_PARENT_PAGE_ID:', process.env.NOTION_PARENT_PAGE_ID);
// console.log('NOTION_PARENT_PAGE_ID length:', process.env.NOTION_PARENT_PAGE_ID?.length);


const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const matter = require('gray-matter');

const notionToken = process.env.NOTION_TOKEN;
const notionParentPageId = process.env.NOTION_PARENT_PAGE_ID;

console.log(notionToken);
console.log(notionParentPageId);

// Init Notion client
const notion = new Client({ auth: notionToken });
const rootPageId = notionParentPageId;

// Converts markdown to Notion blocks (very basic)
// function mdToBlocks(md) {
//   return md.split('\n').map(line => ({
//     object: 'block',
//     type: 'paragraph',
//     paragraph: {
//       rich_text: [
//         {
//           type: 'text',
//           text: {
//             content: line || ' '
//           }
//         }
//       ]
//     }
//   }));
// }

// SKIP EMPTY LINE VERSION:
function mdToBlocks(md) {
  return md
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => ({
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: line
            }
          }
        ]
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