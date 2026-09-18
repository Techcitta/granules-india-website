import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

for (const [subcat, html] of Object.entries(rawData)) {
  console.log(`\n========================================`);
  console.log(`SUBCATEGORY: ${subcat}`);
  console.log(`========================================`);

  // Check select dropdowns
  const selectMatches = [...html.matchAll(/<select[^>]*>([\s\S]*?)<\/select>/gi)];
  let foundSelect = false;
  selectMatches.forEach((sm, i) => {
    const options = [...sm[1].matchAll(/<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)];
    const yearOptions = options.filter(o => /FY\s*\d\d|20\d\d/i.test(o[2]));
    if (yearOptions.length > 0) {
      foundSelect = true;
      console.log(`  Dropdown options:`, yearOptions.map(o => `${o[1]}: ${o[2].trim()}`).slice(0, 8));
    }
  });

  // Check tabs or navs
  const navMatches = [...html.matchAll(/<(?:ul|div)[^>]*class=["'][^"']*(?:tab|nav|filter)[^"']*["'][^>]*>([\s\S]*?)<\/(?:ul|div)>/gi)];
  navMatches.forEach(nm => {
    const items = [...nm[1].matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    const yearItems = items.filter(t => /FY\s*\d\d|20\d\d/i.test(t));
    if (yearItems.length > 0) {
      console.log(`  Nav/Tab years:`, yearItems.slice(0, 8));
    }
  });

  // Check all div containers with id matching q14 or fy27 or 2027
  const fy27Div = html.match(/id=["'](?:q14|tab-14|fy27|2027|[^"']*27[^"']*)["'][^>]*>([\s\S]*?)<\/div>/gi);
  if (fy27Div) {
    console.log(`  Found FY27 container:`, fy27Div.length);
  }
}
