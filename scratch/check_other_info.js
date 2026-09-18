import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const otherInfo = INVESTOR_SECTIONS_DATA.flatMap(c => c.subcategories).find(s => s.id === 'other-information');
console.log(`Local other-information has ${otherInfo?.items.length} items:`);
otherInfo?.items.forEach((item, idx) => console.log(`  ${idx + 1}. [${item.title}] (${item.year || ''}) -> ${item.pdf}`));
