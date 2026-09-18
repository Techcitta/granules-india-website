import fs from 'fs';

const content = fs.readFileSync('src/data/investorData.ts', 'utf8');

// Find all sections and their subcategories
const sections = [];
const secRegex = /"id":\s*"(sec-[^"]+)",\s*"title":\s*"([^"]+)"/g;
let m;
while ((m = secRegex.exec(content)) !== null) {
  sections.push({ id: m[1], title: m[2] });
}
console.log('Sections:', sections);

// Find all unique subcategories with labels
const subRegex = /"id":\s*"([^"]+)",\s*"label":\s*"([^"]+)"/g;
const subcats = [];
while ((m = subRegex.exec(content)) !== null) {
  if (!m[1].startsWith('sec-')) {
    subcats.push({ id: m[1], label: m[2] });
  }
}
const uniqueSubs = Array.from(new Map(subcats.map(s => [s.id, s.label])).entries());
console.log('\nSubcategories count:', uniqueSubs.length);
uniqueSubs.forEach(([id, label]) => console.log(`- [${id}] ${label}`));

// Let's check the years present in the dataset
const yearRegex = /"year":\s*"([^"]+)"/g;
const years = new Set();
while ((m = yearRegex.exec(content)) !== null) {
  years.add(m[1]);
}
console.log('\nUnique years in investorData:', Array.from(years).sort());

// Check for FY27 or 2027
console.log('Mentions of 27 or FY27:', content.match(/FY\s*26-27|FY27|2027/gi) || 'None');
