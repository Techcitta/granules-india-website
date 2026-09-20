const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5174/sustainability', { waitUntil: 'networkidle' });

  const getCardInfo = async () => {
    return await page.evaluate(() => {
      const year = document.querySelector('.ov-goal-copy h3')?.textContent?.trim();
      const val = document.querySelector('.ov-goal-stat-val')?.textContent?.trim();
      return { year, val };
    });
  };

  console.log('T=0s:', await getCardInfo());
  await page.waitForTimeout(4000);
  console.log('T=4s:', await getCardInfo());
  await page.waitForTimeout(4000);
  console.log('T=8s:', await getCardInfo());

  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
