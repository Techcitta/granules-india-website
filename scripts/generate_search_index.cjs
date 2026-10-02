const fs = require('fs');
const path = require('path');

const portfolio = require('../src/data/productPortfolio.json');
const complexMolecules = [
  { product: 'Abemaciclib', therapy: 'Oncology', status: 'USDMF Filed' },
  { product: 'Avatrombopag Maleate', therapy: 'Cardiovascular (CVS)', status: 'USDMF Filed' },
  { product: 'Calcium Oxybate', therapy: 'CNS stimulant', status: 'USDMF Filed' },
  { product: 'Magnesium Oxybate', therapy: 'CNS stimulant', status: 'USDMF Filed' },
  { product: 'Potassium Oxybate', therapy: 'CNS stimulant', status: 'USDMF Filed' },
  { product: 'Sodium Oxybate', therapy: 'CNS stimulant', status: 'USDMF Filed' },
  { product: 'Elacestrant Di HCl', therapy: 'Oncology', status: 'USDMF Filed' },
  { product: 'Fruquintinib', therapy: 'Oncology', status: 'USDMF Filed' },
  { product: 'Lisdexamfetamine', therapy: 'CNS stimulant', status: 'USDMF Filed' },
  { product: 'Ruxolitinib HCl', therapy: 'Oncology', status: 'USDMF Filed' },
  { product: 'Ruxolitinib Phosphate', therapy: 'Oncology', status: 'USDMF Filed' },
  { product: 'Serdexmethylphenidate', therapy: 'Oncology', status: 'USDMF Filed' },
];

const peptideProducts = [
  { name: 'Semaglutide', type: 'GLP-1 Receptor Agonist', therapy: 'Diabetes / Obesity', desc: 'Synthetic peptide active ingredient synthesized with hybrid phase chemistry.' },
  { name: 'Tirzepatide', type: 'Dual GIP/GLP-1 Agonist', therapy: 'Metabolic Disorders', desc: 'Specialized 39-amino-acid synthetic peptide produced via scalable SPPS.' },
  { name: 'Liraglutide', type: 'GLP-1 Receptor Agonist', therapy: 'Type-2 Diabetes', desc: 'Acylated human glucagon-like peptide-1 analogue manufactured under cGMP.' },
  { name: 'Teduglutide', type: 'GLP-2 Analogue', therapy: 'Gastrointestinal', desc: 'Novel 33-amino-acid peptide analogue produced with high chemical purity.' },
  { name: 'Custom Peptide Synthesis', type: 'CDMO Service', therapy: 'Custom Therapeutics', desc: 'Tailored research and commercial scale custom peptide synthesis from gram to multi-kilogram lots.' }
];

const corePages = [
  // --- CORE PAGES & BUSINESS HUBS ---
  {
    id: 'page-home',
    title: 'Granules India — Homepage',
    category: 'Company',
    badge: 'Home',
    location: 'Granules India › Home',
    description: 'Leading global vertically integrated pharmaceutical manufacturing delivering APIs, PFIs, Finished Dosages, and Peptides.',
    href: '/',
    keywords: ['home', 'homepage', 'granules india', 'overview', 'main', 'pharmaceutical'],
  },
  {
    id: 'page-pfi-hub',
    title: 'Pharmaceutical Formulation Intermediates (PFIs)',
    category: 'Products',
    badge: 'PFI Scale',
    location: 'Business › PFIs',
    description: 'World-pioneering directly compressible granules engineered for high-speed tableting, cost efficiency, and batch-to-batch uniformity.',
    href: '/business/pfi',
    keywords: ['pfi', 'pfis', 'granules', 'pharmaceutical formulation intermediates', 'directly compressible granules', 'tableting', 'direct compression', 'ready to compress'],
  },
  {
    id: 'page-api-hub',
    title: 'Active Pharmaceutical Ingredients (APIs)',
    category: 'Products',
    badge: 'API Hub',
    location: 'Business › APIs',
    description: 'World-scale high-purity APIs with USFDA, EDQM, and WHO approvals, robust DMF filings, and backward-integrated chemical synthesis.',
    href: '/business/api',
    keywords: ['api', 'apis', 'active pharmaceutical ingredients', 'bulk drugs', 'active ingredients', 'dmf', 'usfda apis', 'molecules'],
  },
  {
    id: 'page-fd-hub',
    title: 'Finished Dosage Forms (FD) & Commercial Formulations',
    category: 'Products',
    badge: 'Formulations',
    location: 'Business › Finished Dosages',
    description: 'Multi-billion unit tableting and packaging capacity producing high-quality prescription and OTC solid oral dosages.',
    href: '/business/fd',
    keywords: ['fd', 'finished dosage', 'finished dosages', 'tablets', 'capsules', 'caplets', 'solid oral dosage', 'packaging', 'formulations'],
  },
  {
    id: 'page-generics-hub',
    title: 'Generics Business & Vertical Integration',
    category: 'Business',
    badge: 'Generics',
    location: 'Business › Generics',
    description: 'Strategic vertical integration from basic chemicals to APIs, PFIs, and finished tablets ensuring global supply chain resilience.',
    href: '/business/generics',
    keywords: ['generics', 'commercial generics', 'vertical integration', 'cost leadership', 'supply chain', 'business verticals'],
  },
  {
    id: 'page-senn-tides',
    title: 'Senn Tides — Peptide CDMO Platform',
    category: 'Business',
    badge: 'Peptide CDMO',
    location: 'Business › Senn Tides',
    description: 'Swiss precision and Indian scale: custom synthetic peptide manufacturing, GLP-1 analogues, oligonucleotides, and hybrid SPPS/LPPS.',
    href: '/senn-tides',
    keywords: ['senn tides', 'peptides', 'peptide cdmo', 'glp-1', 'semaglutide', 'tirzepatide', 'oligonucleotides', 'synthetic peptides', 'switzerland'],
  },
  {
    id: 'page-portfolio-catalog',
    title: 'Complete Product Portfolio Catalog',
    category: 'Products',
    badge: 'Catalog',
    location: 'Products › Portfolio',
    description: 'Explore Granules complete therapeutic catalog across Analgesic, NSAIDs, Antidiabetic, CVS, CNS, Oncology, and Respiratory therapies.',
    href: '/business/product-portfolio',
    keywords: ['product portfolio', 'products', 'product list', 'catalog', 'therapies', 'molecules catalog', 'all products'],
  },
  {
    id: 'page-complex-pipeline',
    title: 'Complex Molecules Pipeline & USDMF Filings',
    category: 'Products',
    badge: 'Pipeline',
    location: 'Products › Complex Molecules',
    description: 'USDMF-filed complex generic molecules targeting high-barrier therapeutic areas including oncology and specialty CNS stimulants.',
    href: '/products',
    keywords: ['complex molecules', 'pipeline', 'usdmf filed', 'oncology generics', 'specialty molecules', 'abemaciclib', 'fruquintinib'],
  },
  {
    id: 'page-ascelis',
    title: 'Ascelis Peptides — Advanced Formulations',
    category: 'Business',
    badge: 'Peptides',
    location: 'Company › Ascelis Peptides',
    description: 'Innovative peptide formulation technologies and novel drug delivery platforms accelerating complex therapies.',
    href: '/company/ascelis-peptides',
    keywords: ['ascelis', 'ascelis peptides', 'peptide delivery', 'advanced formulations', 'novel drug delivery'],
  },
  {
    id: 'page-czro',
    title: 'Granules CZRO — Carbon Zero & Green Chemical Synthesis',
    category: 'Sustainability',
    badge: 'Net Zero',
    location: 'Company › Granules CZRO',
    description: 'Revolutionizing active pharmaceutical ingredient manufacturing with green hydrogen, renewable electricity, and bio-feedstocks.',
    href: '/company/granules-czro',
    keywords: ['czro', 'granules czro', 'carbon zero', 'green hydrogen', 'green chemicals', 'net zero 2050', 'sustainable chemistry'],
  },
  {
    id: 'page-gls',
    title: 'Granules Life Sciences (GLS)',
    category: 'Company',
    badge: 'Subsidiary',
    location: 'Company › Granules Life Sciences',
    description: 'Dedicated subsidiary providing specialized pharmaceutical formulations and regulatory compliance for global markets.',
    href: '/company/granules-life-sciences',
    keywords: ['granules life sciences', 'gls', 'subsidiary', 'finished formulations', 'life sciences'],
  },
  {
    id: 'page-rd',
    title: 'Research & Development (R&D) & Innovation',
    category: 'Business',
    badge: 'Innovation',
    location: 'Business › R&D',
    description: 'Innovation hubs in Hyderabad and Virginia (USA) driving green chemistry, formulation development, and Quality by Design (QbD).',
    href: '/business/rd',
    keywords: ['rd', 'r&d', 'research', 'development', 'laboratories', 'innovation', 'scientists', 'qbd', 'flow chemistry'],
  },
  {
    id: 'page-quality',
    title: 'Quality & Regulatory Compliance',
    category: 'Business',
    badge: 'Compliance',
    location: 'Business › Quality',
    description: 'Uncompromising cGMP compliance validated by regular inspections from USFDA, EDQM, WHO, TGA Australia, and COFEPRIS.',
    href: '/business/quality-compliance',
    keywords: ['quality', 'compliance', 'cgmp', 'usfda', 'edqm', 'inspections', 'regulatory audits', 'quality assurance'],
  },
  {
    id: 'page-facilities',
    title: 'Global Manufacturing Facilities & Sites',
    category: 'Business',
    badge: 'Manufacturing',
    location: 'Business › Facilities',
    description: 'State-of-the-art facilities located at Gagillapur, Bonthapally, Jeedimetla, Vizag (Unit 4 & 5), and Chantilly, Virginia (USA).',
    href: '/business/facilities',
    keywords: ['facilities', 'plants', 'manufacturing sites', 'gagillapur', 'bonthapally', 'jeedimetla', 'vizag', 'chantilly'],
  },
  {
    id: 'page-op-excellence',
    title: 'Operational Excellence & Lean Manufacturing',
    category: 'Business',
    badge: 'Operations',
    location: 'Company › Operational Excellence',
    description: 'Continuous process improvement, robotic automation, high-speed lines, and Lean Six Sigma methodology.',
    href: '/company/operational-excellence',
    keywords: ['operational excellence', 'lean', 'six sigma', 'automation', 'continuous improvement', 'manufacturing efficiency'],
  },

  // --- COMPANY & LEADERSHIP ---
  {
    id: 'page-company',
    title: 'About Granules — Vision, Purpose & Scale',
    category: 'Company',
    badge: 'About Us',
    location: 'Company › Overview',
    description: 'Over 40 years of pioneering scale, science, and ethical values in global pharmaceutical manufacturing.',
    href: '/company',
    keywords: ['company', 'about', 'about us', 'history', 'overview', 'vision', 'purpose', 'scale'],
  },
  {
    id: 'page-leadership',
    title: 'Board of Directors & Executive Leadership',
    category: 'Company',
    badge: 'Leadership',
    location: 'Company › Leadership',
    description: 'Executive management team led by Chairman & Managing Director Dr. Krishna Prasad Chigurupati.',
    href: '/company/leadership',
    keywords: ['leadership', 'board of directors', 'executives', 'krishna prasad', 'uma devi', 'management', 'governance'],
  },
  {
    id: 'page-subsidiaries',
    title: 'Global Subsidiaries Network',
    category: 'Company',
    badge: 'Subsidiaries',
    location: 'Company › Subsidiaries',
    description: 'Information on Granules Pharmaceuticals Inc. (GPI USA), Granules Life Sciences, Senn Tides, and Granules CZRO.',
    href: '/company/global-subsidiaries',
    keywords: ['subsidiaries', 'global subsidiaries', 'gpi', 'usa', 'gls', 'senn tides', 'czro', 'international offices'],
  },
  {
    id: 'page-milestones',
    title: 'Company Journey & Historic Milestones (1984 - Present)',
    category: 'Company',
    badge: 'Journey',
    location: 'Company › Milestones',
    description: 'Explore the 40-year journey of continuous capacity expansions, technological leaps, and international acquisitions.',
    href: '/company/milestone',
    keywords: ['milestones', 'journey', 'history', 'timeline', 'founding', '1984', 'growth'],
  },
  {
    id: 'page-awards',
    title: 'Awards & Industry Recognitions',
    category: 'Company',
    badge: 'Awards',
    location: 'Company › Awards',
    description: 'Prestigious national and international recognitions for manufacturing excellence, ESG achievements, and corporate governance.',
    href: '/company/awards',
    keywords: ['awards', 'accolades', 'recognitions', 'honors', 'achievements', 'esg awards'],
  },

  // --- SUSTAINABILITY & CSR ---
  {
    id: 'page-sustainability',
    title: 'Sustainability & ESG Overview',
    category: 'Sustainability',
    badge: 'ESG',
    location: 'Sustainability › Overview',
    description: 'Commitment to Net Zero 2050, green chemistry, EcoVadis Gold rating, circular water systems, and renewable energy.',
    href: '/sustainability',
    keywords: ['sustainability', 'esg', 'net zero', 'carbon neutral', 'climate', 'green chemistry', 'environment'],
  },
  {
    id: 'page-sus-strategy',
    title: 'Sustainability Strategy & ESG Pillars',
    category: 'Sustainability',
    badge: 'Strategy',
    location: 'Sustainability › Strategy',
    description: 'Four ESG pillars: Climate Action, Resource Stewardship, Responsible Supply Chains, and Empowering Communities.',
    href: '/sustainability/strategy',
    keywords: ['sustainability strategy', 'esg pillars', 'decarbonization', 'renewable power', 'science based targets'],
  },
  {
    id: 'page-esg-action',
    title: 'ESG in Action — Real Impact & Case Studies',
    category: 'Sustainability',
    badge: 'Impact',
    location: 'Sustainability › ESG in Action',
    description: 'Tangible environmental and social achievements: Zero Liquid Discharge (ZLD), solar rooftop installations, and biodiversity.',
    href: '/sustainability/esg-in-action',
    keywords: ['esg in action', 'zld', 'zero liquid discharge', 'solar', 'biodiversity', 'afforestation', 'energy efficiency'],
  },
  {
    id: 'page-esg-profile',
    title: 'ESG Profile & External ESG Ratings (EcoVadis Gold)',
    category: 'Sustainability',
    badge: 'Ratings',
    location: 'Sustainability › ESG Profile',
    description: 'EcoVadis Gold Medal rating, CDP disclosures, and global ESG benchmarks showcasing transparency and leadership.',
    href: '/sustainability/esg-profile',
    keywords: ['esg profile', 'ecovadis gold', 'cdp', 'ratings', 'esg score', 'disclosures', 'transparency'],
  },
  {
    id: 'page-ehs',
    title: 'EHS Documents & Statutory Submissions',
    category: 'Sustainability',
    badge: 'EHS Filings',
    location: 'Sustainability › EHS Submissions',
    description: 'Official statutory compliance returns: Bio-Medical Waste Form-IV annual returns, hazardous waste filings, and environmental orders by facility.',
    href: '/sustainability/ehs-submissions',
    keywords: ['ehs', 'ehs submissions', 'ehs documents', 'biomedical waste', 'form iv', 'hazardous waste', 'statutory', 'cfo order', 'pcb'],
  },
  {
    id: 'page-community',
    title: 'Community Development & CSR (Granules Foundation)',
    category: 'Sustainability',
    badge: 'CSR',
    location: 'Sustainability › Community & CSR',
    description: 'Pharma Pathshala skill training for underprivileged youth, healthcare mobile clinics, clean water access, and school education support.',
    href: '/community',
    keywords: ['csr', 'community', 'granules foundation', 'pharma pathshala', 'skill development', 'healthcare outreach', 'education'],
  },

  // --- INVESTOR RELATIONS ---
  {
    id: 'page-investor',
    title: 'Investor Relations Portal',
    category: 'Investors',
    badge: 'Investors',
    location: 'Investors › Overview',
    description: 'Financial results, quarterly earnings releases, investor presentations, stock prices (BSE: 532482 / NSE: GRANULES), and disclosures.',
    href: '/investor',
    keywords: ['investor', 'investors', 'share price', 'financial results', 'quarterly results', 'earnings', 'bse', 'nse', 'stock'],
  },
  {
    id: 'page-annual-reports',
    title: 'Integrated Annual Reports & Accounts',
    category: 'Investors',
    badge: 'Annual Reports',
    location: 'Investors › Annual Reports',
    description: 'Download the Integrated Annual Report FY 25-26, FY 24-25, FY 23-24 with complete audited accounts and ESG metrics.',
    href: '/investor/annual-reports',
    keywords: ['annual report', 'annual reports', 'integrated report', 'financial statements', 'balance sheet', 'audited accounts', 'fy25', 'fy26'],
  },

  // --- CAREERS & MEDIA ---
  {
    id: 'page-careers',
    title: 'Careers at Granules — Job Opportunities',
    category: 'Careers',
    badge: 'Careers',
    location: 'Careers › Opportunities',
    description: 'Build a bold career where science meets purpose. Explore opportunities in R&D, manufacturing, quality, supply chain, and commercial.',
    href: '/careers',
    keywords: ['careers', 'jobs', 'hiring', 'openings', 'pharma jobs', 'work at granules', 'apply', 'vacancies'],
  },
  {
    id: 'page-life',
    title: 'Life at Granules — Culture & Values',
    category: 'Careers',
    badge: 'Culture',
    location: 'Careers › Life at Granules',
    description: 'Our core values: Credibility, Candor, Collaboration, and Commitment. Employee health, career growth, and diverse workplace.',
    href: '/careers/life-at-granules',
    keywords: ['life at granules', 'culture', 'values', 'workplace', 'employee benefits', 'diversity'],
  },
  {
    id: 'page-media',
    title: 'Newsroom & Corporate Press Releases',
    category: 'Media',
    badge: 'Newsroom',
    location: 'Media › Newsroom',
    description: 'Official corporate announcements, USFDA approvals, business developments, and executive updates.',
    href: '/media',
    keywords: ['media', 'news', 'press releases', 'newsroom', 'announcements', 'updates', 'fda approval'],
  },
  {
    id: 'page-contact',
    title: 'Contact Us & Global Office Addresses',
    category: 'Contact',
    badge: 'Contact',
    location: 'Company › Contact',
    description: 'Corporate headquarters in Hyderabad, regional sales offices in Virginia (USA), Switzerland, and worldwide manufacturing contacts.',
    href: '/contact',
    keywords: ['contact', 'contact us', 'address', 'hyderabad headquarters', 'phone', 'email', 'inquiry', 'sales desk'],
  },

  // --- CORE MOLECULES (Featured Products) ---
  {
    id: 'mol-paracetamol',
    title: 'Paracetamol (Acetaminophen) — API, PFI & Finished Dosage',
    category: 'Products',
    badge: 'Core Molecule',
    location: 'Products › Paracetamol (All Verticals)',
    description: 'World-leading Paracetamol manufacturer: pure bulk API, ready-to-compress PFI granules (Compresso-PAP), and finished tablets.',
    href: '/business/generics',
    keywords: ['paracetamol', 'acetaminophen', 'apap', 'analgesic', 'antipyretic', 'pain relief', 'fever', 'paracetamol pfi', 'paracetamol api', 'tablets'],
  },
  {
    id: 'mol-metformin',
    title: 'Metformin HCl & Metformin ER — API, PFI & Finished Dosage',
    category: 'Products',
    badge: 'Core Molecule',
    location: 'Products › Metformin (All Verticals)',
    description: 'High-scale first-line type-2 diabetes medication available as API powder, DC granules, and extended-release finished tablets.',
    href: '/business/generics',
    keywords: ['metformin', 'metformin hcl', 'metformin er', 'extended release', 'diabetes', 'antidiabetic', 'metformin pfi', 'metformin api'],
  },
  {
    id: 'mol-ibuprofen',
    title: 'Ibuprofen — API, PFI & Finished Dosage',
    category: 'Products',
    badge: 'Core Molecule',
    location: 'Products › Ibuprofen (All Verticals)',
    description: 'Massive scale NSAID pain relief available as API, directly compressible PFI granules, and film-coated finished tablets.',
    href: '/business/generics',
    keywords: ['ibuprofen', 'nsaid', 'anti inflammatory', 'pain relief', 'ibuprofen pfi', 'ibuprofen api', 'finished tablets'],
  },
  {
    id: 'mol-guaifenesin',
    title: 'Guaifenesin — Expectorant API & Formulations',
    category: 'Products',
    badge: 'Core Molecule',
    location: 'Products › Guaifenesin',
    description: 'Expectorant API and finished dosages for respiratory tract and cough/cold therapy with backward integrated manufacturing.',
    href: '/business/generics',
    keywords: ['guaifenesin', 'expectorant', 'cough', 'cold', 'respiratory', 'guaifenesin api'],
  },
  {
    id: 'mol-methocarbamol',
    title: 'Methocarbamol — Centrally Acting Muscle Relaxant',
    category: 'Products',
    badge: 'Core Molecule',
    location: 'Products › Methocarbamol',
    description: 'Centrally-acting muscle relaxant API and finished dosage formulations manufactured with complete vertical integration.',
    href: '/business/generics',
    keywords: ['methocarbamol', 'muscle relaxant', 'cns', 'methocarbamol api', 'finished tablets'],
  },
  {
    id: 'mol-gabapentin',
    title: 'Gabapentin Capsules & Tablets',
    category: 'Products',
    badge: 'Formulation',
    location: 'Products › Finished Dosages',
    description: 'Anticonvulsant and neuropathic pain treatment approved by USFDA and distributed globally.',
    href: '/business/fd',
    keywords: ['gabapentin', 'neuropathic pain', 'cns', 'anticonvulsant', 'capsules', 'tablets', 'anda'],
  },
  {
    id: 'mol-colchicine',
    title: 'Colchicine Tablets',
    category: 'Products',
    badge: 'Formulation',
    location: 'Products › Finished Dosages',
    description: 'Treatment for acute gout flares and familial Mediterranean fever with USFDA approval.',
    href: '/business/fd',
    keywords: ['colchicine', 'gout', 'fever', 'tablets', 'usfda', 'anda'],
  }
];

// Add Peptide Products
peptideProducts.forEach((pep, i) => {
  corePages.push({
    id: `pep-${pep.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `${pep.name} (${pep.type})`,
    category: 'Products',
    badge: 'Peptide',
    location: 'Products › Senn Tides Peptides',
    description: `${pep.therapy}: ${pep.desc}`,
    href: '/senn-tides',
    keywords: [pep.name.toLowerCase(), pep.type.toLowerCase(), pep.therapy.toLowerCase(), 'peptides', 'senn tides', 'glp-1', 'spps'],
  });
});

// Add Complex Molecules Pipeline
complexMolecules.forEach((cm, i) => {
  corePages.push({
    id: `cm-${cm.product.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    title: `${cm.product} — ${cm.therapy}`,
    category: 'Products',
    badge: 'Pipeline',
    location: 'Products › Complex Molecules',
    description: `${cm.therapy} molecule with ${cm.status} status in the Granules pipeline.`,
    href: '/products',
    keywords: [cm.product.toLowerCase(), cm.therapy.toLowerCase(), 'complex molecule', 'pipeline', 'usdmf filed', 'oncology'],
  });
});

// Add all 156 Products from productPortfolio.json
portfolio.products.forEach((prod, i) => {
  const isPfi = prod.section === 'Pharmaceutical Formulation Intermediates' || prod.segment === 'PFI';
  const isApi = prod.section === 'Active Pharmaceutical Ingredients' || prod.segment === 'API';
  const isFd = prod.section === 'Finished Dosages' || prod.segment === 'Finished Dosage';

  let href = '/business/product-portfolio';
  let badge = 'Product';
  let location = 'Products › Portfolio';

  if (isPfi) {
    href = '/business/pfi';
    badge = 'PFI Granule';
    location = 'Business › PFIs';
  } else if (isApi) {
    href = '/business/api';
    badge = 'API Molecule';
    location = 'Business › APIs';
  } else if (isFd) {
    href = '/business/fd';
    badge = 'Finished Dosage';
    location = 'Business › Finished Dosages';
  }

  const concentrationStr = prod.concentration ? ` (${prod.concentration})` : '';
  const gradeStr = prod.grade ? ` [${prod.grade}]` : '';
  const therapyStr = prod.therapy ? ` — ${prod.therapy}` : '';

  const cleanName = prod.name.trim();
  const kw = [
    cleanName.toLowerCase(),
    ...(prod.therapy ? [prod.therapy.toLowerCase()] : []),
    ...(prod.brand ? [prod.brand.toLowerCase()] : []),
    ...(isPfi ? ['pfi', 'granule', 'direct compression'] : []),
    ...(isApi ? ['api', 'active ingredient', 'bulk drug'] : []),
    ...(isFd ? ['fd', 'finished dosage', 'tablet', 'capsule'] : []),
  ];

  corePages.push({
    id: `prod-auto-${i + 1}`,
    title: `${cleanName}${concentrationStr}${gradeStr}`,
    category: 'Products',
    badge: badge,
    location: location,
    description: `${prod.section}${therapyStr}${prod.brand ? ` | Brand: ${prod.brand}` : ''}. Manufactured under global cGMP standards.`,
    href: href,
    keywords: kw,
  });
});

console.log(`Total indexed search items: ${corePages.length}`);

// Generate TypeScript Content
const tsContent = `// Auto-generated Search Index for Granules India
// Contains complete coverage of site pages, all 156 portfolio products, peptides, and pipeline molecules.

export interface SearchResultItem {
  id: string;
  title: string;
  category: 'Products' | 'Business' | 'Company' | 'Investors' | 'Sustainability' | 'Careers' | 'Media' | 'Contact';
  badge: string;
  location: string;
  description: string;
  href: string;
  keywords: string[];
}

export const SEARCH_INDEX: SearchResultItem[] = ${JSON.stringify(corePages, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, '../src/data/searchData.ts'), tsContent, 'utf-8');
console.log('Successfully written src/data/searchData.ts');
