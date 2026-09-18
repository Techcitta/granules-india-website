import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

function extractContainer(html, divId) {
  const regex = new RegExp(`id=["']${divId}["'][^>]*>([\\s\\S]*?)(?:<!--.*?Start|id=["'](?:q|aq|tab)[^>]*>|<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/section>)`, 'i');
  const m = regex.exec(html);
  if (!m) return null;
  const chunk = m[1];
  const links = [];
  const linkRegex = /href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  while ((lm = linkRegex.exec(chunk)) !== null) {
    links.push({
      url: lm[1].replace(/\s+/g, ''),
      text: lm[2].replace(/<[^>]+>/g, '').trim()
    });
  }
  return links;
}

console.log('=== FY27 CONTAINER ITEMS ===\n');

console.log('1. Quarterly Results (q14):', extractContainer(rawData['quarterly-results'], 'q14'));
console.log('2. Investor Presentation (q9_in):', extractContainer(rawData['investor-presentation'], 'q9_in'));
console.log('3. Earnings Call Transcripts (q9_c):', extractContainer(rawData['earnings-call-transcripts'], 'q9_c'));
console.log('4. Earnings Call Recording (q6_c):', extractContainer(rawData['earnings-call-recording'], 'q6_c'));
console.log('5. Share Holding Structures (q9):', extractContainer(rawData['share-holding-structures'], 'q9'));
console.log('6. Top 200 Shareholders (q1_in):', extractContainer(rawData['top-200-shareholders'], 'q1_in'));
