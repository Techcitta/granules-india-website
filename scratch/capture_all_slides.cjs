const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5174/sustainability', { waitUntil: 'networkidle' });

  const section = await page.$('#sustainability-goals');
  if (!section) {
    console.error('Section not found!');
    process.exit(1);
  }
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const baseDir = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c';

  // Default is index 1 (Emissions 42%)
  await section.screenshot({ path: `${baseDir}/slide_emissions.png` });
  console.log('Saved slide_emissions.png');

  // Next -> Responsible Sourcing (FY27)
  const nextBtn = await page.$('.sus-goals-arrow-btn:last-child');
  await nextBtn.click();
  await page.waitForTimeout(500);
  await section.screenshot({ path: `${baseDir}/slide_responsible_sourcing.png` });
  console.log('Saved slide_responsible_sourcing.png');

  // Next -> DEI (100%)
  await nextBtn.click();
  await page.waitForTimeout(500);
  await section.screenshot({ path: `${baseDir}/slide_dei.png` });
  console.log('Saved slide_dei.png');

  // Click prev 3 times to get to Net Zero (index 0)
  const prevBtn = await page.$('.sus-goals-arrow-btn:first-child');
  await prevBtn.click(); // DEI -> Sourcing
  await page.waitForTimeout(200);
  await prevBtn.click(); // Sourcing -> Emissions
  await page.waitForTimeout(200);
  await prevBtn.click(); // Emissions -> Net Zero
  await page.waitForTimeout(500);
  await section.screenshot({ path: `${baseDir}/slide_net_zero.png` });
  console.log('Saved slide_net_zero.png');

  // Jump to Water (index 6) via 7th segment dash
  const dashes = await page.$$('.sus-goals-segment-dash');
  if (dashes[6]) {
    await dashes[6].click();
    await page.waitForTimeout(500);
    await section.screenshot({ path: `${baseDir}/slide_water.png` });
    console.log('Saved slide_water.png');
  }

  await browser.close();
  console.log('All slides captured successfully!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
