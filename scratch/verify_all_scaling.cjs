const { chromium } = require('playwright');

async function runComprehensiveVerification() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const viewports = [
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1376x789', width: 1376, height: 789 },
    { name: '1920x1080', width: 1920, height: 1080 },
  ];

  const routes = [
    { url: '/company', name: 'company' },
    { url: '/company/leadership', name: 'leadership' },
    { url: '/investor', name: 'investor' },
    { url: '/community', name: 'community' },
    { url: '/sustainability', name: 'sustainability' },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const r of routes) {
      await page.goto(`http://localhost:5173${r.url}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }));

      console.log(`[${vp.name}] ${r.name}: scrollWidth=${metrics.scrollWidth}, clientWidth=${metrics.clientWidth}, hasOverflow=${metrics.hasOverflow}`);

      // Capture top hero & navbar
      await page.screenshot({ path: `scratch/final_${r.name}_${vp.name}_top.png` });

      // If page has a leadership quote card, scroll to it and capture
      const quoteCard = page.locator('.comm-root .ov-quote-card, .ov-quote-card, .cp-quote-card').first();
      if (await quoteCard.count() > 0) {
        await quoteCard.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await page.screenshot({ path: `scratch/final_${r.name}_${vp.name}_quote.png` });
      }

      // If page is investor, capture jump nav
      if (r.name === 'investor') {
        const jumpWrap = page.locator('.inv-jump-nav-wrap');
        if (await jumpWrap.count() > 0) {
          await jumpWrap.scrollIntoViewIfNeeded();
          await page.waitForTimeout(200);
          await page.screenshot({ path: `scratch/final_investor_${vp.name}_jump.png` });

          const cards = await page.locator('.inv-jump-card').all();
          const cardBounds = [];
          for (let i = 0; i < cards.length; i++) {
            const b = await cards[i].boundingBox();
            cardBounds.push({ index: i + 1, x: b.x, width: b.width, right: b.x + b.width });
          }
          const maxRight = Math.max(...cardBounds.map(c => c.right));
          console.log(`   Investor jump cards (count ${cards.length}) max right edge: ${maxRight.toFixed(1)}px (viewport width: ${vp.width}px)`);
        }
      }
    }
    await context.close();
  }

  await browser.close();
  console.log('ALL VERIFICATION FINISHED SUCCESSFULLY!');
}

runComprehensiveVerification().catch(console.error);
