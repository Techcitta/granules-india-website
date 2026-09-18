const { chromium } = require('playwright');

async function captureBottom() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('http://127.0.0.1:5173/business/generics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);

  const banner = page.locator('.biz-cta');
  if (await banner.count() > 0) {
    await banner.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await banner.screenshot({ path: 'scratch/banner_generics.png' });
    console.log('Saved scratch/banner_generics.png');
  } else {
    console.log('No .biz-cta found');
  }

  await browser.close();
}

captureBottom().catch(console.error);
