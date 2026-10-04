// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Ganti ke domain asli sebelum deploy.
export default defineConfig({
  site: 'https://www.warkoprahayoe.com',
  integrations: [sitemap()],
});
