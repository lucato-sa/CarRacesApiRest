import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    // Asegurar que reflect-metadata se carga antes de los tests
    setupFiles: ['./tests/setup.ts'],
  },
});
