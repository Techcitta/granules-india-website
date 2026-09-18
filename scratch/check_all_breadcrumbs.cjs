const { chromium } = require('playwright');

async function checkAllPagesBreadcrumbs() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const testRoutes = [
    '/company',
    '/company/leadership',
    '/company/global-subsidiaries',
    '/business/generics',
    '/business/peptides',
    '/business/rd',
    '/business/facilities',
    '/business/quality-compliance',
    '/sustainability',
    '/sustainability/strategy',
    '/community',
    '/investor',
    '/careers',
    '/careers/life-at-granules',
    '/careers/opportunities',
    '/media',
  ];

  for (const url of testRoutes) {
    await page.goto(`http://localhost:5173${url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);

    const b = page.locator('.cp-breadcrumb').first();
    const nav = page.locator('.cp-nav').first();

    if (await b.count() > 0 && await nav.count() > 0) {
      const bBox = await b.boundingBox();
      const navBox = await nav.boundingBox();
      const gap = bBox.y - (navBox.y + navBox.height);
      console.log(`${url.padEnd(30)} -> Nav bottom: ${(navBox.y + navBox.height).toFixed(1)}px | Breadcrumb top: ${bBox.y.toFixed(1)}px | Gap: ${gap.toFixed(1)}px ${gap < 25 ? '⚠️ TOO CLOSE!' : '✅ OK'}`);
    } else {
      console.log(`${url.padEnd(30)} -> (No breadcrumb found)`);
    }
  }

  await browser.close();
}

checkAllPagesBreadcrumbs().catch(console.error);
