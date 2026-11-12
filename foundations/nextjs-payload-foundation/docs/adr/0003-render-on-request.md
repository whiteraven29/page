# 0003: Public pages render on request; add caching only when measured

- **Status:** accepted
- **Date:** 2026-11-12

## Context
Static generation (ISR) with on-publish revalidation is the usual Next.js advice. It makes `next build` read the
database (Docker and CI builds have none), needs a revalidation hook on every collection, and can serve stale pages
when a hook is missed.

## Decision
`src/app/(frontend)/layout.tsx` sets `dynamic = 'force-dynamic'`. Pages read through the Payload Local API on every
request (a few milliseconds against a local database), deduplicated per request with React `cache()`.
Static assets and media are cached long-term by the CDN.

## Consequences
- A publish is visible on the next page view. No revalidation hooks to forget, and preview needs no special cache handling.
- `next build` works with no database.
- Each page view costs a few database queries. That is fine for small sites behind a CDN.

## When to change this
If origin response time (TTFB) is over about 600 ms under real traffic, cache the hot reads with tagged caching
(`unstable_cache` or `'use cache'` + `cacheTag`) and call `revalidateTag` from `afterChange` hooks. Record that in a new ADR.

## Alternatives considered
- ISR with `revalidatePath`/`revalidateTag`: fastest pages, but the build needs a database and stale pages are possible.
- Full CDN HTML caching: very fast, but needs purge on publish and care to bypass for signed-in editors.
