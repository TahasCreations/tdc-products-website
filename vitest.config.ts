import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
        '**/dist/**',
        '**/.next/**'
      ]
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/components': resolve(__dirname, './src/components'),
      '@/app': resolve(__dirname, './src/app'),
      '@/plugins': resolve(__dirname, './src/plugins')
    }
  }
});
