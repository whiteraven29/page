# Conventions

## Add a collection (the recipe)

1. `src/collections/<Name>.ts`: copy the shape of `Posts.ts`. Use helpers from `src/access/` for every rule.
2. Register it in `src/payload.config.ts` (`collections: [...]`).
3. `make types` to regenerate `src/payload-types.ts`, and commit the file.
4. Add a test in `tests/int/` for anonymous, editor and admin.
5. Add public reads to `src/lib/queries.ts`, then the page under `src/app/(frontend)/`.
6. If it has public URLs, add it to `sitemap.ts`. Before deploying, `make migrate-create name=add_<name>` against PostgreSQL.

## Content rules

| Rule | How |
|---|---|
| Publishable content has drafts and versions | `versions: { drafts: { schedulePublish: true }, maxPerDoc: 25 }` |
| Editors unpublish; only admins delete | `delete: isAdmin` |
| URLs are stable | `slugField()`: auto-filled, locked for editors after publishing |
| No `#` or `http://` links | `validateHref` on every link field |
| No ALL-CAPS titles | `validateSentenceCase` on titles |
| Images have alt text | Media `alt` is required unless "Decorative" is ticked |
| SEO | `seoField` on every publishable collection, `buildMetadata()` on detail pages |
| Dates show to the public as `15 Feb 2027` | `formatDate()` |

## Code

- **TypeScript strict.** Types for documents come from `src/payload-types.ts`; never hand-write them.
- **Server Components by default.** Add `'use client'` only for interactivity (menus, forms, lightbox).
- **Data:** pages call functions in `src/lib/queries.ts`; never `payload.find()` inside a page.
  Public reads always pass `readOptions()` (published only, or drafts in preview).
- **Files:** components `PascalCase.tsx`, helpers `camelCase.ts`, collections are singular-file `PascalCase.ts` with plural slugs (`posts`).
- **Style:** Prettier (single quotes, no semicolons, 100 columns) and ESLint (`next/core-web-vitals`).
- **CSS:** design tokens as CSS custom properties in one place; no inline colour values in components.

## Git

- **Branches:** `feat/<name>`, `fix/<name>`, `docs/<name>`, `chore/<name>`, all from `main`.
- **Commits:** Conventional Commits, for example `feat(notices): add expiry date`.
- **Merging:** one pull request per issue, CI green, squash merge.
- **Releases:** semantic version tags, `v1.2.0`.

## Testing targets

- Every collection and global has an access test (anonymous, editor, admin).
- Every validator has unit tests.
- A bug gets a failing test first, then the fix.
- Before a release: `make check`, `make build`, Playwright smoke tests, and a look on a phone.
