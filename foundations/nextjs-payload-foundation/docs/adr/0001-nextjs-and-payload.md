# 0001: Next.js App Router with Payload CMS 3 in the same app

- **Status:** accepted
- **Date:** 2026-11-12

## Context
Content websites (colleges, NGOs, small businesses) need fast, server-rendered public pages for SEO and mobile data,
and an admin where non-technical staff publish with drafts, preview, versions and scheduling.
The DRF + React foundation suits API-first apps, but for a content site it would mean rebuilding a CMS by hand
and shipping a client-rendered SPA.

## Decision
One Next.js app. Payload 3 runs inside it: the admin at `/admin`, REST and GraphQL at `/api`, and the Local API for
server components. PostgreSQL in production, SQLite allowed for local work.

## Consequences
- Drafts, versions, scheduled publish, uploads with image sizes, auth with lockout and the admin UI come for free.
- Public pages are Server Components: little JavaScript, real HTML for search engines and link previews.
- One process to deploy and one toolchain (Node + npm).
- Payload packages must all share one version, and Next.js must stay inside Payload's supported range (check the
  `next` peer dependency of `@payloadcms/next` before upgrading).
- Payload has no built-in MFA: put Cloudflare Access (or similar) in front of `/admin` for internet-facing sites.

## Alternatives considered
- DRF + React (our other foundation): good for apps and mobile APIs, but no CMS features and an SPA hurts SEO.
- WordPress: familiar to editors, but plugins and PHP hosting add security upkeep, and the code is not typed or tested the way we work.
- Headless SaaS CMS (Sanity, Contentful): recurring cost per seat and data held by a vendor.
