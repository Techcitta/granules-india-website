const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  // Click toggle
  await page.click('.cp-nav-toggle');
  await page.waitForTimeout(500);

  await page.screenshot({
    path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/navbar_mobile_open.png'
  });
  console.log('Mobile drawer open screenshot saved!');
  await browser.close();
})();
