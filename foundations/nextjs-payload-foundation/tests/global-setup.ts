import fs from 'fs'
import path from 'path'

/** Start every run from an empty SQLite file (ignored when TEST_DATABASE_URL points at Postgres). */
export default function setup() {
  const dir = path.resolve('.tmp')
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
}
