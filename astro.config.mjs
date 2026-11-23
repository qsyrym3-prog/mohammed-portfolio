// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// ⚠️ After publishing, replace this with your real site address (e.g. https://mohammedqasir.com)
export const SITE_URL = 'https://mohammed-qasir.netlify.app';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  // put the (small) CSS directly in the page → no render-blocking request
  build: { inlineStylesheets: 'always' },
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      i18n: { defaultLocale: 'ar', locales: { ar: 'ar-SA', en: 'en' } },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
