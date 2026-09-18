const { chromium } = require('playwright');

async function inspectElements() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const viewports = [
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1376x789', width: 1376, height: 789 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    // 1. Community Speech Banner
    await page.goto('http://localhost:5173/community', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const commSpeech = page.locator('.comm-speech-section');
    if (await commSpeech.count() > 0) {
      await commSpeech.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `scratch/comm_speech_${vp.name}.png` });

      // Measure bounding boxes of quote card and image
      const cardBox = await page.locator('.comm-root .ov-quote-card').boundingBox();
      const speechBox = await commSpeech.boundingBox();
      console.log(`[${vp.name}] Community speech box:`, speechBox, 'card box:', cardBox);
    }

    // 2. Investor Jump Nav
    await page.goto('http://localhost:5173/investor', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const invJump = page.locator('.inv-jump-nav-wrap');
    if (await invJump.count() > 0) {
      await invJump.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `scratch/inv_jump_${vp.name}.png` });
      
      const jumpCards = await page.locator('.inv-jump-card').all();
      console.log(`[${vp.name}] Investor jump cards count: ${jumpCards.length}`);
      for (let i = 0; i < jumpCards.length; i++) {
        const box = await jumpCards[i].boundingBox();
        const text = (await jumpCards[i].innerText()).replace(/\n/g, ' ');
        console.log(`   Card ${i + 1} (${text}): x=${box.x.toFixed(1)}, width=${box.width.toFixed(1)}, y=${box.y.toFixed(1)}`);
      }
    }

    // 3. Sustainability Leadership Banner
    await page.goto('http://localhost:5173/sustainability', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const susLead = page.locator('.sus-lead-hero-wrap, .ov-leadership').first();
    if (await susLead.count() > 0) {
      await susLead.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await page.screenshot({ path: `scratch/sus_lead_${vp.name}.png` });
    }

    await context.close();
  }

  await browser.close();
}

inspectElements().catch(console.error);
