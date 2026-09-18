const fs = require('fs');

async function testVite() {
  const visited = new Set();
  const queue = ['/src/main.jsx'];
  
  while (queue.length > 0) {
    const url = queue.shift();
    if (visited.has(url)) continue;
    visited.add(url);
    
    try {
      const res = await fetch('http://127.0.0.1:5173' + url);
      if (res.status !== 200) {
        console.error('FAILED (' + res.status + '):', url);
        const text = await res.text();
        console.error(text.slice(0, 500));
        return;
      }
      const text = await res.text();
      // Extract imports from Vite's transformed ES module code
      const importRegex = /from\s+["']([^"']+)["']/g;
      let match;
      while ((match = importRegex.exec(text)) !== null) {
        let imp = match[1];
        if (imp.startsWith('/')) {
          if (!visited.has(imp) && !imp.includes('.css') && !imp.includes('.png') && !imp.includes('.svg') && !imp.includes('node_modules')) {
            queue.push(imp);
          }
        }
      }
    } catch (e) {
      console.error('FETCH ERROR on', url, e.message);
    }
  }
  console.log('Successfully crawled ' + visited.size + ' modules without server error!');
}

testVite();
