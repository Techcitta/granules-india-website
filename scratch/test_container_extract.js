import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

// Let's write helper functions to extract containers by id or class
function extractDropdownContainers(html, optMapping) {
  // optMapping is array of { label, id } e.g. { label: '2027', id: 'q9_in' }
  const results = [];
  for (const { label, id } of optMapping) {
    // Find container with id="${id}" or class="${id}" or similar
    // In WordPress themes, it's often <div id="q9_in" ...> ... </div> or similar
    const containerRegex = new RegExp(`<div[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/div>\\s*(?=<div[^>]*id=["']|<!--|$)`, 'i');
    let match = containerRegex.exec(html);
    
    // If not found with exact closing, try capturing until next sibling container
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

// Test on quarterly-results
const qrMap = [
  { label: 'FY27', id: 'q14' },
  { label: 'FY26', id: 'q13' },
  { label: 'FY25', id: 'q12' },
  { label: 'FY24', id: 'q11' },
  { label: 'FY23', id: 'q10' },
  { label: 'FY22', id: 'q9' },
  { label: 'FY21', id: 'q1' },
  { label: 'FY20', id: 'q2' },
  { label: 'FY19', id: 'q3' },
  { label: 'FY18', id: 'q4' },
  { label: 'FY17', id: 'q5' },
  { label: 'FY16', id: 'q6' },
  { label: 'FY15', id: 'q7' },
  { label: 'FY14', id: 'q8' }
];

console.log('--- QUARTERLY RESULTS ---');
const qrRes = extractDropdownContainers(rawData['quarterly-results'], qrMap);
qrRes.forEach(r => {
  console.log(`${r.label} (${r.id}): ${r.items.length} items`);
  r.items.forEach(i => console.log(`   [${i.text}] -> ${i.url}`));
});

// Test on earnings-call-recording
const ecrMap = [
  { label: '2027', id: 'q6_c' },
  { label: '2026', id: 'q5_c' },
  { label: '2025', id: 'q4_c' },
  { label: '2024', id: 'q3_c' },
  { label: '2023', id: 'q2_c' },
  { label: '2022', id: 'q1_c' }
];

console.log('\n--- EARNINGS CALL RECORDINGS ---');
const ecrRes = extractDropdownContainers(rawData['earnings-call-recording'], ecrMap);
ecrRes.forEach(r => {
  console.log(`${r.label} (${r.id}): ${r.items.length} items`);
  r.items.forEach(i => console.log(`   [${i.text}] -> ${i.url}`));
});
