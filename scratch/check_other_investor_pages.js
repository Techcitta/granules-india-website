import fs from 'fs';

// Let's check what other investor pages exist on granulesindia.com
// Let's check the live sitemap or investor subpages
const investorSubpages = [
  'https://granulesindia.com/investors/investor-resources/policies/',
  'https://granulesindia.com/investors/investor-resources/bse-nse/',
  'https://granulesindia.com/investors/investor-resources/analyst-coverage/',
  'https://granulesindia.com/investors/investor-resources/buyback-2022/',
  'https://granulesindia.com/investors/investor-resources/buyback-2020/',
  'https://granulesindia.com/investors/investor-resources/forms/',
  'https://granulesindia.com/investors/investor-resources/unclaimed-dividend-shares-transferred-to-iepf/'
];

async function checkSubpages() {
  for (const url of investorSubpages) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const html = await res.text();
      const linkRegex = /<a[^>]*href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
      let lm;
      let count = 0;
      const sample = [];
      while ((lm = linkRegex.exec(html)) !== null) {
        count++;
        if (sample.length < 3) {
          sample.push(lm[2].replace(/<[^>]+>/g, '').trim() + ' -> ' + lm[1]);
        }
      }
      console.log(`URL [${url}]: ${res.status} OK, ${count} links. Sample:`, sample);
    } catch (e) {
      console.error(`Error fetching ${url}:`, e.message);
    }
  }
}

checkSubpages();
