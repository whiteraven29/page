import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: [
      '.next/',
      'node_modules/',
      'media/',
      'src/payload-types.ts',
      'src/migrations/',
      'src/app/(payload)/',
      'playwright-report/',
      'test-results/',
    ],
  },
]

export default config
