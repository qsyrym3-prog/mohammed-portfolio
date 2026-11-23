// Takes full-page screenshots at phone / tablet / desktop sizes using the installed Microsoft Edge.
// Usage: node scripts/screenshots.mjs [url-path ...]   (dev or preview server must be running on :4321)
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';

const BASE = process.env.BASE_URL || 'http://localhost:4321';
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const sizes = [
  { name: 'mobile', width: 375, height: 812, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];
const outDir = 'screenshots';
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.EDGE_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
});
for (const p of paths) {
  for (const s of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: 1, isMobile: s.mobile, hasTouch: s.mobile });
    await page.goto(BASE + p, { waitUntil: 'networkidle0', timeout: 120000 });
    // show every scroll-reveal element and load lazy images before capturing
    await page.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible'));
      document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
      await Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))));
      await document.fonts.ready;
    });
    await new Promise((r) => setTimeout(r, 1500));
    const slug = p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '_');
    const file = `${outDir}/${slug}-${s.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log('✓', file);
    await page.close();
  }
}
await browser.close();
