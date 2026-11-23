// Generates the link-preview image (public/og.jpg, 1200×630) and the PNG favicons
// by rendering small HTML pages in Microsoft Edge (so Arabic text is shaped correctly).
// Run: node scripts/make-brand-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const font = (pkg, file) => 'data:font/woff2;base64,' + fs.readFileSync(path.join('node_modules/@fontsource', pkg, 'files', file)).toString('base64');
const plex = font('ibm-plex-sans-arabic', 'ibm-plex-sans-arabic-arabic-700-normal.woff2');
const corm = font('cormorant-garamond', 'cormorant-garamond-latin-600-normal.woff2');
const inter = font('inter', 'inter-latin-500-normal.woff2');
const hero = 'data:image/jpeg;base64,' + (await sharp('src/assets/hero.jpg').resize({ width: 1600 }).jpeg({ quality: 88 }).toBuffer()).toString('base64');

const fonts = `
@font-face{font-family:Plex;src:url(${plex})}
@font-face{font-family:Corm;src:url(${corm})}
@font-face{font-family:Inter;src:url(${inter})}
*{margin:0;box-sizing:border-box}`;

const og = `<!doctype html><html><head><style>${fonts}
body{width:1200px;height:630px;overflow:hidden;background:#F3EDE3 url(${hero}) left 30%/cover no-repeat;position:relative}
.t{position:absolute;right:70px;top:0;bottom:0;width:560px;display:flex;flex-direction:column;justify-content:center;text-align:right}
.e{font:500 15px Inter;letter-spacing:.24em;color:#9A4529}
h1{font:700 88px/1.05 Plex;color:#1F1A16;margin-top:18px}
.en{font:600 40px Corm;letter-spacing:.16em;color:#6B6159;margin-top:6px}
.l{height:2px;width:90px;background:#B5573A;margin:26px 0 22px auto}
.s{font:700 26px Plex;color:#1F1A16;opacity:.8}
</style></head><body><div class="t">
<div class="e">PHOTOGRAPHER &amp; CONTENT CREATOR</div><h1>محمد قصير</h1><div class="en">MOHAMMED QASIR</div><div class="l"></div>
<div class="s" dir="rtl">مصور فوتوغرافي وصانع محتوى — جدة</div></div></body></html>`;

const icon = (size) => `<!doctype html><html><head><style>${fonts}
body{width:${size}px;height:${size}px;background:#F3EDE3;display:grid;place-items:center;position:relative;overflow:hidden}
.a{position:absolute;left:${size * 0.2}px;right:${size * 0.2}px;top:${size * 0.12}px;bottom:-2px;border:${Math.max(1.5, size / 40)}px solid #B5573A;border-bottom:0;border-radius:999px 999px 0 0}
span{position:relative;font:600 ${size * 0.42}px Corm;color:#B5573A;letter-spacing:-.03em;margin-top:${size * 0.1}px}
</style></head><body><div class="a"></div><span>MQ</span></body></html>`;

const browser = await puppeteer.launch({ executablePath: process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
const shot = async (html, w, h, out) => {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ type: 'png' });
  await page.close();
  if (out.endsWith('.jpg')) await sharp(buf).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
  else await sharp(buf).png().toFile(out);
  console.log('✓', out);
};
await shot(og, 1200, 630, 'public/og.jpg');
await shot(icon(180), 180, 180, 'public/apple-touch-icon.png');
await shot(icon(192), 192, 192, 'public/icon-192.png');
await shot(icon(512), 512, 512, 'public/icon-512.png');
await shot(icon(64), 64, 64, 'node_modules/.cache/fav64.png');
await sharp('node_modules/.cache/fav64.png').resize(32, 32).png().toFile('public/favicon-32.png');
console.log('✓ public/favicon-32.png');
await browser.close();
