import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://sewinx.dev',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  server: {
    port: 4321,
  },
});
