import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

INVESTOR_SECTIONS_DATA.forEach(cat => {
  console.log(`${cat.id}: ${cat.title}`);
  cat.subcategories.forEach(sub => {
    console.log(`   [${sub.id}] ${sub.label} (${sub.items.length} items)`);
  });
});
