import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    alias: {
      '~/': '/home/krolik/src/landing-kit/src/',
    },
  },
});
