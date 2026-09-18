import fs from 'fs';
import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

console.log('=== CHECKING ALL YEARS IN LOCAL DATA ===');
const allYears = new Set();
INVESTOR_SECTIONS_DATA.forEach(cat => {
  cat.subcategories.forEach(sub => {
    sub.items.forEach(item => {
      if (item.year) allYears.add(item.year);
    });
  });
});
console.log('All years found in local data:', Array.from(allYears).sort().reverse());

console.log('\n=== ITEMS WITH YEAR 2027 IN LOCAL DATA ===');
INVESTOR_SECTIONS_DATA.forEach(cat => {
  cat.subcategories.forEach(sub => {
    const y27 = sub.items.filter(i => i.year === '2027');
    if (y27.length > 0) {
      console.log(`Subcategory: ${sub.id} (${y27.length} items):`);
      y27.forEach(i => console.log(`  - title: "${i.title}", period: "${i.period}", pdf: "${i.pdf}"`));
    }
  });
});

console.log('\n=== ITEMS WITH YEAR 2026 IN LOCAL DATA ===');
INVESTOR_SECTIONS_DATA.forEach(cat => {
  cat.subcategories.forEach(sub => {
    const y26 = sub.items.filter(i => i.year === '2026');
    if (y26.length > 0) {
      console.log(`Subcategory: ${sub.id} (${y26.length} items):`);
      y26.slice(0, 3).forEach(i => console.log(`  - title: "${i.title}", period: "${i.period}", pdf: "${i.pdf}"`));
    }
  });
});
