import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDir = import.meta.dirname;

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        catalog: resolve(rootDir, 'catalog.html'),
        artwork: resolve(rootDir, 'artwork.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
});
