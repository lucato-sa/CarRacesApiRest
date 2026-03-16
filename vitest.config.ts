import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['__tests__/**/*.test.ts'],
    
    // Load setup file before tests
    setupFiles: ['./__tests__/setup.ts'],
    
    // Environment variables for backend selection
    env: {
      BACKEND: process.env.BACKEND || 'memory'
    },
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
  },
})
