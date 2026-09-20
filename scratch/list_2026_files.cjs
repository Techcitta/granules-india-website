const fs = require('fs');
const content = fs.readFileSync('src/data/investorData.ts', 'utf8');

const regex = /https:\/\/d16d47oyl512wy\.cloudfront\.net\/([^"\s]+)/g;
let m;
const files = new Set();
while ((m = regex.exec(content)) !== null) {
  if (m[1].includes('2026/')) {
    files.add(m[1]);
  }
}
console.log('All 2026 files in investorData.ts:');
Array.from(files).sort().forEach(f => console.log(' - ' + f));
