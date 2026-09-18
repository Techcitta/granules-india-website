import fs from 'fs';
import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

// Build map of local subcats
const localSubcatMap = new Map();
INVESTOR_SECTIONS_DATA.forEach(cat => {
  cat.subcategories.forEach(sub => {
    localSubcatMap.set(sub.id, { cat, sub, items: sub.items });
  });
});

console.log('=== AUDIT OF SUBCATEGORIES ===\n');

for (const [subcatId, html] of Object.entries(rawData)) {
  const local = localSubcatMap.get(subcatId);
  const localCount = local ? local.items.length : 0;

  // Extract all links from html
  const linkRegex = /href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  const scrapedLinks = [];
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    const url = m[1].replace(/\s+/g, '');
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    scrapedLinks.push({ url, text });
  }

  console.log(`Subcategory [${subcatId}]:`);
  console.log(`  - Local items in investorData.ts: ${localCount}`);
  console.log(`  - Scraped live links: ${scrapedLinks.length}`);
  
  if (scrapedLinks.length > localCount) {
    console.log(`  ⚠️ MISSING ${scrapedLinks.length - localCount} items locally!`);
  }

  // Check which scraped links are not in local items
  if (local) {
    const localUrls = new Set(local.items.map(i => (i.pdf || '').trim()));
    const missing = scrapedLinks.filter(sl => !localUrls.has(sl.url));
    if (missing.length > 0) {
      console.log(`  - Sample missing items (${missing.length} total):`);
      missing.slice(0, 5).forEach(mi => console.log(`      * [${mi.text}] -> ${mi.url}`));
    }
  }
  console.log('');
}
