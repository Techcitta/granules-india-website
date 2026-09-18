import fs from 'fs';
import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

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

function getQuarterCode(title) {
  const lower = title.toLowerCase();
  if (lower.includes('first')) return 'Q1';
  if (lower.includes('second')) return 'Q2';
  if (lower.includes('third')) return 'Q3';
  if (lower.includes('fourth') || lower.includes('fouth')) return 'Q4';
  return '';
}

// Clone existing structure
const newSections = JSON.parse(JSON.stringify(INVESTOR_SECTIONS_DATA));

function getSubcat(catId, subcatId) {
  const cat = newSections.find(c => c.id === catId);
  return cat ? cat.subcategories.find(s => s.id === subcatId) : null;
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
const qrSub = getSubcat('sec-financial-reports', 'quarterly-results');
if (qrSub) {
  const newQrItems = [];
  qrMapping.forEach(m => {
    const links = extractByDivId(rawData['quarterly-results'], m.divId);
    links.forEach(l => {
      const qCode = getQuarterCode(l.text) || 'Q';
      newQrItems.push({
        title: l.text,
        scope: 'Audited Consolidated & Standalone',
        period: `${qCode} ${m.fy}`,
        year: m.year,
        pdf: l.url
      });
    });
  });
  qrSub.items = newQrItems;
  console.log(`Quarterly Results updated: ${qrSub.items.length} items.`);
}

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
const ipSub = getSubcat('sec-investor-resources', 'investor-presentation');
if (ipSub) {
  const newIpItems = [];
  ipMapping.forEach(m => {
    const links = extractByDivId(rawData['investor-presentation'], m.divId);
    links.forEach(l => {
      const qCode = getQuarterCode(l.text) || 'Q';
      newIpItems.push({
        title: l.text,
        scope: `Investor Presentation - ${qCode} ${m.fy}`,
        period: `${qCode} ${m.fy}`,
        year: m.year,
        pdf: l.url
      });
    });
  });
  ipSub.items = newIpItems;
  console.log(`Investor Presentations updated: ${ipSub.items.length} items.`);
}

// 3. EARNINGS CALL TRANSCRIPTS
const ectMapping = [
  { fy: 'FY27', year: '2027', divId: 'q9_c' },
  { fy: 'FY26', year: '2026', divId: 'q8_c' },
  { fy: 'FY25', year: '2025', divId: 'q7_c' },
  { fy: 'FY24', year: '2024', divId: 'q6_c' },
  { fy: 'FY23', year: '2023', divId: 'q5_c' },
  { fy: 'FY22', year: '2022', divId: 'q4_c' },
  { fy: 'FY21', year: '2021', divId: 'q1_c' },
  { fy: 'FY20', year: '2020', divId: 'q2_c' },
  { fy: 'FY19', year: '2019', divId: 'q3_c' },
];
const ectSub = getSubcat('sec-investor-resources', 'earnings-call-transcripts');
if (ectSub) {
  const newEctItems = [];
  ectMapping.forEach(m => {
    const links = extractByDivId(rawData['earnings-call-transcripts'], m.divId);
    links.forEach(l => {
      const qCode = getQuarterCode(l.text);
      newEctItems.push({
        title: l.text,
        scope: `Earnings Call Transcript - ${qCode ? qCode + ' ' : ''}${m.fy}`,
        period: qCode ? `${qCode} ${m.fy}` : m.fy,
        year: m.year,
        pdf: l.url
      });
    });
  });
  ectSub.items = newEctItems;
  console.log(`Earnings Call Transcripts updated: ${ectSub.items.length} items.`);
}

// 4. EARNINGS CALL RECORDINGS
const ecrMapping = [
  { fy: 'FY27', year: '2027', divId: 'q6_c' },
  { fy: 'FY26', year: '2026', divId: 'q5_c' },
  { fy: 'FY25', year: '2025', divId: 'q4_c' },
  { fy: 'FY24', year: '2024', divId: 'q3_c' },
  { fy: 'FY23', year: '2023', divId: 'q2_c' },
  { fy: 'FY22', year: '2022', divId: 'q1_c' },
];
const ecrSub = getSubcat('sec-investor-resources', 'earnings-call-recording');
if (ecrSub) {
  const newEcrItems = [];
  ecrMapping.forEach(m => {
    const links = extractByDivId(rawData['earnings-call-recording'], m.divId);
    links.forEach(l => {
      const qCode = getQuarterCode(l.text) || 'Q';
      newEcrItems.push({
        title: l.text,
        scope: `Earnings Call Audio - ${qCode} ${m.fy}`,
        period: `${qCode} ${m.fy}`,
        year: m.year,
        pdf: l.url
      });
    });
  });
  ecrSub.items = newEcrItems;
  console.log(`Earnings Call Recordings updated: ${ecrSub.items.length} items.`);
}

// 5. SHARE HOLDING STRUCTURES
const shsMapping = [
  { fy: 'FY27', year: '2027', divId: 'q9' },
  { fy: 'FY26', year: '2026', divId: 'q8' },
  { fy: 'FY25', year: '2025', divId: 'q7' },
  { fy: 'FY24', year: '2024', divId: 'q6' },
  { fy: 'FY23', year: '2023', divId: 'q5' },
  { fy: 'FY22', year: '2022', divId: 'q4' },
  { fy: 'FY21', year: '2021', divId: 'q1' },
  { fy: 'FY20', year: '2020', divId: 'q2' },
  { fy: 'FY19', year: '2019', divId: 'q3' },
];
const shsSub = getSubcat('sec-investor-resources', 'share-holding-structures');
if (shsSub) {
  const newShsItems = [];
  shsMapping.forEach(m => {
    const links = extractByDivId(rawData['share-holding-structures'], m.divId);
    links.forEach(l => {
      const qCode = getQuarterCode(l.text) || 'Q';
      newShsItems.push({
        title: l.text,
        scope: `Shareholding Pattern - ${qCode} ${m.fy}`,
        period: `${qCode} ${m.fy}`,
        year: m.year,
        pdf: l.url
      });
    });
  });
  shsSub.items = newShsItems;
  console.log(`Share Holding Structures updated: ${shsSub.items.length} items.`);
}

// 6. TOP 200 SHAREHOLDERS
const topMapping = [
  { fy: 'FY27', year: '2027', divId: 'q1_in' },
  { fy: 'FY26', year: '2026', divId: 'q8_in' },
  { fy: 'FY25', year: '2025', divId: 'q7_in' },
  { fy: 'FY24', year: '2024', divId: 'q6_in' },
];
const topSub = getSubcat('sec-investor-resources', 'top-200-shareholders');
if (topSub) {
  const newTopItems = [];
  topMapping.forEach(m => {
    const links = extractByDivId(rawData['top-200-shareholders'], m.divId);
    links.forEach(l => {
      const qCode = getQuarterCode(l.text) || 'Q';
      newTopItems.push({
        title: l.text,
        scope: `Top 200 Shareholders - ${qCode} ${m.fy}`,
        period: `${qCode} ${m.fy}`,
        year: m.year,
        pdf: l.url
      });
    });
  });
  topSub.items = newTopItems;
  console.log(`Top 200 Shareholders updated: ${topSub.items.length} items.`);
}

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
const subSub = getSubcat('sec-financial-reports', 'annual-accounts-of-subsidiaries-jvs');
if (subSub) {
  const newSubItems = [];
  subMapping.forEach(m => {
    const links = extractByDivId(rawData['annual-accounts-of-subsidiaries-jvs'], m.divId);
    links.forEach(l => {
      newSubItems.push({
        title: l.text,
        scope: 'Subsidiary Financial Statements',
        period: m.fy,
        year: m.year,
        pdf: l.url
      });
    });
  });
  subSub.items = newSubItems;
  console.log(`Subsidiary Accounts updated: ${subSub.items.length} items.`);
}

// Clean and index all items
newSections.forEach(cat => {
  cat.subcategories.forEach(sub => {
    sub.items.forEach((item, idx) => {
      item.id = `${sub.id}-${idx}`;
      item.category = cat.id;
      item.subcategoryId = sub.id;
      item.subcategoryLabel = sub.label;
    });
  });
});

// Output code to investorData.ts
const fileHeader = `// Automatically scraped & structured investor data from granulesindia.com
export interface InvestorDocItem {
  id: string;
  title: string; // REPORT / DOCUMENT NAME
  scope: string; // ENTITY / REPORTING SCOPE
  period: string; // REPORTING PERIOD (e.g. FY 2024-25, Q2 FY26, Q1 FY27)
  year: string; // Year for filtering (e.g. '2027', '2026', '2025', '2024')
  pdf?: string; // Direct PDF URL from granulesindia.com or local file
  webUrl?: string; // Interactive report URL (e.g. vercel app)
  category: string;
  subcategoryId: string;
  subcategoryLabel: string;
}

export interface InvestorSubcategory {
  id: string;
  label: string;
  items: InvestorDocItem[];
}

export interface InvestorCategory {
  id: string;
  title: string;
  badge: string;
  description: string;
  subcategories: InvestorSubcategory[];
  isContact?: boolean;
}

export const INVESTOR_SECTIONS_DATA: InvestorCategory[] = ${JSON.stringify(newSections, null, 2)};
`;

fs.writeFileSync('src/data/investorData.ts', fileHeader, 'utf8');
console.log('Successfully written perfect investorData.ts!');
