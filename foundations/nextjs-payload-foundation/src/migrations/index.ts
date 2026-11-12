// Replaced by `make migrate-create name=...` (run against PostgreSQL).
// Production runs these on start-up (prodMigrations in payload.config.ts).
// Generate the initial migration before the first production deploy:
//   make db && DATABASE_URL=postgres://app:app@localhost:5432/app make migrate-create name=initial
import type { Migration } from 'payload'

export const migrations: Migration[] = []
