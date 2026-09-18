import fs from 'fs';
import { INVESTOR_SECTIONS_DATA } from '../src/data/investorData.ts';

const updatedData = JSON.parse(JSON.stringify(INVESTOR_SECTIONS_DATA));

// 1. In annual-reports: fix off-by-one years and 2027 typo
const annRep = updatedData.find(c => c.id === 'sec-financial-reports')
  .subcategories.find(s => s.id === 'annual-reports');

const arYearMap = {
  'FY 25-26': '2026',
  'FY 24-25': '2025',
  'FY 23-24': '2024',
  'FY 22-23': '2023',
  'FY 21-22': '2022',
  'FY 20-21': '2021',
  'FY 19-20': '2020',
  'FY 18-19': '2019',
  'FY 17-18': '2018',
  'FY 16-17': '2017',
  'FY 15-16': '2016',
  'FY 14-15': '2015',
  'FY 13-14': '2014',
  'FY 12-13': '2013',
  'FY 11-12': '2012',
  'FY 10-11': '2011',
  'FY 09-10': '2010',
  'FY 08-09': '2009',
  'FY 07-08': '2008',
  'FY 06-07': '2007',
  'FY 05-06': '2006'
};

annRep.items.forEach(item => {
  const normPeriod = (item.period || '').replace(/–/g, '-').trim();
  for (const [key, yr] of Object.entries(arYearMap)) {
    if (normPeriod.includes(key) || item.title.includes(key)) {
      item.year = yr;
      break;
    }
  }
  if (item.pdf && item.pdf.includes('2027AnnualReport-FY13-14.pdf')) {
    item.year = '2014';
    item.period = 'FY 13-14';
    item.title = 'Annual Report - FY13-14';
  }
});

// 2. In quarterly-results: update FY-Result-Jun26.pdf to year 2027, Q1 FY27
const qr = updatedData.find(c => c.id === 'sec-financial-reports')
  .subcategories.find(s => s.id === 'quarterly-results');
qr.items.forEach(item => {
  if (item.pdf && item.pdf.includes('FY-Result-Jun26.pdf')) {
    item.year = '2027';
    item.period = 'Q1 FY27';
    item.title = 'First Quarter';
    item.scope = 'Financial Results - Q1 FY 2026-27 (Quarter ended June 30, 2026)';
  }
});

// 3. In annual-accounts-of-subsidiaries-jvs: ensure all 54 items
const subJvs = updatedData.find(c => c.id === 'sec-financial-reports')
  .subcategories.find(s => s.id === 'annual-accounts-of-subsidiaries-jvs');
const hasMarch15 = subJvs.items.some(i => i.pdf && i.pdf.includes('GranulesPharmaceuticalsInc.-March'));
if (!hasMarch15) {
  subJvs.items.push({
    id: `annual-accounts-of-subsidiaries-jvs-${subJvs.items.length}`,
    title: 'Granules Pharmaceuticals, Inc.',
    scope: 'Subsidiary Financial Statements',
    period: 'FY 2014-15',
    year: '2015',
    pdf: "https://granulesindia.com/wp-content/uploads/pdf/Annual-Accounts-of-Subsidiaries/7234GranulesPharmaceuticalsInc.-March'15.pdf",
    category: 'sec-financial-reports',
    subcategoryId: 'annual-accounts-of-subsidiaries-jvs',
    subcategoryLabel: 'Annual Accounts of Subsidiaries & JVs'
  });
}

// 4. In investor-presentation: update Earnings-Presentation-Q1FY27vf.pdf to year 2027, Q1 FY27
const invPres = updatedData.find(c => c.id === 'sec-investor-resources')
  .subcategories.find(s => s.id === 'investor-presentation');
invPres.items.forEach(item => {
  if (item.pdf && item.pdf.includes('Earnings-Presentation-Q1FY27vf.pdf')) {
    item.year = '2027';
    item.period = 'Q1 FY27';
    item.title = 'First Quarter';
    item.scope = 'Earnings Presentation - Q1 FY 2026-27';
  }
});

// 5. In earnings-call-transcripts: update Q1-FY27-Concall-Transcript-Final.pdf to year 2027, Q1 FY27
const ecTrans = updatedData.find(c => c.id === 'sec-investor-resources')
  .subcategories.find(s => s.id === 'earnings-call-transcripts');
ecTrans.items.forEach(item => {
  if (item.pdf && item.pdf.includes('Q1-FY27-Concall-Transcript-Final.pdf')) {
    item.year = '2027';
    item.period = 'Q1 FY27';
    item.title = 'First Quarter';
    item.scope = 'Earnings Call Transcript - Q1 FY 2026-27';
  }
});

// 6. In earnings-call-recording: populate ALL 18 recordings
const ecRec = updatedData.find(c => c.id === 'sec-investor-resources')
  .subcategories.find(s => s.id === 'earnings-call-recording');
const allRecordings = [
  // 2027
  { title: 'First Quarter', period: 'Q1 FY27', year: '2027', scope: 'Earnings Call Audio - Q1 FY 2026-27', pdf: 'https://granulesindia.com/wp-content/uploads/2026/07/10044713.mp3' },
  // 2026
  { title: 'Fourth Quarter', period: 'Q4 FY26', year: '2026', scope: 'Earnings Call Audio - Q4 FY 2025-26', pdf: 'https://granulesindia.com/wp-content/uploads/2026/04/10041996.mp3' },
  { title: 'Third Quarter', period: 'Q3 FY26', year: '2026', scope: 'Earnings Call Audio - Q3 FY 2025-26', pdf: 'http://granulesindia.com/wp-content/uploads/2026/01/10039050.mp3' },
  { title: 'Second Quarter', period: 'Q2 FY26', year: '2026', scope: 'Earnings Call Audio - Q2 FY 2025-26', pdf: 'http://granulesindia.com/wp-content/uploads/2025/11/10037340.mp3' },
  { title: 'First Quarter', period: 'Q1 FY26', year: '2026', scope: 'Earnings Call Audio - Q1 FY 2025-26', pdf: 'https://granulesindia.com/wp-content/uploads/2025/08/FY26-First-Quarter-10033917.mp3' },
  // 2025
  { title: 'Fourth Quarter', period: 'Q4 FY25', year: '2025', scope: 'Earnings Call Audio - Q4 FY 2024-25', pdf: 'https://granulesindia.com/wp-content/uploads/2025/05/10032175.mp3' },
  { title: 'Third Quarter', period: 'Q3 FY25', year: '2025', scope: 'Earnings Call Audio - Q3 FY 2024-25', pdf: 'https://granulesindia.com/wp-content/uploads/2025/01/10028826.mp3' },
  { title: 'Second Quarter', period: 'Q2 FY25', year: '2025', scope: 'Earnings Call Audio - Q2 FY 2024-25', pdf: 'https://granulesindia.com/wp-content/uploads/2024/11/LII2020241106156083.mp3' },
  { title: 'First Quarter', period: 'Q1 FY25', year: '2025', scope: 'Earnings Call Audio - Q1 FY 2024-25', pdf: 'https://granulesindia.com/wp-content/uploads/2024/07/LII2020240730154171.mp3' },
  // 2024
  { title: 'Fourth Quarter', period: 'Q4 FY24', year: '2024', scope: 'Earnings Call Audio - Q4 FY 2023-24', pdf: 'https://granulesindia.com/wp-content/uploads/2024/05/LII2020240515152648.mp3' },
  { title: 'Third Quarter', period: 'Q3 FY24', year: '2024', scope: 'Earnings Call Audio - Q3 FY 2023-24', pdf: 'https://granulesindia.com/wp-content/uploads/2024/01/LII2020240123150766.mp3' },
  { title: 'Second Quarter', period: 'Q2 FY24', year: '2024', scope: 'Earnings Call Audio - Q2 FY 2023-24', pdf: 'https://granulesindia.com/wp-content/uploads/2023/11/LII2020231109149990.mp3' },
  { title: 'First Quarter', period: 'Q1 FY24', year: '2024', scope: 'Earnings Call Audio - Q1 FY 2023-24', pdf: 'https://granulesindia.com/wp-content/uploads/2023/08/LII2020230809148123-2023.mp3' },
  // 2023
  { title: 'Fourth Quarter', period: 'Q4 FY23', year: '2023', scope: 'Earnings Call Audio - Q4 FY 2022-23', pdf: 'https://granulesindia.com/wp-content/uploads/2023/05/Q4-Investor-Call-FY-23.mp3' },
  { title: 'Third Quarter', period: 'Q3 FY23', year: '2023', scope: 'Earnings Call Audio - Q3 FY 2022-23', pdf: 'https://granulesindia.com/wp-content/uploads/2023/01/Q3-Investor-Call-FY-23.mp3' },
  { title: 'Second Quarter', period: 'Q2 FY23', year: '2023', scope: 'Earnings Call Audio - Q2 FY 2022-23', pdf: 'https://granulesindia.com/wp-content/uploads/2022/10/Q2-Investor-Call-FY-23.mp3' },
  { title: 'First Quarter', period: 'Q1 FY23', year: '2023', scope: 'Earnings Call Audio - Q1 FY 2022-23', pdf: 'https://granulesindia.com/wp-content/uploads/2022/08/LII2020220810142086.mp3' },
  // 2022
  { title: 'Fourth Quarter', period: 'Q4 FY22', year: '2022', scope: 'Earnings Call Audio - Q4 FY 2021-22', pdf: 'https://granulesindia.com/wp-content/uploads/2022/05/GranulesIndiaLimitedQ4andFY22Earningscall.mp3' }
];
ecRec.items = allRecordings.map((rec, i) => ({
  id: `earnings-call-recording-${i}`,
  title: rec.title,
  scope: rec.scope,
  period: rec.period,
  year: rec.year,
  pdf: rec.pdf,
  category: 'sec-investor-resources',
  subcategoryId: 'earnings-call-recording',
  subcategoryLabel: 'Earnings Call Recording'
}));

// 7. In share-holding-structures: update Website-SHP-1_merged.pdf to year 2027, Q1 FY27
const shp = updatedData.find(c => c.id === 'sec-investor-resources')
  .subcategories.find(s => s.id === 'share-holding-structures');
shp.items.forEach(item => {
  if (item.pdf && item.pdf.includes('Website-SHP-1_merged.pdf')) {
    item.year = '2027';
    item.period = 'Q1 FY27';
    item.title = 'First Quarter';
    item.scope = 'Shareholding Pattern - Q1 FY 2026-27';
  }
});

// 8. In top-200-shareholders: update GRAN_TOP200_2027_firstq.pdf to year 2027, Q1 FY27
const top200 = updatedData.find(c => c.id === 'sec-investor-resources')
  .subcategories.find(s => s.id === 'top-200-shareholders');
top200.items.forEach(item => {
  if (item.pdf && item.pdf.includes('GRAN_TOP200_2027_firstq.pdf')) {
    item.year = '2027';
    item.period = 'Q1 FY27';
    item.title = 'First Quarter';
    item.scope = 'Top 200 Shareholders - Q1 FY 2026-27';
  }
});

// 9. In policies: expand to all 14 live policies
const polSubcat = updatedData.find(c => c.id === 'sec-investor-resources')
  .subcategories.find(s => s.id === 'policies');
const allPolicies = [
  { title: 'Code of Conduct for Board & SMP', year: '2025', pdf: 'https://granulesindia.com/wp-content/uploads/2025/11/Code-of-Conduct-for-Board-SMP.pdf' },
  { title: 'Code of Conduct for Prevention of Insider Trading', year: '2024', pdf: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/Code-of-Conduct-for-Prevention-of-Insider-Trading.pdf' },
  { title: 'Code of Practices and Procedures for fair disclosure', year: '2024', pdf: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/Code-of-Practices-and-Procedures-for-fair-disclosure.pdf' },
  { title: 'Code of Business Conduct for Suppliers', year: '2025', pdf: 'https://granulesindia.com/wp-content/uploads/2025/05/Supplier-Code-of-Conduct.pdf' },
  { title: 'Code of Business Conduct', year: '2024', pdf: 'https://granulesindia.com/wp-content/uploads/2024/12/Code-Of-Business-Conduct-file.pdf' },
  { title: 'CSR Policy', year: '2025', pdf: 'https://granulesindia.com/wp-content/uploads/2025/12/CSR-Policy.pdf' },
  { title: 'Dividend Distribution Policy', year: '2024', pdf: 'https://granulesindia.com/wp-content/uploads/pdf/Dividend-Distribution-policy.pdf' },
  { title: 'Investor Grievance Redressal Policy', year: '2022', pdf: 'https://granulesindia.com/wp-content/uploads/2022/03/Investor-Grievance-Redressal-Policy.pdf' },
  { title: 'Performance Evaluation & Remuneration Policy', year: '2025', pdf: 'https://granulesindia.com/wp-content/uploads/2025/11/Performance-Evaluation-And-Remuneration-Policy-2025-final.pdf' },
  { title: 'Policy on Material Subsidiaries', year: '2022', pdf: 'https://granulesindia.com/wp-content/uploads/2022/03/Policy-on-Material-Subsidiaries.pdf' },
  { title: 'Prevention of Sexual Harassment Policy', year: '2026', pdf: 'https://granulesindia.com/wp-content/uploads/2026/04/Prevention_of_Sexual_Harassment_Policy_1776760465717.pdf' },
  { title: 'Related Party Transactions Policy', year: '2025', pdf: 'https://granulesindia.com/wp-content/uploads/2025/02/Granules-Related-Party-Transactions-Policy-Updated-24.01.2025.pdf' },
  { title: 'Vigil Mechanism & Whistle Blower Policy', year: '2025', pdf: 'https://granulesindia.com/wp-content/uploads/2025/11/GIL-Whistle-blower-policy-Nov-2025.pdf' }
];
polSubcat.items = allPolicies.map((p, idx) => ({
  id: `policies-${idx}`,
  title: p.title,
  scope: 'Statutory Corporate Policy',
  period: `Updated ${p.year}`,
  year: p.year,
  pdf: p.pdf,
  category: 'sec-investor-resources',
  subcategoryId: 'policies',
  subcategoryLabel: 'Policies'
}));

// 10. In notice-of-board-meetings: update ONLY July 21, 2026 notice to year 2027
const nbm = updatedData.find(c => c.id === 'sec-notices-disclosures')
  .subcategories.find(s => s.id === 'notice-of-board-meetings');
nbm.items.forEach(item => {
  if (item.pdf && item.pdf.includes('/2026/07/NSEBSEINTIAMTION.pdf') && item.title.includes('July 21, 2026')) {
    item.year = '2027';
    item.period = 'July 21, 2026 (FY27)';
  }
});

// 11. In schedule-of-investor-meet: update Q1 2026-27 to year 2027, Q1 FY27
const sim = updatedData.find(c => c.id === 'sec-notices-disclosures')
  .subcategories.find(s => s.id === 'schedule-of-investor-meet');
sim.items.forEach(item => {
  if (item.pdf && item.pdf.includes('Earnings-Call-Invite-Q1-FY27.pdf')) {
    item.year = '2027';
    item.period = 'Q1 FY27';
  }
  if (item.pdf && item.pdf.includes('/2026/06/NSEBSEIIFL.pdf')) {
    item.year = '2027';
    item.period = 'June 23, 2026 (FY27)';
  }
  if (item.pdf && item.pdf.includes('Schedule-of-Analyst-and-Investor-Meet-June-03-2026.pdf')) {
    item.year = '2027';
    item.period = 'June 03, 2026 (FY27)';
  }
});

// 12. In newspaper-publications: update Q1 Results 2026-27 and AGM notice to year 2027
const np = updatedData.find(c => c.id === 'sec-notices-disclosures')
  .subcategories.find(s => s.id === 'newspaper-publications');
np.items.forEach(item => {
  if (item.pdf && item.pdf.includes('Granules-India-Ltd-UFR-Ad.pdf')) {
    item.year = '2027';
    item.period = 'Q1 FY27';
  }
  if (item.pdf && item.pdf.includes('Granules-India-Ltd-AGM-Notice.pdf')) {
    item.year = '2027';
    item.period = 'July 16, 2026 (FY27)';
  }
});

// 13. In other-disclosures: update 35th AGM, Monitoring report June 30, 2026, and Outcome July 21, 2026 to year 2027
const od = updatedData.find(c => c.id === 'sec-notices-disclosures')
  .subcategories.find(s => s.id === 'other-disclosures');
od.items.forEach(item => {
  if (item.pdf && item.pdf.includes('NSEBSEOUTCOMEFINAL.pdf')) {
    item.year = '2027';
    item.period = 'August 2026 (FY27)';
  }
  if (item.pdf && item.pdf.includes('Signed-MA-Report_June26.pdf')) {
    item.year = '2027';
    item.period = 'June 30, 2026 (Q1 FY27)';
  }
  if (item.pdf && item.pdf.includes('/2026/07/NSEBSEOUTCOME.pdf') && item.title.includes('July 21, 2026')) {
    item.year = '2027';
    item.period = 'July 21, 2026 (FY27)';
  }
});

// 14. Add EHS documents to sec-other-info as dedicated subcategory 'ehs-documents'
const otherInfoCat = updatedData.find(c => c.id === 'sec-other-info');
const existingEhs = otherInfoCat.subcategories.find(s => s.id === 'ehs-documents');
if (!existingEhs) {
  const ehsItemsRaw = [
    { text: 'Bio-Medical Waste Form-IV Annual Report', link: 'https://granulesindia.com/wp-content/uploads/2026/05/BPL-Bio-Medical-Waste-Form-IV-Annual-Report.pdf', year: '2026' },
    { text: 'Biomedical Waste Annual Returns 2025', link: 'https://granulesindia.com/wp-content/uploads/2025/10/Gagillapur-Biomedical-Waste-Annual-Report-2024.pdf', year: '2025' },
    { text: 'Annual Returns - Hazardous Waste (Form-4), E-Waste (Form-3) Biomedical Waste (Form-IV) and Environmental Statement (Form-V)', link: 'https://granulesindia.com/wp-content/uploads/2026/05/GGP-Annual-Returns-Hazardous-Waste-Form-4-E-Waste-Form-3-Biomedical-Waste-Form-IV-and-Environmental-Statement-Form-V.pdf', year: '2026' },
    { text: 'Biomedical Waste Annual Report-2024', link: 'https://granulesindia.com/wp-content/uploads/2025/10/Gagillapur-Biomedical-Waste-Annual-Report-2024.pdf', year: '2024' },
    { text: 'Bio-Medical Waste Form- IV Annual Report FY-2025 (From Jan-2025 to Dec-2025)', link: 'https://granulesindia.com/wp-content/uploads/2026/05/JDM-Bio-Medical-Waste-Form-IV-Annual-Report-FY-2025-From-Jan-2025-to-Dec-2025.pdf', year: '2025' },
    { text: 'Biomedical Waste Annual Report 2024', link: 'https://granulesindia.com/wp-content/uploads/2025/10/Jeedimetla-Biomedical-Waste-Annual-Report-2024.pdf', year: '2024' },
    { text: 'Bio-Medical Waste Form-IV Annual Report for the period from January-2025 to December-2025', link: 'https://granulesindia.com/wp-content/uploads/2026/05/GLS-Bio-Medical-Waste-Form-IV-Annual-Report-for-the-period-from-January-2025.pdf', year: '2025' },
    { text: 'Biomedical Waste Annual Report 2024', link: 'https://granulesindia.com/wp-content/uploads/2025/10/Granules-Life-Sciences-Biomedical-Waste-Annual-Report-2024.pdf', year: '2024' },
    { text: 'CFE & CFO order', link: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/CFE&amp;CFO-order.pdf', year: '2023' },
    { text: 'ISO-14001 & 45001 Certificate', link: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/ISO-14001&amp;45001-Certificate.pdf', year: '2023' },
    { text: 'Bio Medical Waste Annual Return for the year 2025 (Jan-Dec)', link: 'https://granulesindia.com/wp-content/uploads/2026/05/Unit-4-Bio-Medical-Waste-Annual-Return-for-the-year-2025-Jan-Dec.pdf', year: '2025' },
    { text: 'Biomedical Waste Annual Report 2024', link: 'https://granulesindia.com/wp-content/uploads/2025/10/Unit-4-Biomedical-Waste-Annual-Report-2024.pdf', year: '2024' },
    { text: 'CFE Order', link: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/CFE.pdf', year: '2022' },
    { text: 'CFO Order', link: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/CFO.pdf', year: '2022' },
    { text: 'ISO 14001 & 45001 Certificate', link: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/ISO-14001&amp;45001-ceritificate.pdf', year: '2023' },
    { text: 'Bio Medical Waste & E-Waste Annual Returns for the year 2025-2026', link: 'https://granulesindia.com/wp-content/uploads/2026/05/Unit-5-Bio-Medical-Waste-E-Waste-Annual-Returns-for-the-year-2025-2026.pdf', year: '2026' },
    { text: 'Biomedical Waste Annual Report 2024 (Unit V)', link: 'https://granulesindia.com/wp-content/uploads/2025/10/Unit-V-Biomedical-Waste-Annual-Returns-2024.pdf', year: '2024' },
    { text: 'PLI Certificate', link: 'https://granulesindia.com/wp-content/uploads/pdf/other-information/GRANULES-HCL-2021.pdf', year: '2021' }
  ];
  otherInfoCat.subcategories.push({
    id: 'ehs-documents',
    label: 'EHS Documents',
    items: ehsItemsRaw.map((ehs, idx) => ({
      id: `ehs-documents-${idx}`,
      title: ehs.text,
      scope: 'Environment, Health & Safety Compliance',
      period: `FY ${ehs.year}`,
      year: ehs.year,
      pdf: ehs.link,
      category: 'sec-other-info',
      subcategoryId: 'ehs-documents',
      subcategoryLabel: 'EHS Documents'
    }))
  });
}

// Clean up IDs so they are numbered monotonically per subcategory
updatedData.forEach(cat => {
  cat.subcategories.forEach(sub => {
    sub.items.forEach((item, idx) => {
      item.id = `${sub.id}-${idx}`;
      item.category = cat.id;
      item.subcategoryId = sub.id;
      item.subcategoryLabel = sub.label;
    });
  });
});

// Construct the new investorData.ts content
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

export const INVESTOR_SECTIONS_DATA: InvestorCategory[] = ${JSON.stringify(updatedData, null, 2)};
`;

fs.writeFileSync('src/data/investorData.ts', fileHeader, 'utf8');
console.log('Successfully wrote updated investorData.ts with all FY27 data!');
