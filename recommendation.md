# Recommendation: how to build the BPHIST website

Date: 12 Nov 2026. Based on a full read of `design/` (README, 01–07, homepage mock-up) and
`drf-react-foundation/` (code, docs, ADRs, CI, deploy files).

## 1. Summary

| Question | Recommendation |
|---|---|
| Which stack? | **Keep the design pack's stack: Next.js (App Router) + Payload CMS 3 + PostgreSQL.** |
| Build BPHIST on `drf-react-foundation`? | **No.** It is a good foundation for API-first apps, but it does not fit a content website (reasons in §2). It is kept unchanged (moved to `foundations/`) for those projects. |
| What foundation instead? | A new reusable **`foundations/nextjs-payload-foundation/`**, built in the same style as the DRF one (Makefile, SDLC roadmap, conventions, ADRs, CI, tests, deploy files) so it can start other content-driven projects too. |
| Where does BPHIST live? | **`../bphist-website/`**, its own Git repository next to this one (the name used in design 02 §5), created from the new foundation, then extended with the BPHIST content model and templates. |
| Pinned versions | Node **22.23.5** (`.nvmrc`), Next.js **16.4.6**, Payload **3.93.0**, React **19.2.6**, TypeScript **5.7.3**. Payload 3.93 needs Node ≥ 22.23.4; this machine had 22.23.1, so 22.23.5 was installed with `nvm install 22`. |

## 2. Why not DRF + React for this project

The design pack depends on features that Payload provides out of the box. On DRF + React each one would have to be built by hand:

| Design requirement | Payload + Next.js | DRF + React SPA |
|---|---|---|
| Editors' admin with drafts, **version history + restore**, **scheduled publish** (03 §4) | Built in (`versions.drafts`, `schedulePublish`, jobs queue) | Django admin + django-reversion + custom scheduling |
| **Preview before publish** (never-cut list) | `draftMode()` + `/next/preview` route | Custom signed-token preview flow |
| **SEO 100**, OG previews in WhatsApp, JSON-LD (04 §6) | Server-rendered HTML, `generateMetadata`, `sitemap.ts` | SPA sends an empty `<div id="root">`, so meta injection or SSR has to be added |
| "Numbers band shows real values **with JavaScript disabled**" (07 C) | Server Components render the text | Fails as an SPA |
| JS first load ≤ 150 KB, LCP ≤ 2.5 s on 4G (05 §7) | Server Components ship little JS | The whole app ships as JS |
| Two roles enforced **server-side** (03 §3) | Payload access functions (already sketched in 03) | DRF permissions + Django groups (possible, but the sketch has to be rewritten) |

The DRF foundation's own ADR 0001 rejects Next.js because "it duplicates the backend's job". That holds for API-first apps
with a separate backend. Here **Payload is the backend**, inside the same Next.js process, so nothing is duplicated.

## 3. The new foundation: `foundations/nextjs-payload-foundation/`

What carries over from the DRF foundation, adapted:

| DRF foundation | Next.js + Payload foundation |
|---|---|
| `make setup/dev/test/lint/check` | Same targets (`make dev` replaces backend + frontend) |
| `docs/ROADMAP.md` (7-phase SDLC), `CONVENTIONS.md`, `ARCHITECTURE.md`, `DEPLOYMENT.md`, ADRs | Same documents, rewritten for Next.js + Payload |
| Custom user, login required by default | `users` auth collection with **two roles** (`admin`, `editor`), lockout after 5 failures, `active` flag, role editable by admin only |
| `IsOwner`, "secure by default" | `src/access/`: `isAdmin`, `isStaff`, `publishedOrStaff`, `adminField`, `selfOrAdmin`; every collection declares access explicitly |
| `notes` example feature | `posts` example collection: drafts, versions, scheduled publish, slug, SEO group, preview, revalidation, list and detail pages |
| `/api/v1/health/` | `/api/health` (checks the database) |
| pytest + Vitest | **Vitest integration tests on Payload's Local API that prove the role matrix**, plus Playwright smoke tests |
| SQLite by default, PostgreSQL to match production | Same: `DATABASE_URL=file:./dev.db` uses SQLite, `postgres://…` uses PostgreSQL |
| Nginx + systemd + `deploy.sh` | **Docker Compose (app + Postgres + Caddy)**, `backup.sh`, as in design 02 |
| `make app name=…` | `docs/CONVENTIONS.md` recipe "add a collection" (4 files to touch) |

## 4. Small changes to the design pack (please confirm)

| # | Design pack says | Draft does | Why |
|---|---|---|---|
| 1 | Tailwind CSS | **Plain CSS with the design tokens from 05** (one `tokens.css` + component CSS ported from `homepage-mockup.html`) | The approved mock-up is already hand-written CSS, so porting it is faster and exact. One less build tool. Tailwind can be added later without touching the data layer |
| 2 | Local env: Docker Compose Postgres | **SQLite locally when Docker is not available**; Postgres in CI, staging and prod | Docker on this machine needs `sudo` (your user is not in the `docker` group). Production migrations must be generated against Postgres (`make db && npm run payload migrate:create`) |
| 3 | `pnpm` | **npm** | `pnpm` is not installed here, and npm is what the DRF foundation uses. Switching later is a single lockfile change |
| 4 | Calendar: build 2–27 Nov 2026 | **Shift all dates.** Today is 12 Nov, so Day 1 is effectively today | Plan 06 says to "shift all dates together if the start moves" |
| 5 | Static pages with ISR + `revalidateTag` hooks (02 §4) | **Pages render on request** (ADR 0003); Cloudflare still caches media and static files | `next build` then needs no database (Docker/CI builds have none), and a publish shows on the next view with no hooks to forget. Measured locally: 60–110 ms per page in production mode. Add tagged caching only if real traffic needs it |

Everything else in the design pack stands as written: the two roles, the content model, the sitemap, the homepage order, the performance budgets, security and the launch checklist.

## 5. What the first draft in `bphist-website/` contains

Equivalent to plan **Week 1 and most of Week 2**:

- **Content model** from 03 §5: collections Users, Media, Pages, News, Notices, Programmes, Downloads, People,
  Gallery, FAQs, Testimonials, Enquiries; globals SiteSettings, Navigation, Homepage, Admissions.
- **Two roles** (`admin`, `content`) enforced in access functions, with **integration tests for the permission matrix**
  (anonymous / content / admin).
- Drafts, versions (25 per document), scheduled publishing, notice **expiry**, alert-bar start/end dates,
  validation rules (no `#` links, sentence-case warning, alt text, academic year on downloads).
- **Public templates**: layout shell (utility bar, header with dropdowns, mobile drawer, alert bar, footer, mobile action bar),
  full homepage from the CMS, Notices list/detail, News list/detail, Programmes list/detail with NTA tabs, Admissions,
  Downloads, About, Leadership, Gallery, Contact (with form → Enquiries), generic CMS pages (Campus life, Privacy), 404.
- **SEO basics**: `generateMetadata`, `sitemap.ts`, `robots.ts`, JSON-LD for the organisation.
- Preview (draft mode) and on-publish revalidation hooks.
- A **seed script** with the prospectus facts already in the design pack (NTA 4–6 pathway, entry requirement,
  steps, FAQs, regulator links). Every unverified value is in `[brackets]`, as in the mock-up.

Not in the draft (later weeks of plan 06): R2/S3 media adapter (local `media/` folder for now), Turnstile on the contact form,
the Redirects plugin, the admin dashboard widgets ("Recently changed", "Admissions last verified" warning), Cloudflare and
VPS setup, Lighthouse/axe passes, production migrations, editor guide and runbook.

### How the draft was checked

| Check | Result |
|---|---|
| `make check` (types up to date, ESLint, TypeScript, tests) | Passes in both the project (52 tests) and the foundation (30 tests) |
| Permission matrix (03 §2) as anonymous / content / admin | Covered by tests: users, all content collections, globals, enquiries, lockout, disabled accounts |
| Anti-mistake rules (01 §2) | Tested: no `#` links, max 7 menu items, sentence-case titles, alt text, no SVG, academic year, notice expiry |
| `next build` with no database reachable | Passes |
| Every sitemap route against seeded data | 200 for every page, 404 for unknown URLs, 403 for anonymous `/api/users` and `/api/enquiries`, one `<h1>` per page, no `#` links |
| Look and feel | Desktop and phone screenshots match the mock-up's structure; numbers are server-rendered text |

### Known issues to fix next

1. **First-load JavaScript is 177 KB gzipped**, over the 150 KB budget (05 §7). Most of it is the Next.js runtime; the header menu, alert bar and contact form are the only client components. Measure with Lighthouse and trim before launch.
2. **The 404 page is rendered by the browser, not the server.** The status code is a correct 404 and the page appears in a real browser, but the server HTML is Next's error shell. Probably related to the two root layouts (site and admin). `global-not-found` did not fix it; investigate before the Week 4 QA.
3. **No production migration yet.** Generate the initial PostgreSQL migration before the first deploy (`make db && make migrate-create name=initial`). This needs Docker, and on this machine your user is not in the `docker` group yet.
4. The Playwright smoke tests are written but were not run (they need `npx playwright install chromium`).

## 6. Decisions still blocking (from design README, unchanged)

1. Public name **BPHIST** and the domain (`bphist.ac.tz`?), plus any old BPHACOH URLs that need redirects.
2. Who holds the **Admin** account and who holds **Content** accounts.
3. How students apply: NACTVET CAS, a college form, or both. This sets the Apply button target.
4. English as the main language with bilingual navigation labels.
5. Hosting budget and who pays.
6. Verified facts: NACTVET registration number, contacts, fees, intake dates.

## 7. Folder layout

```text
BPHACOH/
├── page/                                   this repository: design and reusable foundations
│   ├── design/                             the design pack (unchanged)
│   ├── resources/                          reference designs and the original PDF plan (unchanged)
│   ├── foundations/
│   │   ├── drf-react-foundation/           API-first apps (moved here, unchanged)
│   │   └── nextjs-payload-foundation/      content websites (new, reusable)
│   └── recommendation.md
└── bphist-website/                         separate Git repository: the BPHIST project only
```

Projects live **outside** this repository, one repository each, so the design and foundation history stays clean
and no Git repository is nested inside another. To start another project: copy a foundation next to `page/`
(for example `BPHACOH/<project-name>/`), run `git init` there, and follow its README.

`bphist-website/` is a local repository with no commits and no remote yet. When the college's GitHub organisation
exists (plan task 0.2), add it as the remote and push; CI then runs from `.github/workflows/ci.yml`.
