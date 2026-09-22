const { execSync } = require('child_process');
const fs = require('fs');

const content = execSync('git -C "c:/Users/ADMIN/Desktop/granules-india-website" show 3da9178:src/pages/rd.css', { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
fs.writeFileSync('src/pages/rd.css', content, 'utf8');
console.log('Restored rd.css successfully. Length:', content.length);
