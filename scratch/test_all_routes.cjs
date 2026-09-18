const { chromium } = require('playwright');

const routes = [
  '/',
  '/company',
  '/company/global-subsidiaries',
  '/company/milestone',
  '/company/awards',
  '/company/leadership',
  '/company/granules-czro',
  '/company/senn-tides',
  '/company/ascelis-peptides',
  '/company/granules-life-sciences',
  '/company/operational-excellence',
  '/business',
  '/business/generics',
  '/business/api',
  '/business/pfi',
  '/business/fd',
  '/business/product-portfolio',
  '/business/rd',
  '/business/quality-compliance',
  '/business/facilities',
  '/business/peptides',
  '/sustainability',
  '/sustainability/strategy',
  '/sustainability/esg-in-action',
  '/sustainability/esg-profile',
  '/sustainability/esg-in-action/community',
  '/community',
  '/investor',
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
];

(async () => {
  let browser;
  try {
    try {
      browser = await chromium.launch({ channel: 'msedge', headless: true });
    } catch {
      browser = await chromium.launch({ headless: true });
    }

    const page = await browser.newPage();
    const results = [];

    for (const route of routes) {
      const errors = [];
      const onErr = err => errors.push(err.toString());
      page.on('pageerror', onErr);

      try {
        await page.goto('http://127.0.0.1:5173' + route, { waitUntil: 'domcontentloaded', timeout: 10000 });
        await page.waitForTimeout(500);
        const info = await page.evaluate(() => {
          const root = document.getElementById('root');
          return {
            hasRoot: !!root,
            textLen: (root ? root.innerText : '').length,
            htmlLen: (root ? root.innerHTML : '').length,
            title: document.title,
          };
        });
        results.push({ route, status: 'OK', errors, ...info });
      } catch (e) {
        results.push({ route, status: 'FAILED', error: e.message });
      } finally {
        page.off('pageerror', onErr);
      }
    }

    console.log(JSON.stringify(results, null, 2));
    await browser.close();
  } catch (err) {
    console.error('Fatal:', err);
    if (browser) await browser.close();
  }
})();
