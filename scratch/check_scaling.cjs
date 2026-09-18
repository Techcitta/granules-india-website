const { chromium } = require('playwright');
const fs = require('fs');

async function testPages() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const viewports = [
    { name: '1280x800_150zoom', width: 1280, height: 800 },
    { name: '1376x789_100zoom', width: 1376, height: 789 },
  ];

  const urls = [
    { path: '/company', name: 'company' },
    { path: '/investor', name: 'investor' },
    { path: '/community', name: 'community' },
    { path: '/sustainability', name: 'sustainability' },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const u of urls) {
      await page.goto(`http://localhost:5173${u.path}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      console.log(`[${vp.name}] ${u.name}: scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth}, hasOverflow=${metrics.hasHorizontalScroll}`);

      await page.screenshot({ path: `scratch/${u.name}_${vp.name}.png`, fullPage: false });
    }
    await context.close();
  }

  await browser.close();
}

testPages().catch(console.error);
