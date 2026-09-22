const fs = require('fs');
const path = require('path');

function checkFile(f) {
  const content = fs.readFileSync(f, 'utf8');
  const importRe = /from\s+['"](\.[^'"]+)['"]/g;
  let m;
  while ((m = importRe.exec(content)) !== null) {
    const imp = m[1];
    const base = path.resolve(path.dirname(f), imp);
    const exts = ['', '.ts', '.tsx', '.js', '.jsx', '.css', '/index.ts', '/index.tsx', '/index.js'];
    const found = exts.some(e => { try { fs.statSync(base + e); return true; } catch(e2) { return false; } });
    if (!found) console.log('MISSING IMPORT:', imp, '\n  in:', f);
  }
  // Also check bare import of css
  const cssRe = /import\s+['"](\.[^'"]+\.css)['"]/g;
  while ((m = cssRe.exec(content)) !== null) {
    const imp = m[1];
    const base = path.resolve(path.dirname(f), imp);
    try { fs.statSync(base); } catch(e2) { console.log('MISSING CSS IMPORT:', imp, '\n  in:', f); }
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules','dist','.git','public'].includes(entry.name)) walk(full);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      checkFile(full);
    }
  }
}

walk('src');
console.log('Scan complete.');
