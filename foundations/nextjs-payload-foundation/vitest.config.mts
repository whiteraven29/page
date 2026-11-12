import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Integration tests run against the Payload Local API and a throwaway database.
// Default: a fresh SQLite file. Set TEST_DATABASE_URL=postgres://... to match production (CI does).
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['tests/int/**/*.int.spec.ts', 'src/**/*.test.ts'],
    globalSetup: ['./tests/global-setup.ts'],
    setupFiles: ['./tests/setup.ts'],
    fileParallelism: false, // one shared test database
    testTimeout: 60_000,
    hookTimeout: 120_000,
  },
})
