const { chromium } = require('playwright');
const path = require('path');

async function testAllViewports() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const viewports = [
    { name: '1440x900', width: 1440, height: 900 },
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1376x789', width: 1376, height: 789 },
    { name: '1920x1080', width: 1920, height: 1080 },
    { name: '390x844', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

    // Apply styles to test
    await page.addStyleTag({
      content: `
        @media (min-width: 901px) {
          .investor {
            grid-template-columns: minmax(280px, 0.65fr) minmax(0, 1.35fr) !important;
            gap: clamp(32px, 3.5vw, 64px) !important;
            align-items: stretch !important;
          }
          .investor-copy {
            height: 100% !important;
          }
          .investor-copy .button {
            margin-top: auto !important;
          }
          .investor-doc {
            padding: 0 clamp(8px, 0.8vw, 16px) !important;
            gap: 10px !important;
          }
        }
      `
    });

    const data = await page.evaluate(() => {
      const copy = document.querySelector('.investor-copy').getBoundingClientRect();
      const cover = document.querySelector('.investor-cover').getBoundingClientRect();
      const docs = document.querySelector('.investor-docs').getBoundingClientRect();
      const tag = document.querySelector('.investor-copy .tag').getBoundingClientRect();
      const btn = document.querySelector('.investor-copy .button').getBoundingClientRect();
      return {
        copyTop: copy.top,
        copyHeight: copy.height,
        coverTop: cover.top,
        coverHeight: cover.height,
        docsTop: docs.top,
        docsHeight: docs.height,
        tagTop: tag.top,
        btnBottom: btn.bottom,
        coverBottom: cover.bottom,
      };
    });

    console.log(`=== Viewport ${vp.name} ===`);
    console.log(data);

    const section = page.locator('#investor');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await section.screenshot({ path: path.join(__dirname, `investor_${vp.name}.png`) });
    await page.close();
  }

  await browser.close();
}

testAllViewports().catch(console.error);
