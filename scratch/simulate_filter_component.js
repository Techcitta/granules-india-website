import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

// Simulate the exact logic of InvestorFilteredSection
console.log('=== SIMULATING InvestorFilteredSection COMPONENT LOGIC ===\n');

INVESTOR_SECTIONS_DATA.forEach(cat => {
  if (cat.isContact) return;

  console.log(`------------------------------------------------------------`);
  console.log(`Category: [${cat.id}] "${cat.title}"`);
  
  // 1. All category items
  const allCategoryItems = cat.subcategories.flatMap(s => s.items);

  // 2. Available years for entire category
  const availableYears = Array.from(
    new Set(allCategoryItems.map(i => i.year).filter(Boolean))
  ).sort((a, b) => b.localeCompare(a));

  console.log(`  Available Years in category: [${availableYears.join(', ')}]`);
  console.log(`  Includes '2027': ${availableYears.includes('2027') ? 'YES ✅' : 'NO ❌'}`);

  // 3. Filter by '2027'
  const items2027 = allCategoryItems.filter(i => i.year === '2027');
  console.log(`  Items visible when selecting '2027' (All Categories): ${items2027.length}`);
  items2027.forEach(i => {
    console.log(`    * [${i.subcategoryLabel}] "${i.title}" | Period: ${i.period} | PDF: ${i.pdf}`);
  });

  // 4. Test each subcategory individually
  cat.subcategories.forEach(sub => {
    const subYears = Array.from(
      new Set(sub.items.map(i => i.year).filter(Boolean))
    ).sort((a, b) => b.localeCompare(a));

    if (subYears.includes('2027')) {
      const subItems2027 = sub.items.filter(i => i.year === '2027');
      console.log(`  -> Subcategory [${sub.id}] has 2027 filter! (${subItems2027.length} items)`);
      subItems2027.forEach(si => console.log(`       - "${si.title}" (${si.period}) -> ${si.pdf}`));
    }
  });
});
