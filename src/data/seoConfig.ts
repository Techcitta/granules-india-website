export interface PageSeoMeta {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
}

export const DEFAULT_SEO: PageSeoMeta = {
  title: 'Granules India — Global Pharmaceutical Manufacturing | APIs, PFIs & Finished Dosages',
  description: 'Granules India is a leading vertically integrated global pharmaceutical manufacturer delivering Active Pharmaceutical Ingredients (APIs), Pharmaceutical Formulation Intermediates (PFIs), Finished Dosage Forms (FDs), and Peptides worldwide.',
  keywords: 'Granules India, Pharmaceutical Manufacturing, APIs, PFIs, Finished Dosages, Active Pharmaceutical Ingredients, Pharmaceutical Formulation Intermediates, Peptides, Senn Tides, Paracetamol, Metformin, Ibuprofen',
  canonical: 'https://www.granulesindia.com/',
  ogType: 'website',
  ogImage: '/assets/company/nav-logo.png',
};

export const SEO_CONFIG: Record<string, PageSeoMeta> = {
  '/': DEFAULT_SEO,

  // --- BUSINESS & CORE VERTICALS (Highest Google Search Relevance) ---
  '/business/pfi': {
    title: 'Pharmaceutical Formulation Intermediates (PFI) | Granules India',
    description: 'Granules India is the world pioneer and global leader in Pharmaceutical Formulation Intermediates (PFIs), manufacturing directly compressible granules (Paracetamol PFI, Metformin PFI, Ibuprofen PFI) for high-speed tableting.',
    keywords: 'PFI, Pharmaceutical Formulation Intermediates, Granules PFI, directly compressible granules, PFI granules, tableting granules, Paracetamol PFI, Metformin PFI, Ibuprofen PFI, ready to compress granules, Granules India',
    canonical: 'https://www.granulesindia.com/business/pfi',
  },
  '/pfi': {
    title: 'Pharmaceutical Formulation Intermediates (PFI) | Granules India',
    description: 'Granules India is the world pioneer and global leader in Pharmaceutical Formulation Intermediates (PFIs), manufacturing directly compressible granules (Paracetamol PFI, Metformin PFI, Ibuprofen PFI) for high-speed tableting.',
    keywords: 'PFI, Pharmaceutical Formulation Intermediates, Granules PFI, directly compressible granules, PFI granules, tableting granules, Paracetamol PFI, Metformin PFI, Ibuprofen PFI, ready to compress granules, Granules India',
    canonical: 'https://www.granulesindia.com/business/pfi',
  },

  '/business/api': {
    title: 'Active Pharmaceutical Ingredients (APIs) | Granules India',
    description: 'World-leading API manufacturer with USFDA, EDQM, and WHO approvals. Large-scale high-purity APIs including Paracetamol, Metformin, Ibuprofen, Guaifenesin, and complex oncology molecules.',
    keywords: 'API, Active Pharmaceutical Ingredients, Granules API, bulk drugs, Paracetamol API, Metformin API, Ibuprofen API, Guaifenesin API, USFDA approved APIs, DMF filings, Granules India',
    canonical: 'https://www.granulesindia.com/business/api',
  },
  '/api': {
    title: 'Active Pharmaceutical Ingredients (APIs) | Granules India',
    description: 'World-leading API manufacturer with USFDA, EDQM, and WHO approvals. Large-scale high-purity APIs including Paracetamol, Metformin, Ibuprofen, Guaifenesin, and complex oncology molecules.',
    keywords: 'API, Active Pharmaceutical Ingredients, Granules API, bulk drugs, Paracetamol API, Metformin API, Ibuprofen API, Guaifenesin API, USFDA approved APIs, DMF filings, Granules India',
    canonical: 'https://www.granulesindia.com/business/api',
  },

  '/business/fd': {
    title: 'Finished Dosage Forms (FD) & Formulations | Granules India',
    description: 'High-speed solid oral dosage manufacturing delivering billions of high-quality tablets, caplets, and capsules to US, European, and global healthcare markets.',
    keywords: 'Finished Dosages, FD, Finished Dosage Forms, tablets, capsules, solid oral dosage, pharmaceutical formulations, ANDA filings, packaging, Granules India',
    canonical: 'https://www.granulesindia.com/business/fd',
  },
  '/fd': {
    title: 'Finished Dosage Forms (FD) & Formulations | Granules India',
    description: 'High-speed solid oral dosage manufacturing delivering billions of high-quality tablets, caplets, and capsules to US, European, and global healthcare markets.',
    keywords: 'Finished Dosages, FD, Finished Dosage Forms, tablets, capsules, solid oral dosage, pharmaceutical formulations, ANDA filings, packaging, Granules India',
    canonical: 'https://www.granulesindia.com/business/fd',
  },

  '/business/generics': {
    title: 'Generics Business & Vertical Integration | Granules India',
    description: 'Advancing affordable, high-quality healthcare through complete vertical integration from basic chemicals and APIs to PFIs and Finished Dosages.',
    keywords: 'Generics, generic pharmaceuticals, vertical integration, cost leadership, supply chain resilience, commercial generics, Granules India',
    canonical: 'https://www.granulesindia.com/business/generics',
  },
  '/business': {
    title: 'Generics Business & Vertical Integration | Granules India',
    description: 'Advancing affordable, high-quality healthcare through complete vertical integration from basic chemicals and APIs to PFIs and Finished Dosages.',
    keywords: 'Generics, generic pharmaceuticals, vertical integration, cost leadership, supply chain resilience, commercial generics, Granules India',
    canonical: 'https://www.granulesindia.com/business/generics',
  },

  '/business/product-portfolio': {
    title: 'Product Portfolio — APIs, PFIs & Finished Dosages | Granules India',
    description: 'Browse Granules India full therapeutic product catalog across analgesics, antidiabetics, NSAIDs, CVS, CNS, oncology, and respiratory care.',
    keywords: 'Granules product catalog, product portfolio, pharmaceutical products list, APIs list, PFIs list, finished formulations, Granules India',
    canonical: 'https://www.granulesindia.com/business/product-portfolio',
  },
  '/products': {
    title: 'Complex Molecules Pipeline & Products | Granules India',
    description: 'Explore Granules pipeline of complex generic molecules, USDMF filings, oncology breakthroughs, and specialty formulations.',
    keywords: 'complex molecules, pharmaceutical pipeline, USDMF filed molecules, oncology generics, Abemaciclib, Fruquintinib, Granules India',
    canonical: 'https://www.granulesindia.com/products',
  },

  // --- PEPTIDES & SENN TIDES ---
  '/senn-tides': {
    title: 'Senn Tides — Peptide CDMO in Switzerland & India | Granules India',
    description: 'Premier peptide CDMO delivering custom peptide synthesis, GLP-1 analogues, oligonucleotides, and hybrid solution-solid phase peptide manufacturing.',
    keywords: 'Senn Tides, Peptides, Peptide CDMO, GLP-1 peptides, Semaglutide, Tirzepatide, synthetic peptides, oligonucleotides, Switzerland, Granules India',
    canonical: 'https://www.granulesindia.com/senn-tides',
  },
  '/company/senn-tides': {
    title: 'Senn Tides — Peptide CDMO in Switzerland & India | Granules India',
    description: 'Premier peptide CDMO delivering custom peptide synthesis, GLP-1 analogues, oligonucleotides, and hybrid solution-solid phase peptide manufacturing.',
    keywords: 'Senn Tides, Peptides, Peptide CDMO, GLP-1 peptides, Semaglutide, Tirzepatide, synthetic peptides, oligonucleotides, Switzerland, Granules India',
    canonical: 'https://www.granulesindia.com/senn-tides',
  },
  '/business/peptides': {
    title: 'Peptide Therapeutics & CDMO Platform | Granules India',
    description: 'Specialized synthetic peptides, automated peptide synthesis, therapeutic peptides, and regulatory CMC support across clinical and commercial scales.',
    keywords: 'peptide therapeutics, peptide CDMO, custom peptide synthesis, peptide APIs, regulatory CMC, Granules India',
    canonical: 'https://www.granulesindia.com/business/peptides',
  },
  '/company/ascelis-peptides': {
    title: 'Ascelis Peptides — Advanced Formulation & Peptides | Granules India',
    description: 'Innovative peptide drug delivery and formulation capabilities accelerating complex peptide therapies to global markets.',
    keywords: 'Ascelis Peptides, peptide formulations, advanced drug delivery, peptide innovation, Granules India',
    canonical: 'https://www.granulesindia.com/company/ascelis-peptides',
  },

  // --- R&D & OPERATIONS ---
  '/business/rd': {
    title: 'Research & Development (R&D) & Innovation | Granules India',
    description: 'Cutting-edge innovation centers in Hyderabad and USA spearheading complex generics, novel drug delivery, biocatalysis, and green flow chemistry.',
    keywords: 'Granules R&D, pharmaceutical research, drug development, QbD, green chemistry, formulation development, Hyderabad R&D',
    canonical: 'https://www.granulesindia.com/business/rd',
  },
  '/business/quality-compliance': {
    title: 'Quality & Regulatory Compliance | Granules India',
    description: 'Stringent cGMP quality standards validated by leading global authorities: USFDA, EDQM, WHO, TGA Australia, COFEPRIS, and PMDA Japan.',
    keywords: 'Quality compliance, cGMP, USFDA inspection, EDQM approved, WHO compliance, pharmaceutical quality assurance, regulatory audits',
    canonical: 'https://www.granulesindia.com/business/quality-compliance',
  },
  '/business/facilities': {
    title: 'Global Manufacturing Facilities & Sites | Granules India',
    description: 'State-of-the-art manufacturing plants located at Gagillapur, Bonthapally, Jeedimetla, Vizag (Unit V), and Chantilly, Virginia (USA).',
    keywords: 'Granules manufacturing facilities, pharmaceutical plants, Gagillapur plant, Bonthapally, Jeedimetla, Vizag Unit 5, Chantilly USA',
    canonical: 'https://www.granulesindia.com/business/facilities',
  },

  // --- COMPANY & ABOUT ---
  '/company': {
    title: 'About Granules India — History, Vision & Purpose',
    description: 'Over 40 years of pioneering scale, science, and vertical integration in pharmaceutical manufacturing. Delivering affordable healthcare solutions worldwide.',
    keywords: 'About Granules India, Granules history, pharmaceutical vision, company overview, Dr Krishna Prasad Chigurupati, Hyderabad headquarters',
    canonical: 'https://www.granulesindia.com/company',
  },
  '/company/leadership': {
    title: 'Board of Directors & Executive Leadership | Granules India',
    description: 'Meet the executive leadership team guiding Granules India, led by Chairman & Managing Director Dr. Krishna Prasad Chigurupati.',
    keywords: 'Granules leadership, Board of Directors, Dr Krishna Prasad Chigurupati, executive management, corporate governance, Granules India',
    canonical: 'https://www.granulesindia.com/company/leadership',
  },
  '/company/global-subsidiaries': {
    title: 'Global Subsidiaries Network | Granules India',
    description: 'Explore Granules global subsidiaries including Granules Pharmaceuticals Inc. (USA), Granules Life Sciences, Senn Tides, and Granules CZRO.',
    keywords: 'Granules subsidiaries, Granules Pharmaceuticals Inc USA, Granules Life Sciences, Senn Tides, Granules CZRO, global operations',
    canonical: 'https://www.granulesindia.com/company/global-subsidiaries',
  },
  '/company/milestone': {
    title: 'Our Journey & Key Milestones | Granules India',
    description: 'Four decades of milestones: from pioneering PFI manufacturing in 1984 to global scale, US acquisitions, and green chemical synthesis.',
    keywords: 'Granules milestones, company history, 1984 founding, pharmaceutical scale, growth timeline, Granules India',
    canonical: 'https://www.granulesindia.com/company/milestone',
  },
  '/company/awards': {
    title: 'Awards & Accolades | Granules India',
    description: 'Industry recognitions, ESG leadership honors, and manufacturing excellence awards earned by Granules India.',
    keywords: 'Granules awards, pharmaceutical honors, manufacturing accolades, ESG recognition, excellence awards',
    canonical: 'https://www.granulesindia.com/company/awards',
  },
  '/company/granules-czro': {
    title: 'Granules CZRO — Carbon Zero & Green Chemical Synthesis',
    description: 'Pioneering Net Zero chemical manufacturing: integrating green hydrogen, renewable power, and bio-based feedstocks into active pharmaceutical ingredients.',
    keywords: 'Granules CZRO, Carbon Zero, green hydrogen, green ammonia, sustainable pharma, net zero 2050, green chemicals',
    canonical: 'https://www.granulesindia.com/company/granules-czro',
  },
  '/company/granules-life-sciences': {
    title: 'Granules Life Sciences | Pharmaceutical Formulations',
    description: 'Dedicated subsidiary delivering specialized pharmaceutical finished formulations and healthcare solutions for international markets.',
    keywords: 'Granules Life Sciences, GLS, pharmaceutical formulations, finished dosages, life sciences India',
    canonical: 'https://www.granulesindia.com/company/granules-life-sciences',
  },
  '/company/operational-excellence': {
    title: 'Operational Excellence & Lean Manufacturing | Granules India',
    description: 'Continuous improvement, high-speed automated packaging, robotics, and Lean Six Sigma methodologies powering global operations.',
    keywords: 'operational excellence, Lean manufacturing, Six Sigma, automation, tableting efficiency, Granules India',
    canonical: 'https://www.granulesindia.com/company/operational-excellence',
  },

  // --- SUSTAINABILITY & ESG ---
  '/sustainability': {
    title: 'Sustainability & ESG Overview | Granules India',
    description: 'Committed to healing lives and healing the planet. Discover Granules Net Zero 2050 roadmap, EcoVadis Gold rating, and science-based climate goals.',
    keywords: 'Granules sustainability, ESG India, EcoVadis Gold, Net Zero 2050, green pharmaceuticals, BRSR report, sustainability report',
    canonical: 'https://www.granulesindia.com/sustainability',
  },
  '/sustainability/strategy': {
    title: 'Sustainability Strategy & ESG Pillars | Granules India',
    description: 'Our four pillars of sustainability: Climate Action, Resource Stewardship, Responsible Supply Chains, and Empowering Communities.',
    keywords: 'sustainability strategy, ESG pillars, carbon reduction, renewable energy, waste minimization, circular economy, Granules India',
    canonical: 'https://www.granulesindia.com/sustainability/strategy',
  },
  '/sustainability/esg-in-action': {
    title: 'ESG in Action — Real Environmental & Social Impact | Granules India',
    description: 'Practical ESG initiatives delivering tangible results in solar energy adoption, zero liquid discharge (ZLD), and community empowerment.',
    keywords: 'ESG in action, zero liquid discharge, solar power, CSR projects, community healthcare, green pharma',
    canonical: 'https://www.granulesindia.com/sustainability/esg-in-action',
  },
  '/sustainability/esg-profile': {
    title: 'ESG Profile & External ESG Ratings | Granules India',
    description: 'Granules external ESG performance, EcoVadis Gold certification, CDP climate scores, and transparency indices.',
    keywords: 'ESG profile, EcoVadis Gold rating, CDP score, ESG disclosures, sustainability ratings, Granules India',
    canonical: 'https://www.granulesindia.com/sustainability/esg-profile',
  },
  '/sustainability/ehs-submissions': {
    title: 'EHS Documents & Statutory Submissions | Granules India',
    description: 'Access official statutory compliance returns: Bio-Medical Waste Form-IV annual reports, hazardous waste returns, and environmental consent orders by facility.',
    keywords: 'EHS submissions, bio-medical waste Form IV, hazardous waste returns, environmental compliance, pollution control board orders, Granules India',
    canonical: 'https://www.granulesindia.com/sustainability/ehs-submissions',
  },
  '/community': {
    title: 'Community Impact & Corporate Social Responsibility (CSR) | Granules India',
    description: 'Granules Foundation: uplifting rural and urban communities through Pharma Pathshala skill training, primary healthcare, education, and women empowerment.',
    keywords: 'Granules Foundation, CSR India, Pharma Pathshala, community development, healthcare camps, vocational training, CSR initiatives',
    canonical: 'https://www.granulesindia.com/community',
  },

  // --- INVESTORS ---
  '/investor': {
    title: 'Investor Relations Portal | Granules India Limited (BSE: 532482, NSE: GRANULES)',
    description: 'Official investor portal: quarterly financial results, investor presentations, earnings call recordings, shareholding pattern, and SEBI disclosures.',
    keywords: 'Granules investor relations, Granules share price, BSE 532482, NSE GRANULES, financial results, quarterly earnings, annual report, dividend',
    canonical: 'https://www.granulesindia.com/investor',
  },
  '/investors': {
    title: 'Investor Relations Portal | Granules India Limited',
    description: 'Official investor portal: quarterly financial results, investor presentations, earnings call recordings, shareholding pattern, and SEBI disclosures.',
    keywords: 'Granules investor relations, financial results, investor presentations, earnings call, annual report, BSE 532482',
    canonical: 'https://www.granulesindia.com/investor',
  },
  '/investor/annual-reports': {
    title: 'Integrated Annual Reports & Financial Accounts | Granules India',
    description: 'Download Granules India Integrated Annual Reports (FY 2025-26, FY 2024-25, FY 2023-24) with audited financial statements and ESG disclosures.',
    keywords: 'Granules annual report, integrated report, FY 2025-26, FY 2024-25, audited financial statements, balance sheet, investor report',
    canonical: 'https://www.granulesindia.com/investor/annual-reports',
  },

  // --- MEDIA & CAREERS ---
  '/media': {
    title: 'Newsroom, Press Releases & Corporate Announcements | Granules India',
    description: 'Latest official company updates: USFDA regulatory approvals, quarterly earnings announcements, business partnerships, and media coverage.',
    keywords: 'Granules news, press releases, FDA approval, corporate news, pharmaceutical media, announcements',
    canonical: 'https://www.granulesindia.com/media',
  },
  '/careers': {
    title: 'Careers at Granules — Make Better Health, Build a Bolder Career',
    description: 'Explore career opportunities across scientific R&D, advanced manufacturing, quality control, and business leadership at Granules India.',
    keywords: 'Careers at Granules, pharma jobs Hyderabad, pharmaceutical careers, hiring, R&D openings, manufacturing jobs, Granules India',
    canonical: 'https://www.granulesindia.com/careers',
  },
  '/careers/life-at-granules': {
    title: 'Life at Granules — Culture, Values & Growth Opportunities',
    description: 'Discover life at Granules: inclusive culture, diversity, continuous professional development, competitive benefits, and a purpose-driven workplace.',
    keywords: 'Life at Granules, company culture, employee well-being, pharma workplace, diversity, career growth',
    canonical: 'https://www.granulesindia.com/careers/life-at-granules',
  },
  '/contact': {
    title: 'Contact Us & Global Offices | Granules India Limited',
    description: 'Connect with Granules India corporate headquarters in Hyderabad, regional sales offices in USA, Europe, and international manufacturing centers.',
    keywords: 'Contact Granules India, Hyderabad office address, customer inquiries, corporate headquarters, sales contacts, phone number, email',
    canonical: 'https://www.granulesindia.com/contact',
  },

  // --- POLICIES ---
  '/privacy-policy': {
    title: 'Data Privacy Policy | Granules India',
    description: 'Granules India commitment to data protection, personal information processing, and compliance with global privacy regulations (GDPR, DPDP).',
    keywords: 'privacy policy, data protection, GDPR compliance, DPDP Act, personal data, Granules India',
    canonical: 'https://www.granulesindia.com/privacy-policy',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | Granules India',
    description: 'Learn about how cookies and tracking technologies are utilized across Granules India digital platforms and how you can manage your preferences.',
    keywords: 'cookie policy, cookies, cookie consent, tracking technologies, Granules India',
    canonical: 'https://www.granulesindia.com/cookie-policy',
  },
  '/disclaimer': {
    title: 'Website Disclaimer & Forward-Looking Statements | Granules India',
    description: 'Legal disclaimer and forward-looking statements disclosure for Granules India website content and investor materials.',
    keywords: 'disclaimer, forward looking statements, legal notice, Granules India',
    canonical: 'https://www.granulesindia.com/disclaimer',
  },
  '/data-protection-notice': {
    title: 'Data Protection Notice | Granules India',
    description: 'Formal notification regarding processing of personal data, legal rights, and compliance procedures at Granules India.',
    keywords: 'data protection notice, personal data, privacy notice, Granules India',
    canonical: 'https://www.granulesindia.com/data-protection-notice',
  },
  '/terms-conditions': {
    title: 'Terms & Conditions of Use | Granules India',
    description: 'Official terms and conditions governing the access, navigation, and use of Granules India digital properties.',
    keywords: 'terms and conditions, terms of use, legal agreement, website rules, Granules India',
    canonical: 'https://www.granulesindia.com/terms-conditions',
  },
};

export function getSeoForPath(pathname: string): PageSeoMeta {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (SEO_CONFIG[normalized]) {
    return SEO_CONFIG[normalized];
  }
  // Try subpaths
  for (const [key, val] of Object.entries(SEO_CONFIG)) {
    if (key !== '/' && normalized.startsWith(key)) {
      return val;
    }
  }
  return DEFAULT_SEO;
}
