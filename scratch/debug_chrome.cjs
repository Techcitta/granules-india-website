const { chromium } = require('playwright');

async function debugChrome() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => {
    console.log('[CONSOLE ' + msg.type() + ']', msg.text());
  });
  
  page.on('pageerror', err => {
    console.error('[PAGE ERROR]', err);
  });

  page.on('requestfailed', req => {
    console.error('[REQUEST FAILED]', req.url(), req.failure()?.errorText);
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML);
  console.log('Root innerHTML length:', rootHtml?.length);
  console.log('Root HTML snippet:', rootHtml?.slice(0, 500));

  const bodyStyles = await page.evaluate(() => {
    const root = document.getElementById('root');
    const main = document.querySelector('main');
    return {
      bodyBg: window.getComputedStyle(document.body).backgroundColor,
      rootDisplay: root ? window.getComputedStyle(root).display : null,
      mainDisplay: main ? window.getComputedStyle(main).display : null,
      mainOpacity: main ? window.getComputedStyle(main).opacity : null,
      mainVisibility: main ? window.getComputedStyle(main).visibility : null,
      sectionsCount: document.querySelectorAll('section').length
    };
  });
  console.log('Computed styles:', bodyStyles);

  await browser.close();
}

debugChrome().catch(console.error);
