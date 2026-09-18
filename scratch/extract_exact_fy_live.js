import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

// Helper to extract items from a container
function getLinksInHtml(html) {
  const linkRegex = /<a[^>]*href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  const items = [];
  while ((lm = linkRegex.exec(html)) !== null) {
    const url = lm[1].replace(/\s+/g, '');
    const text = lm[2].replace(/<[^>]+>/g, '').trim();
    items.push({ url, text });
  }
  return items;
}

// Function to extract items by div id
function extractByDivId(html, divId) {
  const regex = new RegExp(`id=["']${divId}["'][^>]*>([\\s\\S]*?)(?=<div[^>]*id=["']|$(?![\s\S]))`, 'i');
  const match = regex.exec(html);
  if (!match) return [];
  return getLinksInHtml(match[1]);
}

// 1. QUARTERLY RESULTS
const qrMapping = [
  { fy: 'FY27', year: '2027', divId: 'q14' },
  { fy: 'FY26', year: '2026', divId: 'q13' },
  { fy: 'FY25', year: '2025', divId: 'q12' },
  { fy: 'FY24', year: '2024', divId: 'q11' },
  { fy: 'FY23', year: '2023', divId: 'q10' },
  { fy: 'FY22', year: '2022', divId: 'q9' },
  { fy: 'FY21', year: '2021', divId: 'q1' },
  { fy: 'FY20', year: '2020', divId: 'q2' },
  { fy: 'FY19', year: '2019', divId: 'q3' },
  { fy: 'FY18', year: '2018', divId: 'q4' },
  { fy: 'FY17', year: '2017', divId: 'q5' },
  { fy: 'FY16', year: '2016', divId: 'q6' },
  { fy: 'FY15', year: '2015', divId: 'q7' },
  { fy: 'FY14', year: '2014', divId: 'q8' },
];

console.log('=== QUARTERLY RESULTS FROM LIVE SITE ===');
let qrCount = 0;
qrMapping.forEach(m => {
  const items = extractByDivId(rawData['quarterly-results'], m.divId);
  qrCount += items.length;
  console.log(`${m.fy} (${m.year}) [${m.divId}]: ${items.length} items -> ${items.map(i => i.text).join(', ')}`);
});
console.log('Total Quarterly Results:', qrCount);

// 2. INVESTOR PRESENTATIONS
const ipMapping = [
  { fy: '2027', year: '2027', divId: 'q9_in' },
  { fy: '2026', year: '2026', divId: 'q8_in' },
  { fy: '2025', year: '2025', divId: 'q7_in' },
  { fy: '2024', year: '2024', divId: 'q6_in' },
  { fy: '2023', year: '2023', divId: 'q5_in' },
  { fy: '2022', year: '2022', divId: 'q4_in' },
  { fy: '2021', year: '2021', divId: 'q1_in' },
  { fy: '2020', year: '2020', divId: 'q2_in' },
  { fy: '2019', year: '2019', divId: 'q3_in' },
];

console.log('\n=== INVESTOR PRESENTATIONS FROM LIVE SITE ===');
let ipCount = 0;
ipMapping.forEach(m => {
  const items = extractByDivId(rawData['investor-presentation'], m.divId);
  ipCount += items.length;
  console.log(`${m.fy} (${m.year}) [${m.divId}]: ${items.length} items -> ${items.map(i => i.text).join(', ')}`);
});
console.log('Total Investor Presentations:', ipCount);

// 3. EARNINGS CALL TRANSCRIPTS
const ectMapping = [
  { fy: '2027', year: '2027', divId: 'q9_c' },
  { fy: '2026', year: '2026', divId: 'q8_c' },
  { fy: '2025', year: '2025', divId: 'q7_c' },
  { fy: '2024', year: '2024', divId: 'q6_c' },
  { fy: '2023', year: '2023', divId: 'q5_c' },
  { fy: '2022', year: '2022', divId: 'q4_c' },
  { fy: '2021', year: '2021', divId: 'q1_c' },
  { fy: '2020', year: '2020', divId: 'q2_c' },
  { fy: '2019', year: '2019', divId: 'q3_c' },
];

console.log('\n=== EARNINGS CALL TRANSCRIPTS FROM LIVE SITE ===');
let ectCount = 0;
ectMapping.forEach(m => {
  const items = extractByDivId(rawData['earnings-call-transcripts'], m.divId);
  ectCount += items.length;
  console.log(`${m.fy} (${m.year}) [${m.divId}]: ${items.length} items -> ${items.map(i => i.text).join(', ')}`);
});
console.log('Total Earnings Call Transcripts:', ectCount);

// 4. EARNINGS CALL RECORDINGS
const ecrMapping = [
  { fy: '2027', year: '2027', divId: 'q6_c' },
  { fy: '2026', year: '2026', divId: 'q5_c' },
  { fy: '2025', year: '2025', divId: 'q4_c' },
  { fy: '2024', year: '2024', divId: 'q3_c' },
  { fy: '2023', year: '2023', divId: 'q2_c' },
  { fy: '2022', year: '2022', divId: 'q1_c' },
];

console.log('\n=== EARNINGS CALL RECORDINGS FROM LIVE SITE ===');
let ecrCount = 0;
ecrMapping.forEach(m => {
  const items = extractByDivId(rawData['earnings-call-recording'], m.divId);
  ecrCount += items.length;
  console.log(`${m.fy} (${m.year}) [${m.divId}]: ${items.length} items -> ${items.map(i => i.text).join(', ')}`);
});
console.log('Total Earnings Call Recordings:', ecrCount);

// 5. SHARE HOLDING STRUCTURES
const shsMapping = [
  { fy: '2027', year: '2027', divId: 'q9' },
  { fy: '2026', year: '2026', divId: 'q8' },
  { fy: '2025', year: '2025', divId: 'q7' },
  { fy: '2024', year: '2024', divId: 'q6' },
  { fy: '2023', year: '2023', divId: 'q5' },
  { fy: '2022', year: '2022', divId: 'q4' },
  { fy: '2021', year: '2021', divId: 'q1' },
  { fy: '2020', year: '2020', divId: 'q2' },
  { fy: '2019', year: '2019', divId: 'q3' },
];

console.log('\n=== SHARE HOLDING STRUCTURES FROM LIVE SITE ===');
let shsCount = 0;
shsMapping.forEach(m => {
  const items = extractByDivId(rawData['share-holding-structures'], m.divId);
  shsCount += items.length;
  console.log(`${m.fy} (${m.year}) [${m.divId}]: ${items.length} items -> ${items.map(i => i.text).join(', ')}`);
});
console.log('Total Share Holding Structures:', shsCount);

// 6. TOP 200 SHAREHOLDERS
const topMapping = [
  { fy: '2027', year: '2027', divId: 'q1_in' },
  { fy: '2026', year: '2026', divId: 'q8_in' },
  { fy: '2025', year: '2025', divId: 'q7_in' },
  { fy: '2024', year: '2024', divId: 'q6_in' },
];

console.log('\n=== TOP 200 SHAREHOLDERS FROM LIVE SITE ===');
let topCount = 0;
topMapping.forEach(m => {
  const items = extractByDivId(rawData['top-200-shareholders'], m.divId);
  topCount += items.length;
  console.log(`${m.fy} (${m.year}) [${m.divId}]: ${items.length} items -> ${items.map(i => i.text).join(', ')}`);
});
console.log('Total Top 200 Shareholders:', topCount);

// 7. SUBSIDIARIES ACCOUNTS
const subMapping = [
  { fy: 'FY26', year: '2026', divId: 'aq12' },
  { fy: 'FY25', year: '2025', divId: 'aq11' },
  { fy: 'FY24', year: '2024', divId: 'aq10' },
  { fy: 'FY23', year: '2023', divId: 'aq9' },
  { fy: 'FY22', year: '2022', divId: 'aq8' },
  { fy: 'FY21', year: '2021', divId: 'aq7' },
  { fy: 'FY20', year: '2020', divId: 'aq1' },
  { fy: 'FY19', year: '2019', divId: 'aq2' },
  { fy: 'FY18', year: '2018', divId: 'aq3' },
  { fy: 'FY17', year: '2017', divId: 'aq4' },
  { fy: 'FY16', year: '2016', divId: 'aq5' },
  { fy: 'FY15', year: '2015', divId: 'aq6' },
];

console.log('\n=== SUBSIDIARY ACCOUNTS FROM LIVE SITE ===');
let subCount = 0;
subMapping.forEach(m => {
  const items = extractByDivId(rawData['annual-accounts-of-subsidiaries-jvs'], m.divId);
  subCount += items.length;
  console.log(`${m.fy} (${m.year}) [${m.divId}]: ${items.length} items`);
});
console.log('Total Subsidiary Accounts:', subCount);
