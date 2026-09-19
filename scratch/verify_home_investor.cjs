const { chromium } = require('playwright');
const path = require('path');

async function verifyInvestorSection() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const viewports = [
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1376x789', width: 1376, height: 789 },
    { name: '1920x1080', width: 1920, height: 1080 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    const section = page.locator('#investor');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const data = await page.evaluate(() => {
      const copy = document.querySelector('.investor-copy').getBoundingClientRect();
      const cover = document.querySelector('.investor-cover').getBoundingClientRect();
      const docs = document.querySelector('.investor-docs').getBoundingClientRect();
      const tag = document.querySelector('.investor-copy .tag').getBoundingClientRect();
      const btn = document.querySelector('.investor-copy .button').getBoundingClientRect();
      return {
        copyTop: copy.top,
        coverTop: cover.top,
        docsTop: docs.top,
        tagTop: tag.top,
        copyBottom: copy.bottom,
        coverBottom: cover.bottom,
        docsBottom: docs.bottom,
        btnBottom: btn.bottom,
        copyHeight: copy.height,
        coverHeight: cover.height,
        docsHeight: docs.height,
        topDiff: Math.abs(tag.top - cover.top),
        bottomDiff: Math.abs(btn.bottom - cover.bottom),
        heightDiff: Math.abs(copy.height - cover.height)
      };
    });

    console.log(`Viewport ${vp.name}:`, data);
    await section.screenshot({ path: path.join(__dirname, `final_home_investor_${vp.name}.png`) });
    await page.close();
  }

  await browser.close();
}

verifyInvestorSection().catch(console.error);
