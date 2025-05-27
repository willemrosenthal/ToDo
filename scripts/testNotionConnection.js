require('dotenv').config();
const { Client } = require('@notionhq/client');

const notionToken = process.env.NOTION_TOKEN;
const notionParentPageId = process.env.NOTION_PARENT_PAGE_ID;
const notion = new Client({ auth: notionToken });

console.log('Token format:', notionToken?.substring(0, 10) + '...');
console.log('Page ID:', notionParentPageId);
console.log('Page ID length:', notionParentPageId?.length);

(async () => {
  try {
    // First, try to list all pages the integration has access to
    const response = await notion.search({
      filter: { property: 'object', value: 'page' }
    });
    
    console.log('✅ Token is valid! Found', response.results.length, 'accessible pages');
    console.log('Page titles:', response.results.map(p => p.properties?.title?.title?.[0]?.text?.content || 'Untitled'));
    
    // Now try your specific page
    const page = await notion.pages.retrieve({ page_id: process.env.NOTION_PARENT_PAGE_ID });
    console.log("✅ Successfully retrieved target page");
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Error code:', error.code);
  }
})();

// (async () => {
//   try {
//     const page = await notion.pages.retrieve({ page_id: notionParentPageId });
//     const titleProperty = page.properties?.title?.title?.[0]?.text?.content;
//     console.log("✅ Successfully connected to Notion page:", titleProperty || '(no title)');
//   } catch (error) {
//     console.error('❌ Error connecting to Notion:', error.message || error);
//   }
// })();