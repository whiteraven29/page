# BPHIST Website: Improved Design Pack

**Blue Pharma Institute of Science and Technology (BPHIST)**, Singida, Tanzania (formerly BPHACOH, Blue Pharma College of Health)
Motto: *Self-Control, Conscientiousness & Excellence*

This folder replaces and improves `../resources/BPHIST_Website_Design_and_Implementation_Plan.pdf`.
It draws on two reference designs (`../resources/*.avif`, `../resources/*.webp`), five Tanzanian
university websites (UDSM, IAA, UDOM, KU, MUST) and the college's own prospectus and logo.

## Read in this order

| # | File | What it gives you |
|---|------|-------------------|
| 1 | [01-research-findings.md](01-research-findings.md) | What the 5 university sites and the 2 reference designs do well or badly, and what we take from them |
| 2 | [02-architecture.md](02-architecture.md) | Updated system architecture, hosting, caching, security, backups |
| 3 | [03-roles-and-cms.md](03-roles-and-cms.md) | **The two roles (Admin and Content)**, permission matrix, content model, publishing workflow |
| 4 | [04-sitemap-and-pages.md](04-sitemap-and-pages.md) | Sitemap, navigation, homepage wireframe, page templates (desktop and mobile) |
| 5 | [05-design-system.md](05-design-system.md) | Colours, type, spacing, components, accessibility and performance budgets |
| 6 | [06-one-month-plan.md](06-one-month-plan.md) | **Day-by-day 4-week build plan** with gates, owners and a cut list |
| 7 | [07-launch-checklist.md](07-launch-checklist.md) | Acceptance tests, security, SEO, handover |
| - | [homepage-mockup.html](homepage-mockup.html) | Clickable static mock-up of the new homepage (open in a browser, resize to phone width) |

## What changed from the original plan

| Area | Original plan | Improved plan | Why |
|------|---------------|---------------|-----|
| **Roles** | 5 roles (Administrator, Content editor, Admissions editor, Approver, Developer) | **2 roles: `admin` and `content`**. The developer works through Git and hosting, not through a CMS role | The college has a small team. Fewer roles means fewer mistakes, simpler training and a shorter build |
| Workflow | Draft → Approval → Publish | **Draft → Preview → Publish** (both roles), plus version history, scheduled publishing and auto-expiring notices | No separate approver exists. Version history provides the safety net instead |
| Timeline | 4–6 weeks | **4 weeks (20 working days)**, with fixed scope, a cut list and three phase gates | Scope is locked to fixed templates (no page builder) and content is collected alongside the build |
| Content types | Pages, News, Programmes, Admissions, FAQs, Media | Adds **Notices (Matangazo)** with PDF attachments, a **Download Centre**, **Leadership/People**, **Gallery** and a **site-wide alert bar** | Every Tanzanian institution reviewed relies on dated notices and downloadable PDFs (selected applicants, joining instructions, results, fee structures) |
| Homepage | Long generic list | Gives priority to admissions and notices, adds quick-access cards, a programme pathway (NTA 4 → 5 → 6) and a mobile sticky bar (Call / WhatsApp / Apply) | Applicants and parents mostly arrive on phones and want to apply, check notices or call |
| Stale content | "Review regularly" | Notices get an **expiry date**; intake records have an **academic year** and auto-archive; the link checker runs in CI | UDOM and KU show dead `#` links, stale 2023/24 prospectuses and counters stuck at "0" |
| Hosting | "Managed host + managed DB" (not decided) | **Recommended:** one VPS (Docker Compose: Next.js+Payload, PostgreSQL, Caddy) behind Cloudflare, with media on S3-compatible storage. **Alternative:** Vercel + Neon | One predictable bill and no serverless limits for Payload's image processing |
| Admin security | Strong passwords, MFA "if supported" | Login lockout + **Cloudflare Access (email one-time code) in front of `/admin`** + individual accounts | Payload has no built-in MFA. Cloudflare Access adds a second factor for free at this team size |
| Performance | "Fast images" | Explicit budgets: homepage ≤ 1 MB, LCP ≤ 2.5 s on mid-range Android/4G, no auto-rotating carousel, no autoplay video | Visitors are on mobile data |

## Stack (unchanged in principle, made specific)

Next.js (App Router) + TypeScript · Tailwind CSS · Payload CMS 3 (inside the Next.js app) · PostgreSQL ·
S3-compatible media storage (e.g. Cloudflare R2) · Cloudflare DNS/CDN · Resend/Brevo/SMTP for email.
Pin exact versions on Day 1 and record them in the lockfile.

## Decisions the college must confirm (blocking Week 1)

1. **Name and domain**: is the public name BPHIST? Which domain (e.g. `bphist.ac.tz`)? Who controls the registrar and DNS? Does an old BPHACOH site or domain exist that needs 301 redirects?
2. **People**: who holds the **Admin** account (e.g. ICT officer) and who holds the **Content** accounts (e.g. PRO and admissions officer)?
3. **How students apply**: through the NACTVET Central Admission System, a college form (PDF), or both? This decides the "Apply" button target.
4. **Language**: the plan recommends English as the main site language, with bilingual navigation labels and notices allowed in Swahili (see 04). Confirm.
5. **Hosting budget** and who pays recurring costs (domain, VPS, email).
6. Verified facts: NACTVET registration number, contacts, fees and current intake dates.
