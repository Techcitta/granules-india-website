const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });

  const metrics = await page.evaluate(() => {
    const getBox = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height, y: r.y };
    };

    return {
      section: getBox('#investor'),
      copy: getBox('.investor-copy'),
      tag: getBox('.investor-copy .tag'),
      heading: getBox('.investor-copy h2'),
      button: getBox('.investor-copy .button'),
      panel: getBox('.investor-panel'),
      cover: getBox('.investor-cover'),
      side: getBox('.investor-side'),
      firstDoc: getBox('.investor-doc:first-child'),
      firstDocTitle: getBox('.investor-doc:first-child .investor-doc-title'),
      lastDoc: getBox('.investor-doc:last-child')
    };
  });

  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
