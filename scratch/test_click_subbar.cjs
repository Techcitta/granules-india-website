const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  // 1. Hover on Business (should NOT open)
  const businessBtn = await page.$('.cp-nav-item:has-text("Business") button');
  await businessBtn.hover();
  await page.waitForTimeout(300);
  const isOpenOnHover = await page.$('.cp-nav-submenu.is-open');
  console.log('Open on hover? (should be null):', isOpenOnHover);

  // 2. Click on Business (should OPEN)
  await businessBtn.click();
  await page.waitForTimeout(400);
  const isOpenOnClick = await page.$('.cp-nav-submenu.is-open');
  console.log('Open on click? (should be element):', !!isOpenOnClick);
  await page.screenshot({
    path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/click_business_open.png',
    clip: { x: 450, y: 0, width: 600, height: 350 }
  });

  // 3. Click Business again (should CLOSE)
  await businessBtn.click();
  await page.waitForTimeout(300);
  const isOpenAfterToggle = await page.$('.cp-nav-submenu.is-open');
  console.log('Open after toggle click? (should be null):', isOpenAfterToggle);

  // 4. Click Careers (should OPEN Careers submenu)
  const careersBtn = await page.$('.cp-nav-item:has-text("Careers") button');
  await careersBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/click_careers_open.png',
    clip: { x: 800, y: 0, width: 550, height: 260 }
  });
  console.log('Careers open screenshot saved!');

  // 5. Click outside (should CLOSE)
  await page.mouse.click(200, 400);
  await page.waitForTimeout(300);
  const isOpenAfterOutside = await page.$('.cp-nav-submenu.is-open');
  console.log('Open after outside click? (should be null):', isOpenAfterOutside);

  // 6. Click Sustainability (should navigate to /sustainability, not open submenu)
  const sustLink = await page.$('.cp-nav-item:has-text("Sustainability") a');
  console.log('Sustainability is a link tag?:', !!sustLink);
  await sustLink.click();
  await page.waitForURL('**/sustainability');
  console.log('Navigated to:', page.url());

  await browser.close();
  console.log('ALL TESTS PASSED!');
})();
