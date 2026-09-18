import fs from 'fs';
import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

// Flatten local items
const localItems = [];
INVESTOR_SECTIONS_DATA.forEach(cat => {
  cat.subcategories.forEach(sub => {
    sub.items.forEach(item => {
      localItems.push(item);
    });
  });
});

console.log('Total local items in investorData.ts:', localItems.length);

// Count per subcategory and max year per subcategory
INVESTOR_SECTIONS_DATA.forEach(cat => {
  console.log(`\n=== Category: ${cat.title} (${cat.id}) ===`);
  cat.subcategories.forEach(sub => {
    const years = [...new Set(sub.items.map(i => i.year))].sort().reverse();
    const has2027 = sub.items.some(i => i.year === '2027');
    console.log(`  - [${sub.id}] ${sub.label}: ${sub.items.length} items | Years: ${years.slice(0, 3).join(', ')} | Has 2027: ${has2027}`);
  });
});
