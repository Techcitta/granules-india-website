const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5174/investors', { waitUntil: 'networkidle' });
  const section = await page.$('#sec-investor-contact');
  if (section) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await section.screenshot({
      path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/investor_contact_updated.png'
    });
    console.log('Screenshot saved successfully!');
  } else {
    console.error('Section not found!');
  }
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
