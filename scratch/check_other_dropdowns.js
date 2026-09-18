import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

function extractDropdownContainers(html, optMapping) {
  const results = [];
  for (const { label, id } of optMapping) {
    const containerRegex = new RegExp(`<div[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/div>\\s*(?=<div[^>]*id=["']|<!--|$)`, 'i');
    let match = containerRegex.exec(html);
    if (!match) {
      const altRegex = new RegExp(`id=["']${id}["'][^>]*>([\\s\\S]*?)(?=<div[^>]*id=["']|$(?![\s\S]))`, 'i');
      match = altRegex.exec(html);
    }

    if (match) {
      const containerHtml = match[1];
      const linkRegex = /<a[^>]*href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
      let lm;
      const items = [];
      while ((lm = linkRegex.exec(containerHtml)) !== null) {
        const url = lm[1].replace(/\s+/g, '');
        const text = lm[2].replace(/<[^>]+>/g, '').trim();
        items.push({ url, text });
      }
      results.push({ label, id, items });
    } else {
      results.push({ label, id, items: [], notFound: true });
    }
  }
  return results;
}

const configs = [
  {
    slug: 'investor-presentation',
    mapping: [
      { label: '2027', id: 'q9_in' },
      { label: '2026', id: 'q8_in' },
      { label: '2025', id: 'q7_in' },
      { label: '2024', id: 'q6_in' },
      { label: '2023', id: 'q5_in' },
      { label: '2022', id: 'q4_in' },
      { label: '2021', id: 'q1_in' },
      { label: '2020', id: 'q2_in' },
      { label: '2019', id: 'q3_in' }
    ]
  },
  {
    slug: 'earnings-call-transcripts',
    mapping: [
      { label: '2027', id: 'q9_c' },
      { label: '2026', id: 'q8_c' },
      { label: '2025', id: 'q7_c' },
      { label: '2024', id: 'q6_c' },
      { label: '2023', id: 'q5_c' },
      { label: '2022', id: 'q4_c' },
      { label: '2021', id: 'q1_c' },
      { label: '2020', id: 'q2_c' },
      { label: '2019', id: 'q3_c' }
    ]
  },
  {
    slug: 'share-holding-structures',
    mapping: [
      { label: '2027', id: 'q9' },
      { label: '2026', id: 'q8' },
      { label: '2025', id: 'q7' },
      { label: '2024', id: 'q6' },
      { label: '2023', id: 'q5' },
      { label: '2022', id: 'q4' },
      { label: '2021', id: 'q1' },
      { label: '2020', id: 'q2' },
      { label: '2019', id: 'q3' }
    ]
  },
  {
    slug: 'top-200-shareholders',
    mapping: [
      { label: '2027', id: 'q1_in' },
      { label: '2026', id: 'q8_in' },
      { label: '2025', id: 'q7_in' },
      { label: '2024', id: 'q6_in' }
    ]
  },
  {
    slug: 'annual-accounts-of-subsidiaries-jvs',
    mapping: [
      { label: 'FY26', id: 'aq12' },
      { label: 'FY25', id: 'aq11' },
      { label: 'FY24', id: 'aq10' },
      { label: 'FY23', id: 'aq9' },
      { label: 'FY22', id: 'aq8' },
      { label: 'FY21', id: 'aq7' },
      { label: 'FY20', id: 'aq1' },
      { label: 'FY19', id: 'aq2' },
      { label: 'FY18', id: 'aq3' },
      { label: 'FY17', id: 'aq4' },
      { label: 'FY16', id: 'aq5' },
      { label: 'FY15', id: 'aq6' }
    ]
  }
];

for (const cfg of configs) {
  console.log(`\n=================== [${cfg.slug}] ===================`);
  const res = extractDropdownContainers(rawData[cfg.slug], cfg.mapping);
  let total = 0;
  res.forEach(r => {
    total += r.items.length;
    console.log(`Year ${r.label} (${r.id}): ${r.items.length} items`);
    r.items.forEach(i => console.log(`   [${i.text}] -> ${i.url}`));
  });
  console.log(`Total extracted for ${cfg.slug}: ${total}`);
}
