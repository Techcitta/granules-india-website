const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto('http://localhost:5174/sustainability', { waitUntil: 'networkidle' });

  // Locate the Ratings & Certifications section by heading
  const headings = await page.$$('h3, h2, h4');
  let ratingsSection = null;
  for (const h of headings) {
    const text = await h.textContent();
    if (text && text.includes('Ratings & Certifications')) {
      ratingsSection = await h.evaluateHandle(el => el.closest('section') || el.parentElement);
      break;
    }
  }

  if (ratingsSection) {
    await ratingsSection.asElement().scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await ratingsSection.asElement().screenshot({
      path: 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/a873e441-b7ff-4064-b6c5-8caa173f5b9c/sustainability_ratings_updated.png'
    });
    console.log('Screenshot saved successfully!');
  } else {
    console.error('Ratings & Certifications section not found!');
  }
  await browser.close();
})().catch(err => {
  console.error(err);
  process.exit(1);
});
