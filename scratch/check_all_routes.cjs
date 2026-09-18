const { chromium } = require('playwright');

const routes = [
  '/',
  '/company',
  '/company/global-subsidiaries',
  '/company/milestone',
  '/company/awards',
  '/company/leadership',
  '/company/granules-czro',
  '/company/ascelis-peptides',
  '/company/senn-tides',
  '/company/granules-life-sciences',
  '/company/operational-excellence',
  '/business/generics',
  '/business/api',
  '/business/pfi',
  '/business/fd',
  '/business/rd',
  '/business/quality-compliance',
  '/business/facilities',
  '/business/product-portfolio',
  '/business/peptides',
  '/sustainability',
  '/sustainability/strategy',
  '/sustainability/esg-in-action',
  '/sustainability/esg-profile',
  '/esg-profile',
  '/sustainability/esg-world',
  '/esg-world',
  '/sustainability/esg-in-action/community',
  '/sustainability/corporate-social-responsibility',
  '/sustainability/csr',
  '/sustainability/community',
  '/corporate-social-responsibility',
  '/csr',
  '/community',
  '/investor',
  '/investors',
  '/investor/v2',
  '/investor/annual-reports',
  '/media',
  '/careers',
  '/careers/life-at-granules',
  '/careers/opportunities',
  '/contact',
  '/privacy-policy',
  '/cookie-policy',
  '/disclaimer',
  '/data-protection-notice',
  '/terms-conditions',
  '/non-existent-page-404'
];

async function checkAll() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  let failCount = 0;
  for (const r of routes) {
    const pageErrors = [];
    const consoleErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const url = 'http://127.0.0.1:5173' + r;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 5000 });
      await page.waitForTimeout(300);
      const rootLength = await page.evaluate(() => document.getElementById('root')?.innerHTML.length || 0);
      if (rootLength < 100 || pageErrors.length > 0) {
        console.log('FAIL on ' + r + ' -> rootLen=' + rootLength + ' | PageErrors: ' + pageErrors.join(' ; ') + ' | ConsoleErrors: ' + consoleErrors.join(' ; '));
        failCount++;
      }
    } catch (e) {
      console.log('EXCEPTION on ' + r + ': ' + e.message);
      failCount++;
    }
    page.removeAllListeners('pageerror');
    page.removeAllListeners('console');
  }

  console.log('Finished testing all ' + routes.length + ' routes. Total failures: ' + failCount);
  await browser.close();
}

checkAll().catch(console.error);
