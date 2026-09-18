const fs = require('fs');
const cheerio = require('cheerio');
const raw = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

for (const [slug, html] of Object.entries(raw)) {
  const $ = cheerio.load(html);
  const selects = $('select');
  const pdfLinks = $('a[href*=".pdf"], a[href*=".mp3"], a[href*=".xlsx"], a[href*=".zip"]');
  console.log(`${slug}: ${selects.length} select(s), ${pdfLinks.length} doc links`);
  if (selects.length > 0) {
    selects.each((i, sel) => {
      const opts = [];
      $(sel).find('option').each((j, opt) => {
        opts.push(`${$(opt).text().trim()} (${$(opt).val()})`);
      });
      console.log(`  select ${i} (id=${$(sel).attr('id')}, name=${$(sel).attr('name')}): ${opts.slice(0, 10).join(', ')}`);
    });
  }
}
