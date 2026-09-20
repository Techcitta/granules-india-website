const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/sustainability', { waitUntil: 'networkidle' });

  const desc = await page.$('.sus-goals-card-desc');
  if (desc) {
    const data = await desc.evaluate(e => {
      const s = window.getComputedStyle(e);
      return { color: s.color, font: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
    });
    console.log('main desc:', data);
  }

  const sub = await page.$('.sus-goals-card-desc--sub');
  if (sub) {
    const data = await sub.evaluate(e => {
      const s = window.getComputedStyle(e);
      return { color: s.color, font: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
    });
    console.log('sub desc:', data);
  }

  const metric = await page.$('.sus-goals-metric');
  if (metric) {
    const data = await metric.evaluate(e => {
      const s = window.getComputedStyle(e);
      return { color: s.color, font: s.fontFamily, fontSize: s.fontSize, fontWeight: s.fontWeight };
    });
    console.log('metric:', data);
  }

  await browser.close();
})();
