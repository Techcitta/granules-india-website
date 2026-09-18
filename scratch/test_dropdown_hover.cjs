const { chromium } = require('playwright');

async function checkDropdown() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Hover over the Careers nav item
  const careersLink = page.locator('.cp-nav-item:has-text("Careers")');
  console.log('Hovering over Careers nav item...');
  await careersLink.hover();
  await page.waitForTimeout(600);

  // Capture screenshot of the navbar with dropdown
  await page.screenshot({ path: 'scratch/careers_dropdown.png' });
  console.log('Saved scratch/careers_dropdown.png');

  // Verify submenu links text
  const submenuLinks = await page.locator('.cp-nav-item:has-text("Careers") .cp-nav-submenu a').allInnerTexts();
  console.log('Careers submenu links:', submenuLinks);

  await browser.close();
}

checkDropdown().catch(console.error);
