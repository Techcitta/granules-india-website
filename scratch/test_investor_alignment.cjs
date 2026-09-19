const { chromium } = require('playwright');
const path = require('path');

async function test() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Apply CSS change
  await page.addStyleTag({
    content: `
      .investor {
        align-items: stretch !important;
      }
      .investor-copy {
        height: 100% !important;
      }
      .investor-copy .button {
        margin-top: auto !important;
      }
    `
  });

  const data = await page.evaluate(() => {
    const copy = document.querySelector('.investor-copy').getBoundingClientRect();
    const cover = document.querySelector('.investor-cover').getBoundingClientRect();
    const docs = document.querySelector('.investor-docs').getBoundingClientRect();
    const tag = document.querySelector('.investor-copy .tag').getBoundingClientRect();
    const btn = document.querySelector('.investor-copy .button').getBoundingClientRect();
    const firstDoc = document.querySelector('.investor-doc').getBoundingClientRect();
    const lastDoc = document.querySelectorAll('.investor-doc')[5].getBoundingClientRect();
    return { copy, cover, docs, tag, btn, firstDoc, lastDoc };
  });

  console.log('Measurements:');
  console.log(JSON.stringify(data, null, 2));

  const section = page.locator('#investor');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await section.screenshot({ path: path.join(__dirname, 'investor_stretched.png') });
  await browser.close();
}

test().catch(console.error);
