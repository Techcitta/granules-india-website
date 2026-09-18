async function checkEHS() {
  const res = await fetch('https://granulesindia.com/investors/ehs-documents/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const linkRegex = /<a[^>]*href=["']([^"']+\.(?:pdf|mp3|zip|xlsx?))["'][^>]*>([\s\S]*?)<\/a>/gi;
  let lm;
  const docs = [];
  while ((lm = linkRegex.exec(html)) !== null) {
    docs.push({ text: lm[2].replace(/<[^>]+>/g, '').trim(), link: lm[1].replace(/\s+/g, '') });
  }
  console.log(`EHS Documents: ${docs.length} found:`, docs);
}

checkEHS();
