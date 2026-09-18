const { chromium } = require('playwright');
const path = require('path');

async function testEhs() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.message);
  });

  console.log('1. Navigating to homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Hover on Sustainability nav item
  console.log('2. Testing Sustainability nav hover...');
  const susNavItem = page.locator('.cp-nav-item').filter({ has: page.locator('.cp-nav-link', { hasText: 'Sustainability' }) });
  await susNavItem.hover();
  await page.waitForTimeout(600);

  // Check submenu links
  const submenuLinks = await page.locator('.cp-nav-submenu.is-open a').allInnerTexts();
  console.log('Submenu links found:', submenuLinks);

  // Capture screenshot of dropdown
  await page.screenshot({ path: path.join(__dirname, 'nav_dropdown_sustainability.png') });

  // Navigate to /sustainability/ehs-submissions
  console.log('3. Navigating to /sustainability/ehs-submissions...');
  await page.goto('http://localhost:5173/sustainability/ehs-submissions', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const title = await page.title();
  console.log('Page Title:', title);

  const docCount = await page.locator('.ehs-table tbody tr').count();
  console.log('Document rows displayed:', docCount);

  // Take screenshot of desktop view
  await page.screenshot({ path: path.join(__dirname, 'ehs_page_desktop.png'), fullPage: false });
  await page.screenshot({ path: path.join(__dirname, 'ehs_fullpage.png'), fullPage: true });

  // Test facility pill filter: click 'Gagillapur'
  console.log('4. Testing facility filter: Gagillapur...');
  const gagillapurBtn = page.locator('.ehs-pill-btn', { hasText: 'Gagillapur' });
  await gagillapurBtn.click();
  await page.waitForTimeout(300);
  const gagillapurCount = await page.locator('.ehs-table tbody tr').count();
  console.log('Gagillapur docs count:', gagillapurCount);

  // Test search: 'Biomedical'
  console.log('5. Testing search filter: Biomedical...');
  await page.locator('.ehs-pill-btn', { hasText: 'ALL' }).first().click();
  const searchInput = page.locator('.ehs-search-box input');
  await searchInput.fill('Biomedical');
  await page.waitForTimeout(300);
  const bioCount = await page.locator('.ehs-table tbody tr').count();
  console.log('Biomedical search count:', bioCount);

  // Test 1280x800 (150% laptop zoom)
  console.log('6. Testing laptop 1280x800 viewport...');
  await page.setViewportSize({ width: 1280, height: 800 });
  await searchInput.fill('');
  await page.waitForTimeout(300);
  const hasHScroll1280 = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log('1280x800 horizontal overflow:', hasHScroll1280);
  await page.screenshot({ path: path.join(__dirname, 'ehs_page_1280.png'), fullPage: false });

  // Test 1376x789
  console.log('7. Testing 1376x789 viewport...');
  await page.setViewportSize({ width: 1376, height: 789 });
  await page.waitForTimeout(300);
  const hasHScroll1376 = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  console.log('1376x789 horizontal overflow:', hasHScroll1376);

  console.log('Errors caught during run:', errors);
  await browser.close();
}

testEhs().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
