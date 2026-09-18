async function checkAllInvestorNav() {
  const res = await fetch('https://granulesindia.com/investors/', { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const linkRegex = /href=["'](https?:\/\/granulesindia\.com\/investors\/[^"']*)["']/gi;
  let m;
  const links = new Set();
  while ((m = linkRegex.exec(html)) !== null) {
    links.add(m[1].replace(/#.*$/, ''));
  }
  console.log('All investor sub-URLs on granulesindia.com/investors/:');
  Array.from(links).sort().forEach(l => console.log('  ', l));
}

checkAllInvestorNav();
