import { mergeConfig, defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        all: true,
        include: ['src/**/*.{ts,vue}'],
        exclude: ['src/main.ts', 'src/vite-env.d.ts'],
        thresholds: {
          lines: 80,
          functions: 75,
          statements: 80,
          branches: 70,
        },
      },
    },
  }),
);
