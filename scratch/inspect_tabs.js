import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('scratch/all_scraped_raw.json', 'utf8'));

// Check how tabs are defined in quarterly-results
const html = rawData['quarterly-results'];

// Look for tab lists <ul class="...nav-tabs..."> or similar
const tabUl = html.match(/<ul[^>]*class=["'][^"']*nav-tabs[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i);
if (tabUl) {
  console.log('Quarterly Results Tabs:');
  const liMatches = [...tabUl[1].matchAll(/<a[^>]*href=["']#([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  liMatches.forEach(m => console.log(`  Tab ID: ${m[1]} -> Label: ${m[2].trim()}`));
} else {
  console.log('No nav-tabs ul found in quarterly-results. Searching for all tab links:');
  const allTabs = [...html.matchAll(/data-toggle=["']tab["'][^>]*href=["']#([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  allTabs.forEach(m => console.log(`  Tab ID: ${m[1]} -> Label: ${m[2].trim()}`));
}

// Now let's do the same for investor-presentation
const presHtml = rawData['investor-presentation'];
const presTabs = [...presHtml.matchAll(/data-toggle=["']tab["'][^>]*href=["']#([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('\nInvestor Presentation Tabs:');
presTabs.forEach(m => console.log(`  Tab ID: ${m[1]} -> Label: ${m[2].trim()}`));

// Now for earnings-call-transcripts
const transHtml = rawData['earnings-call-transcripts'];
const transTabs = [...transHtml.matchAll(/data-toggle=["']tab["'][^>]*href=["']#([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('\nEarnings Call Transcripts Tabs:');
transTabs.forEach(m => console.log(`  Tab ID: ${m[1]} -> Label: ${m[2].trim()}`));

// Now for share-holding-structures
const shpHtml = rawData['share-holding-structures'];
const shpTabs = [...shpHtml.matchAll(/data-toggle=["']tab["'][^>]*href=["']#([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('\nShare Holding Structures Tabs:');
shpTabs.forEach(m => console.log(`  Tab ID: ${m[1]} -> Label: ${m[2].trim()}`));
