const url = 'https://granulesindia.com/investors/investor-resources/policies/';

async function checkPolicies() {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
  const html = await res.text();
  const linkRegex = /<a[^>]*href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  const policies = [];
  while ((lm = linkRegex.exec(html)) !== null) {
    const link = lm[1].replace(/\s+/g, '');
    const text = lm[2].replace(/<[^>]+>/g, '').trim();
    policies.push({ text, link });
  }
  console.log(`Found ${policies.length} policies:`);
  policies.forEach((p, idx) => console.log(`  ${idx + 1}. [${p.text}] -> ${p.link}`));
}

checkPolicies();
