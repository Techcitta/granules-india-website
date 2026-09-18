import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

const slugs = [
  'annual-reports',
  'schedule-of-investor-meet',
  'notice-of-board-meetings',
  'newspaper-publications',
  'secretarial-compliance-report',
  'annual-returns',
  'other-disclosures',
  'financial-highlights-revenue-break-up',
  'other-information'
];

for (const slug of slugs) {
  const html = rawData[slug] || '';
  const linkRegex = /<a[^>]*href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  const items = [];
  while ((lm = linkRegex.exec(html)) !== null) {
    const url = lm[1].replace(/\s+/g, '');
    const text = lm[2].replace(/<[^>]+>/g, '').trim();
    items.push({ url, text });
  }

  console.log(`\n=================== [${slug}] (${items.length} items) ===================`);
  items.slice(0, 8).forEach(i => console.log(`  * [${i.text}] -> ${i.url}`));
}
