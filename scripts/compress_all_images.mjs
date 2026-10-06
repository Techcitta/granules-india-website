import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const assetsDir = path.join(rootDir, 'public', 'assets');
const validExts = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function getAllImageFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllImageFiles(full));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (validExts.has(ext)) {
        results.push(full);
      }
    }
  }
  return results;
}

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    const inputBuf = fs.readFileSync(filePath);
    const oldSize = inputBuf.length;

    const img = sharp(inputBuf);
    const meta = await img.metadata();

    // Resize if dimensions exceed 2000px on any side (standard full HD/retina web limit)
    let pipeline = sharp(inputBuf).rotate(); // auto-orient by EXIF orientation
    if ((meta.width && meta.width > 2000) || (meta.height && meta.height > 2000)) {
      pipeline = pipeline.resize({
        width: 2000,
        height: 2000,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    let buffer;
    if (ext === '.jpg' || ext === '.jpeg') {
      buffer = await pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true }).toBuffer();
    } else if (ext === '.png') {
      buffer = await pipeline.png({ quality: 82, compressionLevel: 9, effort: 7 }).toBuffer();
    } else if (ext === '.webp') {
      buffer = await pipeline.webp({ quality: 82, effort: 5 }).toBuffer();
    }

    if (buffer && buffer.length < oldSize) {
      fs.writeFileSync(filePath, buffer);
      return {
        path: filePath,
        oldSize,
        newSize: buffer.length,
        saved: oldSize - buffer.length,
        status: 'compressed',
      };
    } else {
      return {
        path: filePath,
        oldSize,
        newSize: oldSize,
        saved: 0,
        status: 'skipped (already optimal)',
      };
    }
  } catch (err) {
    const oldSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
    return {
      path: filePath,
      oldSize,
      newSize: oldSize,
      saved: 0,
      status: `error: ${err.message}`,
    };
  }
}

async function run() {
  console.log('=====================================================');
  console.log('   GRANULES INDIA - COMPLETE IMAGE COMPRESSION       ');
  console.log('=====================================================');

  const files = getAllImageFiles(assetsDir);
  console.log(`Found ${files.length} images in public/assets/\n`);

  let totalOld = 0;
  let totalNew = 0;
  let compressedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  const startTime = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const res = await compressImage(file);
    totalOld += res.oldSize;
    totalNew += res.newSize;

    if (res.status === 'compressed') {
      compressedCount++;
      const savedPct = ((res.saved / res.oldSize) * 100).toFixed(1);
      const rel = path.relative(rootDir, file).replace(/\\/g, '/');
      if (res.oldSize > 1024 * 1024 || (i + 1) % 50 === 0) {
        console.log(`[${i + 1}/${files.length}] ${rel}: ${(res.oldSize / 1024).toFixed(0)}KB -> ${(res.newSize / 1024).toFixed(0)}KB (-${savedPct}%)`);
      }
    } else if (res.status.startsWith('error')) {
      errorCount++;
      console.warn(`[${i + 1}/${files.length}] FAILED: ${file} (${res.status})`);
    } else {
      skippedCount++;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalSaved = totalOld - totalNew;
  const pctSaved = totalOld > 0 ? ((totalSaved / totalOld) * 100).toFixed(1) : 0;

  console.log('\n=====================================================');
  console.log('                 COMPRESSION SUMMARY                 ');
  console.log('=====================================================');
  console.log(`Total Images Processed: ${files.length}`);
  console.log(`Images Compressed:      ${compressedCount}`);
  console.log(`Images Kept Unchanged:  ${skippedCount} (already optimal)`);
  if (errorCount > 0) {
    console.log(`Images Failed:          ${errorCount}`);
  }
  console.log(`Original Size:          ${(totalOld / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`New Compressed Size:    ${(totalNew / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Space Saved:      ${(totalSaved / (1024 * 1024)).toFixed(2)} MB (${pctSaved}% reduction)`);
  console.log(`Completed in:           ${duration}s`);
  console.log('=====================================================');
}

run();
