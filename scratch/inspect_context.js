import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));
const html = rawData['quarterly-results'];

// Look for all select dropdown options
const selectMatches = [...html.matchAll(/<select[^>]*>([\s\S]*?)<\/select>/gi)];
selectMatches.forEach((sm, i) => {
  console.log(`Select ${i + 1}:`);
  const options = [...sm[1].matchAll(/<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)];
  options.forEach(o => console.log(`  value="${o[1]}" -> ${o[2].trim()}`));
});
