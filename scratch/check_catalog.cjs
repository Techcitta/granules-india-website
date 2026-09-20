const fs = require('fs');
const catalog = JSON.parse(fs.readFileSync('src/lib/pdf-catalog.json', 'utf8'));

const testFiles = [
  'Granules_Annual-Report-FY26',
  'Granules_Annual-Report-FY26-1',
  'FY-Result-Jun26',
  'Earnings-Presentation-Q1FY27',
  'Q1-FY27-Concall-Transcript',
  'Website-SHP-1_merged',
  'Website-SHP'
];

console.log('Total paths in catalog:', catalog.paths ? catalog.paths.length : 0);
for (const term of testFiles) {
  const matches = catalog.paths.filter(p => p.toLowerCase().includes(term.toLowerCase()));
  console.log(`\nMatches for "${term}":`);
  matches.forEach(m => console.log('  ' + m));
}
