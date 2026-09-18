import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const subcatIds = [
  'quarterly-results',
  'investor-presentation',
  'earnings-call-transcripts',
  'earnings-call-recording',
  'share-holding-structures',
  'top-200-shareholders',
  'annual-accounts-of-subsidiaries-jvs',
  'annual-reports'
];

subcatIds.forEach(id => {
  const sub = INVESTOR_SECTIONS_DATA.flatMap(c => c.subcategories).find(s => s.id === id);
  console.log(`\n=================== [${sub.label}] (${sub.items.length} items) ===================`);
  ['2027', '2026', '2025', '2024'].forEach(yr => {
    const items = sub.items.filter(i => i.year === yr);
    console.log(`  Year ${yr} (${items.length} items): ${items.map(i => i.title + ' (' + i.period + ')').join(' | ')}`);
  });
});
