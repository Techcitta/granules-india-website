const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });

  for (const width of [1600, 1024]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
    const investorSec = await page.$('#investor');
    if (investorSec) {
      await investorSec.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await investorSec.screenshot({
        path: `C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/home_investor_${width}.png`
      });
    }
    await page.close();
  }

  console.log('Responsive screenshots saved successfully!');
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
