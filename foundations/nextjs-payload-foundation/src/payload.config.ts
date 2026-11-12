import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, type DatabaseAdapterObj } from 'payload'
import sharp from 'sharp'

import { isAdmin, isStaff } from './access'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { healthEndpoint } from './endpoints/health'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * One URL picks the database, like the DRF foundation:
 *   file:./dev.db                       SQLite, zero setup (local only)
 *   postgres://app:app@localhost/app    PostgreSQL (CI, staging, production)
 * Production migrations live in src/migrations and must be generated against PostgreSQL.
 */
const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'

function database(): DatabaseAdapterObj {
  if (databaseUrl.startsWith('file:')) {
    return sqliteAdapter({ client: { url: databaseUrl } })
  }
  return postgresAdapter({
    pool: { connectionString: databaseUrl },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Production applies committed migrations on start-up; dev and tests push the schema directly.
    prodMigrations: migrations,
  })
}

const secret = process.env.PAYLOAD_SECRET
if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET must be set in production.')
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  secret: secret || 'dev-only-insecure-secret-change-me',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' | CMS' },
  },
  collections: [Users, Media, Posts],
  globals: [],
  editor: lexicalEditor(),
  db: database(),
  sharp,
  upload: { limits: { fileSize: 20 * 1024 * 1024 } },
  endpoints: [healthEndpoint],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disablePlaygroundInProduction: true },
  jobs: {
    // Runs scheduled publish/unpublish. Disabled while building and in tests.
    autoRun: [{ cron: '* * * * *', allQueues: true }],
    shouldAutoRun: () => process.env.PAYLOAD_DISABLE_JOBS !== 'true',
    access: { run: isAdmin, queue: isStaff, cancel: isAdmin },
  },
  plugins: [],
})
