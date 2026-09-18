const { chromium } = require('playwright');

async function testBreadcrumb() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  for (const vp of [{ w: 1280, h: 800 }, { w: 1920, h: 1080 }, { w: 1376, h: 789 }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.goto('http://localhost:5173/company', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const b = await page.locator('.cp-breadcrumb').first().boundingBox();
    const nav = await page.locator('.cp-nav').first().boundingBox();
    console.log(`[${vp.w}x${vp.h}] Nav bottom: ${(nav.y + nav.height).toFixed(1)}px | Breadcrumb top: ${b.y.toFixed(1)}px | Gap: ${(b.y - (nav.y + nav.height)).toFixed(1)}px`);

    await page.screenshot({ path: `scratch/breadcrumb_test_${vp.w}x${vp.h}.png` });
    await page.close();
  }
  await browser.close();
}

testBreadcrumb().catch(console.error);
