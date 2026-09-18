import fs from 'fs';

const txt = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity-ide/brain/5297ade5-4f5f-4dee-be11-e4afc585f824/.system_generated/steps/1304/content.md', 'utf8');

// Match tab headers (e.g. FY 2026-27, FY 2025-26, etc.)
const tabHeaders = [...txt.matchAll(/<(?:li|div|a|span|h[1-6])[^>]*class="[^"]*(?:tab|nav|panel-title|accordion)[^"]*"[^>]*>([\s\S]*?)<\/(?:li|div|a|span|h[1-6])>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim())
  .filter(t => t.length > 0 && t.length < 50);
console.log('Tab Headers:', [...new Set(tabHeaders)]);

// Also check any occurrence of FY or 202 in txt
const fyMatches = [...txt.matchAll(/FY\s*20\d\d[-–]\d\d|FY\s*\d\d[-–]\d\d|FY\s*\d\d/gi)].map(m => m[0]);
console.log('FY occurrences:', [...new Set(fyMatches)]);

// Match all pdf links
const pdfRegex = /href=["']([^"']+\.pdf)["'][^>]*>([\s\S]*?)<\/a>/gi;
const results = [];
let m;
while ((m = pdfRegex.exec(txt)) !== null) {
  const cleanText = m[2].replace(/<[^>]+>/g, '').trim();
  results.push({ url: m[1], text: cleanText });
}
console.log('\nTotal PDF links found:', results.length);
console.log('\nSample PDF links:');
results.slice(0, 15).forEach(r => console.log(`- [${r.text}] -> ${r.url}`));

// Check for FY27 specifically
const fy27 = results.filter(r => /27|2026-27|2027/i.test(r.url) || /27|2026-27|2027/i.test(r.text));
console.log('\nFY27 / 2027 PDFs:', fy27);
