import fs from 'fs';

const URLS = [
  { subcat: 'annual-reports', url: 'https://granulesindia.com/investors/financial-reports/annual-reports/' },
  { subcat: 'sustainability-reports', url: 'https://granulesindia.com/investors/financial-reports/sustainability-reports/' },
  { subcat: 'quarterly-results', url: 'https://granulesindia.com/investors/financial-reports/quarterly-results/' },
  { subcat: 'annual-accounts-of-subsidiaries-jvs', url: 'https://granulesindia.com/investors/financial-reports/annual-accounts-of-subsidiaries-jvs/' },
  { subcat: 'investor-presentation', url: 'https://granulesindia.com/investors/investor-resources/investor-presentation/' },
  { subcat: 'earnings-call-transcripts', url: 'https://granulesindia.com/investors/investor-resources/earnings-call-transcripts/' },
  { subcat: 'earnings-call-recording', url: 'https://granulesindia.com/investors/investor-resources/earnings-call-recording/' },
  { subcat: 'share-holding-structures', url: 'https://granulesindia.com/investors/investor-resources/share-holding-structures/' },
  { subcat: 'top-200-shareholders', url: 'https://granulesindia.com/investors/investor-resources/top-200-shareholders/' },
  { subcat: 'schedule-of-investor-meet', url: 'https://granulesindia.com/investors/notice-disclosures/schedule-of-investor-meet/' },
  { subcat: 'notice-of-board-meetings', url: 'https://granulesindia.com/investors/notice-disclosures/notice-of-board-meetings/' },
  { subcat: 'newspaper-publications', url: 'https://granulesindia.com/investors/notice-disclosures/newspaper-publications/' },
  { subcat: 'secretarial-compliance-report', url: 'https://granulesindia.com/investors/notice-disclosures/secretarial-compliance-report/' },
  { subcat: 'annual-returns', url: 'https://granulesindia.com/investors/notice-disclosures/annual-returns/' },
  { subcat: 'other-disclosures', url: 'https://granulesindia.com/investors/notice-disclosures/other-disclosures/' },
  { subcat: 'financial-highlights-revenue-break-up', url: 'https://granulesindia.com/investors/financial-highlights-revenue-break-up/' },
  { subcat: 'other-information', url: 'https://granulesindia.com/investors/other-information/' },
];

async function scrapeAll() {
  console.log('Starting scrape of investor pages...');
  const allScrapedData = {};

  for (const item of URLS) {
    console.log(`Fetching: ${item.subcat} -> ${item.url}`);
    try {
      const resp = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!resp.ok) {
        console.warn(`Failed ${item.url}: status ${resp.status}`);
        continue;
      }
      const html = await resp.text();
      allScrapedData[item.subcat] = html;
      console.log(`Saved ${item.subcat} (${html.length} chars)`);
    } catch (err) {
      console.error(`Error fetching ${item.url}:`, err.message);
    }
  }

  fs.writeFileSync('scratch/all_scraped_raw.json', JSON.stringify(allScrapedData, null, 2));
  console.log('Done scraping. Saved to scratch/all_scraped_raw.json');
}

scrapeAll();
