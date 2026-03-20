import { config } from 'dotenv'

/**
 * Test Setup Configuration
 * 
 * This file is executed before all tests via vitest configuration
 * It handles:
 * - Loading environment variables based on backend type
 * - Logging test configuration
 */

// Determine which backend to test against
const backendType = process.env.BACKEND || 'memory'

// Load environment variables from corresponding .env.test file
const envFile = `.env.test.${backendType}`
config({ path: envFile })

// Log test configuration
console.log('\n' + '='.repeat(50))
console.log('🧪 TEST CONFIGURATION')
console.log('='.repeat(50))
console.log(`✅ Backend: ${backendType.toUpperCase()}`)
console.log(`✅ Env file: ${envFile}`)
console.log('='.repeat(50) + '\n')

// Export backend type for use in tests
export const TEST_BACKEND = backendType
