// Usage: node shot2.cjs <url> <outfile> [width] [height] [selector]
const { chromium } = require('playwright');

(async () => {
  const [,, url, outfile, widthArg, heightArg, selector] = process.argv;
  const width = parseInt(widthArg || '1920', 10);
  const height = parseInt(heightArg || '1080', 10);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  // force all reveal animations to their revealed state for accurate screenshots
  await page.addStyleTag({ content: '.reveal-ready { opacity: 1 !important; transform: none !important; }' });
  await page.waitForTimeout(300);
  if (selector) {
    const el = await page.$(selector);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await el.screenshot({ path: outfile });
    } else {
      console.error('Selector not found:', selector);
      await page.screenshot({ path: outfile });
    }
  } else {
    await page.screenshot({ path: outfile, fullPage: true });
  }
  await browser.close();
})();
