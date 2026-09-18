import fs from 'fs';
const raw = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));
const slugs = [
  'annual-reports',
  'quarterly-results',
  'annual-accounts-of-subsidiaries-jvs',
  'investor-presentation',
  'earnings-call-transcripts',
  'earnings-call-recording',
  'share-holding-structures',
  'top-200-shareholders'
];

for (const slug of slugs) {
  const html = raw[slug];
  const selectRegex = /<select[^>]*>([\s\S]*?)<\/select>/gi;
  let sm = selectRegex.exec(html);
  if (sm) {
    const optRegex = /<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi;
    let om;
    const opts = [];
    while ((om = optRegex.exec(sm[1])) !== null) {
      opts.push(`${om[2].trim()} -> ${om[1]}`);
    }
    console.log(`${slug}:\n  ${opts.join(' | ')}`);
  } else {
    console.log(`${slug}: No dropdown`);
  }
}
