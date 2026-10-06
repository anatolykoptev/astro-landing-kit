/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import { getViteConfig } from 'astro/config';

// getViteConfig loads the Astro pipeline so tests can import and render .astro components.
export default getViteConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    alias: {
      '~/': fileURLToPath(new URL('./src/', import.meta.url)),
    },
  },
});
