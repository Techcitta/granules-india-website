const { chromium } = require('playwright');

async function checkCompanyAndLeadership() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  // 1. Company page leadership
  await page.goto('http://localhost:5173/company', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const cpLead = page.locator('.cp-leadership-wrapper, .ov-leadership').first();
  if (await cpLead.count() > 0) {
    await cpLead.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'scratch/company_lead_1280x800.png' });
  }

  // 2. Leadership page
  await page.goto('http://localhost:5173/company/leadership', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'scratch/leadership_page_1280x800.png' });

  await browser.close();
}

checkCompanyAndLeadership().catch(console.error);
