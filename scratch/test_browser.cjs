const { chromium } = require('playwright');

(async () => {
  let browser;
  try {
    // Try launching installed Edge or Chrome first if playwright binaries aren't installed
    try {
      browser = await chromium.launch({ channel: 'msedge', headless: true });
    } catch (e1) {
      try {
        browser = await chromium.launch({ channel: 'chrome', headless: true });
      } catch (e2) {
        browser = await chromium.launch({ headless: true });
      }
    }

    const page = await browser.newPage();
    const consoleLogs = [];
    const errors = [];

    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });
    page.on('pageerror', err => {
      errors.push(err.toString());
    });

    console.log('Navigating to http://127.0.0.1:5173 ...');
    const response = await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle', timeout: 15000 });
    console.log('Response status:', response ? response.status() : 'no response');

    await page.waitForTimeout(2000);

    const rootHtml = await page.evaluate(() => {
      const root = document.getElementById('root');
      return {
        rootExists: !!root,
        rootInnerHTMLTotalLength: root ? root.innerHTML.length : 0,
        rootChildren: root ? Array.from(root.children).map(c => ({ tag: c.tagName, class: c.className, text: c.innerText.slice(0, 100), height: c.offsetHeight, width: c.offsetWidth })) : [],
        currentUrl: window.location.href,
        title: document.title,
      };
    });

    console.log('Root HTML info:', JSON.stringify(rootHtml, null, 2));
    await page.screenshot({ path: 'scratch/screenshot.png' });
    console.log('Screenshot saved to scratch/screenshot.png');
    console.log('Console logs:', JSON.stringify(consoleLogs, null, 2));
    console.log('Errors:', JSON.stringify(errors, null, 2));

    await browser.close();
  } catch (err) {
    console.error('Script failed:', err);
    if (browser) await browser.close();
  }
})();
