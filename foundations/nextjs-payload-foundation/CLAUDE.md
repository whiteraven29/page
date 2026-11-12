# CLAUDE.md

Instructions for Claude Code working in this repository.

## Project
Next.js (App Router) + Payload CMS 3 in one app, TypeScript, PostgreSQL in production (SQLite allowed locally).
Read `docs/ARCHITECTURE.md` and `docs/CONVENTIONS.md` before larger changes, and `AGENTS.md` (Next.js version notes).
If `docs/DESIGN.md` exists, it describes the product. Follow it, and ask before changing its decisions.

## Commands
- `make setup`: first-time install (uses the Node version in `.nvmrc`)
- `make dev`: site and admin on http://localhost:3000 (admin at /admin)
- `make types`: after any collection, global or field change. Commit `src/payload-types.ts`
- `make test`, `make lint`, `make typecheck`, `make check`: run `make check` before saying work is done
- `make build`: production build (needs no database)
- `make migrate-create name=<change>`: before deploying schema changes (needs PostgreSQL)

## Content and access rules
- Two roles only (`src/access/roles.ts`). Every collection and global uses helpers from `src/access/index.ts`; no inline access functions.
- Publishable collections: drafts + versions + `schedulePublish`, `slugField()`, `seoField`, `delete: isAdmin`.
- Link fields use `validateHref`, titles use `validateSentenceCase`, images need alt text.
- Every new collection or global gets an access test in `tests/int/` for anonymous, editor and admin.

## Page rules
- Server Components by default; `'use client'` only for interactive pieces.
- Pages read data only through `src/lib/queries.ts`, which passes `readOptions()` (published only unless previewing).
  Never call the Local API from a page without `overrideAccess: false`.
- Every list shows an empty state. Every page has one `<h1>` and metadata (`buildMetadata()` for detail pages).
- Never edit generated files in `src/app/(payload)/` or `src/payload-types.ts` by hand.

## Working style
- Small changes, each with tests, then `make check`.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- Record decisions that are hard to reverse as a new ADR in `docs/adr/`.
