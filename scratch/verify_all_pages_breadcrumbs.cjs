const { chromium } = require('playwright');

async function verifyBreadcrumbsAllViewports() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const viewports = [
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1376x789', width: 1376, height: 789 },
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '390x844', width: 390, height: 844 },
  ];

  const routes = [
    '/company',
    '/company/leadership',
    '/sustainability',
    '/community',
    '/investor',
    '/business/generics',
    '/careers',
  ];

  let allPassed = true;

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    console.log(`\n--- Viewport: ${vp.name} ---`);
    for (const r of routes) {
      await page.goto(`http://localhost:5173${r}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);

      const b = page.locator('.cp-breadcrumb').first();
      const nav = page.locator('.cp-nav').first();

      if (await b.count() > 0 && await nav.count() > 0) {
        const bBox = await b.boundingBox();
        const navBox = await nav.boundingBox();
        const gap = bBox.y - (navBox.y + navBox.height);
        const pass = gap >= 20; // Minimum 20px gap required
        if (!pass) allPassed = false;
        console.log(`[${vp.name}] ${r.padEnd(25)} -> Nav bottom: ${(navBox.y + navBox.height).toFixed(1)}px | Breadcrumb top: ${bBox.y.toFixed(1)}px | Gap: ${gap.toFixed(1)}px ${pass ? '✅ PASS' : '❌ FAIL'}`);
      }
    }
    await context.close();
  }

  await browser.close();
  console.log(`\nOVERALL VERIFICATION: ${allPassed ? 'ALL PASSED!' : 'SOME FAILED!'}`);
}

verifyBreadcrumbsAllViewports().catch(console.error);
