const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });

  // 1. Desktop Homepage Top (width: 1440, height: 900)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/navbar_desktop_top.png',
    clip: { x: 0, y: 0, width: 1440, height: 260 }
  });
  console.log('1. Saved navbar_desktop_top.png');

  // 2. Desktop Homepage Scrolled (window.scrollY = 800)
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/navbar_desktop_scrolled.png',
    clip: { x: 0, y: 0, width: 1440, height: 260 }
  });
  console.log('2. Saved navbar_desktop_scrolled.png');

  // 3. Investors page
  await page.goto('http://localhost:5174/investors', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/navbar_investors_top.png',
    clip: { x: 0, y: 0, width: 1440, height: 260 }
  });
  console.log('3. Saved navbar_investors_top.png');

  // 4. Mobile Homepage Top (width: 390, height: 844)
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({
    path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/navbar_mobile_top.png',
    clip: { x: 0, y: 0, width: 390, height: 200 }
  });
  console.log('4. Saved navbar_mobile_top.png');

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
