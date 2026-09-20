const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  // Hover on "Business"
  const businessItem = await page.$('.cp-nav-item:has-text("Business")');
  if (businessItem) {
    await businessItem.hover();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/navbar_business_dropdown.png',
      clip: { x: 450, y: 0, width: 600, height: 350 }
    });
    console.log('Saved navbar_business_dropdown.png');
  }

  // Also test "About Us"
  const aboutItem = await page.$('.cp-nav-item:has-text("About Us")');
  if (aboutItem) {
    await aboutItem.hover();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/navbar_about_dropdown.png',
      clip: { x: 380, y: 0, width: 500, height: 350 }
    });
    console.log('Saved navbar_about_dropdown.png');
  }

  await browser.close();
})();
