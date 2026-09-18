import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const qr = INVESTOR_SECTIONS_DATA.flatMap(c => c.subcategories).find(s => s.id === 'quarterly-results');
console.log('Total quarterly items:', qr.items.length);
qr.items.forEach((item, idx) => {
  console.log(`${idx + 1}. Title: "${item.title}" | Period: "${item.period}" | Year: "${item.year}" | PDF: ${item.pdf}`);
});
