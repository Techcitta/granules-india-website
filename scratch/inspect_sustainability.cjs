const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));
const html = raw['sustainability-reports'];
const fsLinks = [];
const regex = /href=["']([^"']+)["']/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  if (!m[1].includes('.css') && !m[1].includes('.js') && !m[1].includes('wp-json') && !m[1].includes('xmlrpc') && !m[1].includes('fonts.')) {
    fsLinks.push(m[1]);
  }
}
console.log('Filtered links:', fsLinks);
