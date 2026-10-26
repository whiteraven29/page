# 02: Architecture (updated)

## 1. Principles
1. **One application**: Next.js serves both the public site and the Payload admin (`/admin`). No microservices.
2. **Content is data, design is code**: staff edit fields in fixed templates; layout, components and schemas change only through Git.
3. **Published-only to the public**: every public query filters on `_status = published`; drafts are visible only to signed-in users through preview.
4. **Two CMS roles** (`admin`, `content`) enforced **server-side** in Payload access functions, not just hidden in the UI.
5. **Cheap, boring, recoverable**: one VPS, nightly off-site backups, a restore that has actually been tested.

## 2. System overview

```
                          ┌───────────────────────────────────────┐
  Visitors (mobile 80%+)  │              Cloudflare               │
  ───────────────────────►│  DNS · TLS · CDN cache · WAF/rate-    │
                          │  limit · Access (OTP gate on /admin)  │
  Staff (Admin/Content)   └───────────────┬───────────────────────┘
  ───────────────────────►                │ HTTPS (origin cert)
                                          ▼
          ┌───────────────────────── VPS (Docker Compose) ─────────────────────────┐
          │                                                                        │
          │  ┌────────┐     ┌──────────────────────────────────────────────┐       │
          │  │ Caddy  │────►│  Next.js app (Node)                          │       │
          │  │reverse │     │  ├─ (frontend) routes  → public pages         │       │
          │  │ proxy  │     │  │    RSC + ISR/tag cache, next/image         │       │
          │  └────────┘     │  ├─ (payload) /admin   → Payload admin UI     │       │
          │                 │  ├─ /api/*            → Payload REST/GraphQL  │       │
          │                 │  ├─ /next/preview     → draft mode            │       │
          │                 │  └─ Payload jobs      → scheduled publish     │       │
          │                 └──────────┬───────────────────────┬───────────┘       │
          │                            │ SQL                   │ S3 API            │
          │                 ┌──────────▼─────────┐             │                   │
          │                 │  PostgreSQL 16+    │             │                   │
          │                 │  (volume)          │             │                   │
          │                 └──────────┬─────────┘             │                   │
          │   cron: pg_dump nightly ───┘                       │                   │
          └────────────────────────────┼─────────────────────────┼─────────────────┘
                                       ▼                       ▼
                         ┌────────────────────────┐   ┌─────────────────────────┐
                         │ Backup bucket          │   │ Media bucket (R2/S3)    │
                         │ (separate credentials, │   │ originals + sizes, PDFs │
                         │  30-day retention)     │   │ served via CDN domain   │
                         └────────────────────────┘   └─────────────────────────┘

  Email provider (SMTP/API): password resets · contact-form notifications
  Uptime monitor (e.g. UptimeRobot/Better Stack) · error tracking (Sentry, optional)
  GitHub: code · CI (lint, typecheck, build, link-check) · deploy via SSH/GHCR image
```

### Alternative (fully managed)
Vercel (Next.js + Payload) + Neon/Supabase Postgres + R2/S3 media + Payload jobs via Vercel cron.
Less server maintenance, but more vendors and plan limits (function duration, image processing).
**Recommendation: VPS** for one predictable bill and a single place to look when something breaks.
Compare current prices before buying; do not rely on free tiers for production.

## 3. Request flows

**Public page view**
`Browser → Cloudflare (cache HIT? return) → Caddy → Next.js RSC → Payload Local API (published only, cached by tag) → HTML`

**Content publish**
`Staff saves in /admin → Payload validates + access check → Postgres write (+ version row) → afterChange hook → revalidateTag('news'|'notices'|…) and revalidatePath(affected URLs) → next request rebuilds page`

**Preview**
`Staff clicks "Preview" → /next/preview?secret&slug → draftMode() enabled → page queries with draft:true → staff sees unpublished version (never cached, noindex)`

**Scheduled publish / notice expiry**
- Payload `schedulePublish` (versions + jobs queue) publishes at a set time; the job runner runs inside the app (`autoRun` cron).
- Notices are filtered by `expiresAt > now` at query time; listing pages revalidate at least hourly (`revalidate: 3600`) so expired notices drop off without anyone touching them.

## 4. Caching strategy
| Route | Rendering | Invalidation |
|---|---|---|
| Home | Static + tags `home, notices, news, programmes` | Hooks on those collections and the Homepage global; plus `revalidate: 3600` safety |
| `/news/[slug]`, `/notices/[slug]`, `/programmes/[slug]` | `generateStaticParams` + on-demand | `revalidatePath` of own slug + listing tag |
| Listings (news, notices, downloads) | Static, paginated via search params | Collection tag |
| `/admin`, `/api`, preview | Dynamic, `Cache-Control: private, no-store` | n/a |
| Media | Immutable URLs (hashed), CDN cache 1 year | New upload gives new URL |

**Test explicitly** (Week 3): edit → publish → page updates within 60 s, both at origin and through Cloudflare.
Configure Cloudflare to **bypass cache** for `/admin*`, `/api*`, `/next/*` and any request carrying the Payload auth cookie.

## 5. Repository structure (Payload 3 conventions)

```
bphist-website/
├─ docker/                     # Dockerfile, compose.yml, Caddyfile, backup.sh
├─ .github/workflows/ci.yml    # lint · typecheck · build · link-check · deploy
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/
│  │  │  ├─ layout.tsx         # header, alert bar, footer, mobile action bar
│  │  │  ├─ page.tsx           # Home
│  │  │  ├─ about/ · about/leadership/
│  │  │  ├─ programmes/ · programmes/[slug]/
│  │  │  ├─ admissions/
│  │  │  ├─ notices/ · notices/[slug]/
│  │  │  ├─ news/ · news/[slug]/
│  │  │  ├─ downloads/
│  │  │  ├─ campus-life/ · gallery/
│  │  │  ├─ contact/
│  │  │  ├─ [slug]/            # generic CMS pages (privacy, fees policy …)
│  │  │  ├─ sitemap.ts · robots.ts · not-found.tsx
│  │  │  └─ next/preview/route.ts
│  │  └─ (payload)/admin/…     # generated by Payload
│  ├─ access/                  # isAdmin, isStaff, publishedOrStaff, adminFieldOnly
│  ├─ collections/             # Users, Media, Pages, News, Notices, Programmes,
│  │                           # Downloads, People, Gallery, FAQs, Testimonials, Enquiries
│  ├─ globals/                 # SiteSettings, Navigation, Homepage, Admissions
│  ├─ hooks/                   # revalidate*.ts, slugify, sentenceCaseWarning
│  ├─ components/
│  │  ├─ layout/               # UtilityBar, Header, MobileNav, AlertBar, Footer, ActionBar
│  │  ├─ sections/             # Hero, QuickAccess, Welcome, ProgrammePathway, AdmissionSteps,
│  │  │                        # NoticesList, NewsCards, Facilities, Numbers, GalleryStrip, FAQ, Contact
│  │  └─ ui/                   # Button, Card, Badge, Chip, Breadcrumbs, Pagination, FileLink
│  ├─ lib/                     # payload client, queries.ts, seo.ts, jsonld.ts, format.ts
│  └─ payload.config.ts
├─ seed/                       # sample + real content import (prospectus text)
├─ tests/                      # access-control tests (vitest), e2e smoke (Playwright)
└─ docs/                       # EDITOR-GUIDE.md, RUNBOOK.md
```

## 6. Security baseline
- **/admin protected twice**: Payload login (lockout: `maxLoginAttempts: 5`, `lockTime: 15 min`) **plus Cloudflare Access** policy (email one-time code, allow-list of staff emails). Free at this team size.
- Individual named accounts only; no shared logins. Admin offboards leavers the same day.
- Role field editable **only by admin** (field-level access), so a content user cannot promote themselves.
- Uploads: allow-list MIME types (jpg, png, webp, avif, pdf, docx, xlsx); size limits (images 10 MB, docs 20 MB); SVG uploads disabled (XSS risk).
- Rich text: Lexical with a restricted feature set; no raw HTML/embed blocks for editors.
- Headers via Caddy/Next: HSTS, CSP (self + media domain + maps), `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors 'self'`.
- Contact form: Cloudflare Turnstile + server-side validation + rate limit; submissions visible to both roles, auto-deleted after 12 months.
- Secrets in `.env` on server (chmod 600) and GitHub Actions secrets; never in Git. Separate secrets for staging and production.
- OS: unattended security upgrades, SSH key-only, firewall allowing 22 (restricted), 80, 443. Origin accepts traffic only from Cloudflare IPs.
- Dependencies: Dependabot/Renovate weekly; patch Next.js/Payload security releases promptly.
- Personal data: publish selected-applicant or result lists only by **exam/form number** where possible, with Admin approval; add a privacy page.

## 7. Environments and deployment
| Env | Where | Data |
|---|---|---|
| Local | Docker Compose (Postgres) + `pnpm dev` | Seed data |
| Staging | Same VPS, separate compose project + DB + bucket prefix, `staging.` subdomain behind Cloudflare Access | Copy of prod content (weekly) |
| Production | VPS | Live |

Deploy: push to `main` → CI builds Docker image → push to GHCR → SSH `docker compose pull && up -d` → run Payload migrations → health check → (rollback = previous image tag).
Content edits **never** need a deploy.

## 8. Backups and recovery
- **Database**: nightly `pg_dump` (compressed, encrypted) → backup bucket, keep 30 dailies + 12 monthlies.
- **Media**: bucket versioning ON, or nightly `rclone sync` to backup bucket.
- **Code**: GitHub (college-owned organisation; developer is a member).
- **Restore drill** in Week 4: restore last night's dump into a fresh container, point staging at it, verify pages and media. Record the time it takes in RUNBOOK.md.
- RPO 24 h, RTO 4 h (acceptable for a college website).

## 9. Observability
- Uptime checks on `/` and `/api/health` every 5 min → email/SMS to Admin and developer.
- Container logs (docker logs, 14-day rotation). Optional Sentry for server errors.
- Google Search Console + privacy-friendly analytics (Plausible/Umami self-hosted or GA4 with consent).
