const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const toggle = document.querySelector('.cp-nav-toggle');
    const bar = document.querySelector('.cp-nav-bar');
    const nav = document.querySelector('.cp-nav');
    const wrap = document.querySelector('.cp-nav-wrap');
    return {
      toggle: toggle ? {
        display: window.getComputedStyle(toggle).display,
        visibility: window.getComputedStyle(toggle).visibility,
        rect: toggle.getBoundingClientRect()
      } : null,
      bar: bar ? {
        display: window.getComputedStyle(bar).display,
        rect: bar.getBoundingClientRect()
      } : null,
      nav: nav ? {
        width: window.getComputedStyle(nav).width,
        padding: window.getComputedStyle(nav).padding,
        rect: nav.getBoundingClientRect()
      } : null,
      wrap: wrap ? {
        rect: wrap.getBoundingClientRect()
      } : null
    };
  });

  console.log('Mobile info:', JSON.stringify(info, null, 2));
  await browser.close();
})();
