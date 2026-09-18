const { chromium } = require('playwright');

const routes = [
  '/',
  '/business/generics',
  '/company',
  '/contact',
  '/sustainability',
  '/investor',
  '/business/api',
  '/business/pfi',
  '/business/fd',
  '/business/rd',
  '/business/quality-compliance',
  '/careers'
];

async function checkAllRoutes() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  for (const r of routes) {
    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    const url = 'http://127.0.0.1:5173' + r;
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 10000 });
      await page.waitForTimeout(500);
      const rootLength = await page.evaluate(() => document.getElementById('root')?.innerHTML.length || 0);
      if (rootLength < 100 || pageErrors.length > 0) {
        console.log('FAIL on ' + r + ' -> rootLen=' + rootLength + ', errors: ' + pageErrors.join(' | '));
      } else {
        console.log('OK on ' + r + ' -> rootLen=' + rootLength);
      }
    } catch (e) {
      console.log('ERROR on ' + r + ': ' + e.message);
    }
  }

  await browser.close();
}

checkAllRoutes();
