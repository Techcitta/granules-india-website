import { chromium } from 'playwright';

async function testInvestorsUI() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173/investors ...');
  await page.goto('http://localhost:5173/investors', { waitUntil: 'networkidle' });

  // 1. Check Financial Highlights
  console.log('Page title:', await page.title());
  await page.screenshot({ path: 'scratch/investors_top.png', fullPage: false });

  // 2. Locate the first Year dropdown trigger (Financial Reports)
  const yearDropdownTriggers = page.locator('.inv-custom-dropdown--year .inv-custom-dropdown-trigger');
  const count = await yearDropdownTriggers.count();
  console.log(`Found ${count} year dropdown triggers.`);

  if (count > 0) {
    // Click the first year dropdown trigger
    console.log('Clicking first Year dropdown trigger...');
    await yearDropdownTriggers.nth(0).click();
    await page.waitForTimeout(500);

    // Take screenshot of open dropdown menu
    await page.screenshot({ path: 'scratch/dropdown_open.png', fullPage: false });

    // Look for option '2027'
    const opt2027 = page.locator('.inv-custom-dropdown-item:has-text("2027")');
    const optCount = await opt2027.count();
    console.log(`Found ${optCount} option(s) for "2027"`);

    if (optCount > 0) {
      console.log('Selecting 2027...');
      await opt2027.first().click();
      await page.waitForTimeout(600);

      // Verify what documents appear
      await page.screenshot({ path: 'scratch/financial_reports_2027.png', fullPage: false });
      
      const docTitles = await page.locator('.inv-table-title').allTextContents();
      console.log('Documents visible in Financial Reports with 2027 selected:', docTitles);
    }
  }

  // 3. Test Investor Resources section with 2027
  if (count > 1) {
    console.log('Testing Investor Resources Year filter (2027)...');
    await yearDropdownTriggers.nth(1).scrollIntoViewIfNeeded();
    await yearDropdownTriggers.nth(1).click();
    await page.waitForTimeout(500);

    const opt2027Res = page.locator('.inv-custom-dropdown-item:has-text("2027")');
    if (await opt2027Res.count() > 0) {
      await opt2027Res.first().click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: 'scratch/investor_resources_2027.png', fullPage: false });
      const docTitles = await page.locator('.inv-table-title').allTextContents();
      console.log('Documents visible in Investor Resources with 2027 selected:', docTitles.slice(0, 10));
    }
  }

  await browser.close();
  console.log('Done test!');
}

testInvestorsUI().catch(err => {
  console.error('Error in test:', err);
  process.exit(1);
});
