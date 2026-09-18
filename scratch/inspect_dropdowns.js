import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

// For each subcategory, let's parse:
// 1. All <select> tags and their <option> tags: value -> text
// 2. All containers that correspond to those option values (e.g. id="value" or class="value" or data-id="value")
// 3. Any links inside them

for (const [slug, html] of Object.entries(rawData)) {
  console.log(`\n=================== [${slug}] ===================`);
  
  // Find selects
  const selectRegex = /<select[^>]*>([\s\S]*?)<\/select>/gi;
  let sm;
  const selectOptions = [];
  while ((sm = selectRegex.exec(html)) !== null) {
    const optRegex = /<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi;
    let om;
    const opts = [];
    while ((om = optRegex.exec(sm[1])) !== null) {
      opts.push({ val: om[1], text: om[2].trim() });
    }
    selectOptions.push(opts);
  }

  if (selectOptions.length > 0) {
    console.log('Select dropdowns found:', selectOptions.length);
    selectOptions.forEach((opts, idx) => {
      console.log(`  Dropdown ${idx}:`, opts.map(o => `${o.text}->${o.val}`).join(' | '));
    });
  } else {
    console.log('No select dropdown (flat list or table)');
  }
}
