// One-time script: copies the chosen photos from source-assets into the site,
// resized to max 2400px (keeps the Git repo small), and grabs stills from the videos.
// The originals in source-assets are only READ, never modified.
//
// Run:  npm run prepare-assets
// Needs ffmpeg on PATH for the video stills.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const SRC = process.env.SOURCE_ASSETS || 'C:/mohammed/mohammed-portfolio/source-assets';
const WORK = path.join(SRC, 'ملف الأعمال');
const INFO = path.join(SRC, 'المعلومات');
const OUT = 'src/content/projects';
const MAX = 2400;

const spiders = path.join(WORK, 'تغطية الفعاليات والحفلات', 'SPIDERS Events');
const yasreenDir = path.join(WORK, 'تغطية الفعاليات والحفلات', 'يسرين العقارية - حفل تكريم المسوقين');

// The first image in each list becomes 01.jpg = the cover.
const photoProjects = {
  '01-lino-enab': {
    dir: path.join(WORK, 'تصوير المنتجات', 'لينو عنب'),
    files: ['DSC_0927', 'DSC_1007', 'DSC_0910', 'DSC_0919', 'DSC_1001', 'DSC_1003', 'DSC_1009', 'DSC_0926', 'DSC_1006'].map((f) => `${f}_00000000.jpg`),
  },
  '04-rixos-national-day': {
    dir: path.join(spiders, 'ريكسوس اليوم الوطني'),
    files: ['نسخة من DSC_0108.JPG', 'نسخة من DSC_0028.JPG', 'نسخة من صوؤة معدلة_1.1.1.png', 'نسخة من DSC_0024.JPG'],
  },
  '05-hybrid-marathon-rixos': {
    dir: path.join(spiders, 'مارثون هايبرد ريكسوس'),
    files: ['DSC_0033', 'DSC_0089', 'DSC_0037', 'DSC_0097', 'DSC_0046', 'DSC_0007', 'DSC_0117'].map((f) => `نسخة من ${f}.JPG`),
  },
  '06-f4-aramco': {
    dir: path.join(spiders, 'F4 ARAMCO'),
    files: ['DSC_0101', 'DSC_0070', 'DSC_0096', 'DSC_0168', 'DSC_0093', 'DSC_0129'].map((f) => `نسخة من ${f}.JPG`),
  },
  '07-yasreen-ceremony': {
    dir: path.join(yasreenDir, 'PHOTO'),
    files: ['0877', '0833', '0844', '0849', '0851', '0862', '0869', '0883', '0880', '0837'].map((n) => `DSC_${n}_00000000.jpg`),
  },
};

// Stills taken from the videos (seconds). First one = cover.
const videoProjects = {
  '02-smash-burger': { file: path.join(WORK, 'المطاعم والكافيهات', 'سماش برجر', '03.mp4'), times: [20.1, 15.8, 1.4, 5.7, 10.05, 18.7] },
  '03-coffee-mood': { file: path.join(WORK, 'المطاعم والكافيهات', 'Coffee Mood', 'مود القهوة.mov'), times: [35.1, 27.6, 10.0, 12.5, 15.0, 22.6] },
};
// Poster for the Yasreen video (shown until the YouTube link is added).
const yasreenVideo = { file: path.join(yasreenDir, '02-حفل يسرين.mov'), time: 65.5 };

const pad = (n) => String(n).padStart(2, '0');
const ensure = (d) => fs.mkdirSync(d, { recursive: true });

async function savePhoto(input, output) {
  await sharp(input).rotate().resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 84, mozjpeg: true }).toFile(output);
}

function grabFrame(video, t, output) {
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(t), '-i', video, '-frames:v', '1', '-q:v', '2', output]);
}

for (const [slug, { dir, files }] of Object.entries(photoProjects)) {
  const out = path.join(OUT, slug, 'images');
  ensure(out);
  for (const [i, f] of files.entries()) await savePhoto(path.join(dir, f), path.join(out, `${pad(i + 1)}.jpg`));
  console.log(`✓ ${slug}: ${files.length} photos`);
}

const tmp = path.join('node_modules', '.cache', 'frames');
ensure(tmp);
for (const [slug, { file, times }] of Object.entries(videoProjects)) {
  const out = path.join(OUT, slug, 'images');
  ensure(out);
  for (const [i, t] of times.entries()) {
    const raw = path.join(tmp, `${slug}-${i}.png`);
    grabFrame(file, t, raw);
    await savePhoto(raw, path.join(out, `${pad(i + 1)}.jpg`));
  }
  console.log(`✓ ${slug}: ${times.length} video stills`);
}
{
  const raw = path.join(tmp, 'yasreen-video.png');
  grabFrame(yasreenVideo.file, yasreenVideo.time, raw);
  await savePhoto(raw, path.join(OUT, '07-yasreen-ceremony', 'video-poster.jpg'));
  console.log('✓ 07-yasreen-ceremony: video poster');
}

// Personal images
ensure('src/assets');
await sharp(path.join(INFO, 'غلاف الموقع - محمد قصير.jpg')).jpeg({ quality: 86, mozjpeg: true }).toFile('src/assets/hero.jpg');
await sharp(path.join(INFO, 'صورتي بدون خلفية.png')).resize({ width: 1100, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile('src/assets/portrait.png');
console.log('✓ hero + portrait');
