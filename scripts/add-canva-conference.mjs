// Copies the chosen Canva conference photos into the site, resized to max 2400px.
// The originals in source-assets are only READ, never modified.
// Run: node scripts/add-canva-conference.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SRC = process.env.SOURCE_ASSETS || 'C:/mohammed/mohammed-portfolio/source-assets';
const dir = path.join(SRC, 'ملف الأعمال', 'تغطية الفعاليات والحفلات', 'مؤتمر كانفا', 'اليوم الاول');
const out = 'src/content/projects/08-canva-conference/images';
// first = cover
const files = ['1473', '1563', '1556', '1663', '1307', '1481', '1478', '1435', '1455', '1575'].map((n) => `DSC_${n}.jpg`);

fs.mkdirSync(out, { recursive: true });
for (const [i, f] of files.entries()) {
  await sharp(path.join(dir, f)).rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(out, `${String(i + 1).padStart(2, '0')}.jpg`));
}
console.log(`✓ 08-canva-conference: ${files.length} photos`);
