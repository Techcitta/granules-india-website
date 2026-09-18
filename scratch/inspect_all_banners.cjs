const fs = require('fs');

const pages = [
  'HomePage.jsx', 'CompanyPage.tsx', 'GlobalSubsidiariesPage.tsx', 'MilestonePage.tsx',
  'AwardsPage.tsx', 'LeadershipPage.tsx', 'GranulesCzroPage.tsx', 'AscelisPeptidesPage.tsx',
  'SennTidesPage.tsx', 'GranulesLifeSciencesPage.tsx', 'OperationalExcellencePage.tsx',
  'GenericsPage.tsx', 'ApiPage.tsx', 'PfiPage.tsx', 'FdPage.tsx', 'RdPage.tsx',
  'QualityCompliancePage.tsx', 'FacilitiesPage.tsx', 'PeptidesPage.tsx',
  'SustainabilityOverviewPage.tsx', 'SustainabilityStrategyPage.tsx', 'EsgInActionPage.tsx',
  'EsgProfilePage.tsx', 'CommunityPage.tsx', 'InvestorOverviewPage.tsx',
  'InvestorAnnualReportsPage.tsx', 'MediaPage.tsx', 'CareerOverviewPage.tsx',
  'LifeAtGranulesPage.tsx', 'ProductPortfolioPage.tsx'
];

pages.forEach(p => {
  const file = 'src/pages/' + p;
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  const matches = [];
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('-cta') || l.includes('CareerSection') || l.includes('PartnerBanner') || l.includes('cp-career') || l.includes('class="careers') || l.includes('className="careers')) {
      matches.push((i+1) + ': ' + l.trim());
    }
  });
  if (matches.length) {
    console.log('=== ' + p + ' ===');
    console.log(matches.slice(-3).join('\n'));
  } else {
    console.log('=== ' + p + ' === (NONE)');
  }
});
