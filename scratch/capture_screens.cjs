const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to http://127.0.0.1:5173/ ...');
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/screenshot_home.png', fullPage: false });
  console.log('Saved scratch/screenshot_home.png');

  console.log('Navigating to http://127.0.0.1:5173/business/generics ...');
  await page.goto('http://127.0.0.1:5173/business/generics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/screenshot_generics.png', fullPage: false });
  console.log('Saved scratch/screenshot_generics.png');

  await browser.close();
}

capture().catch(console.error);
