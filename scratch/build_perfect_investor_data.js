import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

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

const qrItems = [];
qrMapping.forEach(m => {
  const links = extractByDivId(rawData['quarterly-results'], m.divId);
  links.forEach(l => {
    // Determine quarter code e.g. Q1, Q2, Q3, Q4
    let qCode = 'Q';
    const lower = l.text.toLowerCase();
    if (lower.includes('first')) qCode = 'Q1';
    else if (lower.includes('second')) qCode = 'Q2';
    else if (lower.includes('third')) qCode = 'Q3';
    else if (lower.includes('fourth') || lower.includes('fouth')) qCode = 'Q4';

    qrItems.push({
      title: l.text,
      scope: 'Audited Consolidated & Standalone',
      period: `${qCode} ${m.fy}`,
      year: m.year,
      pdf: l.url
    });
  });
});

console.log(`Extracted ${qrItems.length} quarterly results.`);
// Check FY26
const fy26Qr = qrItems.filter(i => i.year === '2026');
console.log(`FY26 Quarterly items (${fy26Qr.length}):`);
fy26Qr.forEach(i => console.log(`  - [${i.title}] | ${i.period} | ${i.year} -> ${i.pdf}`));

// 2. INVESTOR PRESENTATIONS
const ipMapping = [
  { fy: 'FY27', year: '2027', divId: 'q9_in' },
  { fy: 'FY26', year: '2026', divId: 'q8_in' },
  { fy: 'FY25', year: '2025', divId: 'q7_in' },
  { fy: 'FY24', year: '2024', divId: 'q6_in' },
  { fy: 'FY23', year: '2023', divId: 'q5_in' },
  { fy: 'FY22', year: '2022', divId: 'q4_in' },
  { fy: 'FY21', year: '2021', divId: 'q1_in' },
  { fy: 'FY20', year: '2020', divId: 'q2_in' },
  { fy: 'FY19', year: '2019', divId: 'q3_in' },
];

const ipItems = [];
ipMapping.forEach(m => {
  const links = extractByDivId(rawData['investor-presentation'], m.divId);
  links.forEach(l => {
    let qCode = 'Q';
    const lower = l.text.toLowerCase();
    if (lower.includes('first')) qCode = 'Q1';
    else if (lower.includes('second')) qCode = 'Q2';
    else if (lower.includes('third')) qCode = 'Q3';
    else if (lower.includes('fourth')) qCode = 'Q4';

    ipItems.push({
      title: l.text,
      scope: `Investor Presentation - ${qCode} ${m.fy}`,
      period: `${qCode} ${m.fy}`,
      year: m.year,
      pdf: l.url
    });
  });
});
console.log(`Extracted ${ipItems.length} investor presentations.`);
const fy26Ip = ipItems.filter(i => i.year === '2026');
console.log(`FY26 Investor presentations (${fy26Ip.length}):`);
fy26Ip.forEach(i => console.log(`  - [${i.title}] | ${i.period} | ${i.year} -> ${i.pdf}`));
