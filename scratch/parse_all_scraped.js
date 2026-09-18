import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

console.log('Available subcategories:', Object.keys(rawData));

for (const [subcat, html] of Object.entries(rawData)) {
  // Look for any links ending in pdf or zip or xls or mp3 or webUrl
  const linkRegex = /href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links = [];
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    const url = m[1].replace(/\s+/g, '');
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    links.push({ url, text });
  }

  // Look for FY27 or 2026-27 or 2027 in the html
  const fy27Matches = [...html.matchAll(/(?:FY\s*26-27|FY\s*27|2026-27|2027)/gi)].map(x => x[0]);
  
  console.log(`\n=== [${subcat}] ===`);
  console.log(`Found ${links.length} document links. FY27 text matches: ${fy27Matches.length}`);

  // Print any links that mention 27 or 26-27 or 2027
  const fy27Links = links.filter(l => /27|26-27/i.test(l.url) || /27|26-27/i.test(l.text));
  if (fy27Links.length > 0) {
    console.log(`  -> FY27 Links (${fy27Links.length}):`);
    fy27Links.forEach(l => console.log(`     * [${l.text}] -> ${l.url}`));
  }

  // Also print the top 3 latest links for this subcat
  console.log('  -> Recent top links:');
  links.slice(0, 4).forEach(l => console.log(`     * [${l.text}] -> ${l.url}`));
}
