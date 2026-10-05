import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// The master dashboard needs runtime state (maintenance mode, ownership,
// contributors), so the site is served by a persistent Node server backed by
// SQLite rather than prerendered to static HTML.
export default defineConfig({
  site: 'https://sewinx.dev',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  server: {
    port: 4321,
  },
});
