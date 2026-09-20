const https = require('https');

const urls = [
  'https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Granules_Annual-Report-FY26-1.pdf',
  'https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Granules_Annual-Report-FY26.pdf',
  'https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/FY-Result-Jun26.pdf',
  'https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Earnings-Presentation-Q1FY27vf.pdf',
  'https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Q1-FY27-Concall-Transcript-Final.pdf',
  'https://d16d47oyl512wy.cloudfront.net/pdfs/2026/07/Website-SHP-1_merged.pdf'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, statusCode: res.statusCode, contentLength: res.headers['content-length'] });
    });
    req.on('error', (e) => resolve({ url, error: e.message }));
    req.end();
  });
}

async function run() {
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(`${res.statusCode} | ${res.contentLength} bytes | ${res.url}`);
  }
}
run();
