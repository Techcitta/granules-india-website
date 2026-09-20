const { chromium } = require('playwright');

async function testGoalsCarousel() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:5173/sustainability ...');
  await page.goto('http://127.0.0.1:5173/sustainability', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const section = page.locator('#sustainability-goals');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // Capture desktop default view (By 2030, left 2050, right 2032)
  await section.screenshot({ path: 'scratch/new_goals_desktop_default.png' });
  console.log('Captured default desktop view (By 2030).');

  // Click next button to view 2032
  const nextBtn = page.locator('.ov-goals-nav-btn').nth(1);
  await nextBtn.click();
  await page.waitForTimeout(800);
  await section.screenshot({ path: 'scratch/new_goals_desktop_2032.png' });
  console.log('Captured 2032 view.');

  // Click next button to view FY27
  await nextBtn.click();
  await page.waitForTimeout(800);
  await section.screenshot({ path: 'scratch/new_goals_desktop_fy27.png' });
  console.log('Captured FY27 view.');

  // Click next button to view 2050
  await nextBtn.click();
  await page.waitForTimeout(800);
  await section.screenshot({ path: 'scratch/new_goals_desktop_2050.png' });
  console.log('Captured 2050 view.');

  // Return to 2030 and click 3rd segment (Energy 100%)
  await nextBtn.click();
  await page.waitForTimeout(800);
  const seg2 = page.locator('.ov-goal-seg').nth(2);
  await seg2.click();
  await page.waitForTimeout(800);
  await section.screenshot({ path: 'scratch/new_goals_desktop_energy.png' });
  console.log('Captured Energy metric.');

  // Test mobile view
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await section.screenshot({ path: 'scratch/new_goals_mobile.png' });
  console.log('Captured mobile view.');

  await browser.close();
  console.log('Done!');
}

testGoalsCarousel().catch(console.error);
