import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const allYears = new Set();
let total = 0;
const fy27List = [];

INVESTOR_SECTIONS_DATA.forEach(cat => {
  console.log(`\n=== [${cat.title}] ===`);
  cat.subcategories.forEach(sub => {
    const yearsInSub = Array.from(new Set(sub.items.map(i => i.year))).sort().reverse();
    const fy27Count = sub.items.filter(i => i.year === '2027').length;
    console.log(`  * ${sub.label} (${sub.id}): ${sub.items.length} items | Years: [${yearsInSub.slice(0, 5).join(', ')}${yearsInSub.length > 5 ? '...' : ''}] | FY27: ${fy27Count}`);
    total += sub.items.length;
    sub.items.forEach(i => {
      if (i.year) allYears.add(i.year);
      if (i.year === '2027') {
        fy27List.push({ sub: sub.label, title: i.title, period: i.period, pdf: i.pdf });
      }
    });
  });
});

console.log(`\nTOTAL ITEMS: ${total}`);
console.log(`ALL YEARS AVAILABLE:`, Array.from(allYears).sort().reverse());
console.log(`\nALL 15 FY27 ITEMS:`);
fy27List.forEach((item, idx) => {
  console.log(`  ${idx + 1}. [${item.sub}] "${item.title}" (${item.period}) -> ${item.pdf}`);
});
