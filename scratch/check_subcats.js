import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

['quarterly-results', 'earnings-call-transcripts', 'earnings-call-recording', 'share-holding-structures'].forEach(subcat => {
  const html = rawData[subcat];
  if (!html) return;
  const linkRegex = /href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  const links = [];
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    links.push({ url: m[1].replace(/\s+/g, ''), text: m[2].replace(/<[^>]+>/g, '').trim() });
  }
  console.log(`\n=== ${subcat} (${links.length} links) ===`);
  links.slice(0, 8).forEach(l => console.log('  *', l.text, '->', l.url));
});
