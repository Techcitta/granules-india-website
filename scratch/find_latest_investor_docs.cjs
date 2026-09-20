const fs = require('fs');

let content = fs.readFileSync('src/data/investorData.ts', 'utf8');

// Replace exports/interfaces so we can evaluate in node
const startMarker = 'export const INVESTOR_SECTIONS_DATA: InvestorCategory[] = ';
const idx = content.indexOf(startMarker);
const code = content.substring(idx + startMarker.length);

try {
  // Use Function to evaluate the array literal safely
  const data = (new Function('return ' + code))();
  console.log('Categories count:', data.length);
  for (const cat of data) {
    console.log(`\n=== CATEGORY: ${cat.title} (${cat.id}) ===`);
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        console.log(`  Subcategory: ${sub.label} (${sub.id}) - total items: ${sub.items ? sub.items.length : 0}`);
        if (sub.items && sub.items.length > 0) {
          const first = sub.items[0];
          console.log(`    [0] Latest item: [${first.period || first.year}] "${first.title}"`);
          console.log(`        pdf: ${first.pdf}`);
          if (first.webUrl) console.log(`        webUrl: ${first.webUrl}`);
          if (sub.items.length > 1) {
            const second = sub.items[1];
            console.log(`    [1] Second item: [${second.period || second.year}] "${second.title}"`);
            console.log(`        pdf: ${second.pdf}`);
          }
        }
      }
    }
  }
} catch (e) {
  console.error('Error:', e.message);
}
