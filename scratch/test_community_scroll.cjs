const { chromium } = require('playwright');

async function testCommunity() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  for (const vp of [{ w: 1280, h: 800 }, { w: 1376, h: 789 }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.goto('http://localhost:5173/community', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // Scroll to leadership section
    const lead = page.locator('.ov-leadership').first();
    await lead.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);

    await page.screenshot({ path: `scratch/comm_quote_${vp.w}x${vp.h}.png` });
    await page.close();
  }
  await browser.close();
}

testCommunity().catch(console.error);
