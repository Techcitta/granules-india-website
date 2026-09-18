import fs from 'fs';
import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));
const html = rawData['annual-reports'];

const linkRegex = /<a[^>]*href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
let lm;
const liveItems = [];
while ((lm = linkRegex.exec(html)) !== null) {
  liveItems.push({ text: lm[2].replace(/<[^>]+>/g, '').trim(), link: lm[1].replace(/\s+/g, '') });
}

const local = INVESTOR_SECTIONS_DATA.find(c => c.id === 'sec-financial-reports')
  .subcategories.find(s => s.id === 'annual-reports');

console.log(`Annual Reports: ${liveItems.length} live vs ${local.items.length} local.`);
liveItems.forEach((li, idx) => {
  const found = local.items.find(loc => loc.pdf === li.link);
  console.log(`  ${idx + 1}. [${li.text}] -> ${found ? 'FOUND (' + found.year + ')' : 'MISSING'}`);
});
