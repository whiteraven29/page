# 06: One-Month Build Plan (4 weeks / 20 working days)

**Team:** 1 developer (full-time) · college **Admin** owner (ICT officer, ~1 h/day) · college **Content** owner(s) (PRO/admissions, ~2 h/day in Weeks 1 and 3).
**Example calendar:** Week 0 = 27–30 Oct 2026 (prep) · Build = **Mon 2 Nov → Fri 27 Nov 2026** · Launch **Thu 26 Nov** · Handover **Fri 27 Nov**.
Shift all dates together if the start moves.

## Why 4 weeks is achievable (and what it depends on)
1. **Fixed templates, not a page builder.** About 12 templates; editors fill fields.
2. **Two roles**, so no approval workflow to build or test.
3. **Content is collected in parallel** by the college from Day 1. The prospectus already holds most of the About, Programme, Admissions and Campus Life text.
4. **Payload's own features** handle drafts, versions, scheduled publishing, uploads and auth. Nothing custom.
5. A **cut list** (bottom of this file) says exactly what moves to Week 5 if a gate slips.

**Hard dependencies:** domain/DNS access by Day 5, VPS purchased by Day 5, real photos by Day 10, verified admissions facts by Day 14.

---

## Week 0: Preparation (college + developer, before Day 1)
| # | Task | Owner | Output |
|---|---|---|---|
| 0.1 | Confirm the 6 decisions in [README](README.md#decisions-the-college-must-confirm-blocking-week-1) | Principal + Admin | Signed decision list |
| 0.2 | Create GitHub organisation owned by the college; invite developer | Admin | Repo home |
| 0.3 | Register or confirm domain; create Cloudflare account (college email); move DNS | Admin + Dev | Cloudflare zone active |
| 0.4 | Buy VPS (2 vCPU / 4 GB RAM / 80 GB) and R2/S3 bucket; email provider account | Admin (pays) + Dev | Credentials in password manager |
| 0.5 | Start the **content checklist** (§ Content checklist below) | Content | Shared folder created |

---

## Week 1: Foundation and CMS (Days 1–5)
| Day | Date | Developer | College | End-of-day deliverable |
|---|---|---|---|---|
| **1** | Mon 2 Nov | Kick-off (1 h): walk through this design pack, sitemap and homepage mock-up. Init repo: Next.js + Payload 3 + TS + Tailwind + Postgres (Docker). ESLint/Prettier, CI (lint, typecheck, build). Pin versions | Approve sitemap and homepage mock-up; name Admin and Content account holders | Repo with CI green; approved sitemap |
| **2** | Tue 3 Nov | Design tokens in Tailwind config; fonts via `next/font`; **Users** (2 roles, lockout) + `access/` helpers; **Media** with S3/R2 adapter, image sizes, MIME allow-list | Content: export prospectus text sections into the shared folder | Login works locally; uploads go to bucket |
| **3** | Wed 4 Nov | Collections: **Pages, News, Notices, Downloads** with drafts, versions, schedulePublish, SEO group, slug hook, validation rules (no `#` links, alt text) | Content: gather current notices + PDFs (latest 10) | Editors can create all 4 types locally |
| **4** | Thu 5 Nov | Collections: **Programmes, People, Gallery, FAQs, Testimonials, Enquiries**; Globals: **SiteSettings, Navigation, Homepage, Admissions**. **Vitest access-control tests** for anonymous / content / admin | Admin: verify contacts, NACTVET reg. no., socials, regulator links | Full content model + passing permission tests |
| **5** | Fri 6 Nov | Docker image + compose (app, Postgres, Caddy); deploy **staging** behind Cloudflare Access; nightly backup cron; seed script with prospectus content | 30-min admin walkthrough on staging (both roles) | **Staging live with seed data** |

**🚦 Gate 1 (Fri 6 Nov):** college confirms content model + the two-role permission matrix by using staging. Changes to fields after this point go to the cut list or Phase 2.

---

## Week 2: Public website UI (Days 6–10)
| Day | Date | Developer | College | Deliverable |
|---|---|---|---|---|
| **6** | Mon 9 Nov | Layout shell: UtilityBar, Header + dropdowns, mobile drawer, AlertBar, Footer, MobileActionBar, Breadcrumbs; UI primitives (Button, Card, Badge, Chip) | Content: select 25–40 photos; write alt text | Shell on staging, keyboard accessible |
| **7** | Tue 10 Nov | Homepage part 1: Hero, QuickAccess, Welcome, ProgrammePathway, AdmissionSteps (all reading Homepage/Admissions globals) | Principal's welcome message + photo final | Top half of homepage from CMS |
| **8** | Wed 11 Nov | Homepage part 2: NoticesList, NewsCards, Facilities, Numbers (server-rendered), GalleryStrip, FAQ, Contact; section toggles/order | Admin: approve "in numbers" figures (with as-of date) | Full homepage from CMS |
| **9** | Thu 12 Nov | Programmes list + detail (NTA level tabs); Admissions page (in-page nav, steps, requirements, dates, fees, "last verified") | Admissions officer: verify requirements, fees, intake dates | Programme + Admissions pages |
| **10** | Fri 13 Nov | Notices list (filters, current/archive, pagination) + detail (download, share); News list + detail; Downloads; About; Leadership; Campus life; Gallery; Contact; Privacy; 404 | Review staging on own phones; send feedback list | **All templates live on staging** |

**🚦 Gate 2 (Fri 13 Nov):** every page in the sitemap renders with real or seed content on mobile and desktop. Feedback is triaged as *fix now* vs *after launch*.

---

## Week 3: CMS integration, SEO and real content (Days 11–15)
| Day | Date | Developer | College | Deliverable |
|---|---|---|---|---|
| **11** | Mon 16 Nov | **Live preview / draft mode**; `afterChange` revalidation hooks per collection and global; Cloudflare cache rules (bypass admin/api/preview); test publish → visible ≤ 60 s | n/a | Publishing updates the live page without deploy |
| **12** | Tue 17 Nov | SEO: `generateMetadata`, `sitemap.ts`, `robots.ts`, canonical, OG images, JSON-LD (CollegeOrUniversity, Course, NewsArticle, Breadcrumb); Redirects plugin | Admin: list any old BPHACOH URLs to redirect | SEO validated with Rich Results Test |
| **13** | Wed 18 Nov | Contact form → Enquiries + email notification + Turnstile + rate limit; scheduled publishing job runner; notice expiry + alert-bar dates; admin dashboard "Recently changed" + "Admissions last verified" warning | n/a | Forms and time-based content work |
| **14** | Thu 19 Nov | **Training session 1 (2 h)** for Content + Admin on staging; then fix the friction they hit | **Content team enters real content**: notices, 3–5 news, downloads, gallery, FAQs, people | Real content on staging |
| **15** | Fri 20 Nov | Accessibility pass (axe + keyboard + screen reader spot check); performance pass to budget (image sizes, JS, fonts); link checker in CI | Continue content entry; proofread About/Admissions | Lighthouse mobile ≥ 90/95/100 |

**🚦 Gate 3 (Fri 20 Nov):** the Content role completes these **without help**: publish a notice with PDF, publish news with cover image, replace the homepage hero image, update intake dates, schedule a notice for tomorrow. Admin creates and disables a user.

---

## Week 4: Hardening, QA and launch (Days 16–20)
| Day | Date | Developer | College | Deliverable |
|---|---|---|---|---|
| **16** | Mon 23 Nov | Security hardening: Cloudflare Access on prod `/admin`, origin firewall (Cloudflare IPs only), security headers/CSP, upload limits, SSH lock-down, Dependabot. **Backup restore drill** into a fresh DB | Admin: confirm the email allow-list for `/admin` | Restore time recorded; security checklist ✅ |
| **17** | Tue 24 Nov | Cross-device QA (Android Chrome, iPhone Safari, desktop Chrome/Firefox/Edge; 360 px → 1440 px); fix list; Playwright smoke tests (home, notice, admissions, contact, admin login) | **Final content sign-off** (Principal/Admin): facts, spelling, photos, consent | Signed content approval |
| **18** | Wed 25 Nov | Production stack up; copy approved content staging → prod; set prod secrets; lower DNS TTL; uptime monitors; Search Console property; `EDITOR-GUIDE.md` + `RUNBOOK.md` drafts | Content: final read-through on prod (hidden URL) | Prod ready behind Access |
| **19** | Thu 26 Nov | **🚀 Launch**: DNS cut-over; verify TLS (SSL Labs A), sitemap submit, redirects, forms, analytics; watch logs/uptime all day | Announce on socials/WhatsApp groups; Admin publishes launch news post | **Site live** |
| **20** | Fri 27 Nov | **Training session 2 (1.5 h)** + handover: editor guide, runbook, credentials transfer (password manager), backup/restore walkthrough; agree 2-week hypercare | Admin signs handover; decides fate of developer account | **Handover signed** |

**Hypercare (30 Nov – 11 Dec):** daily log/uptime check, fix-only changes, a 30-min check-in each Friday. Note 9 Dec (Independence Day) as a non-working day.

---

## Content checklist (college, Weeks 0–3)
| Item | From | Owner | Due |
|---|---|---|---|
| Logo files (SVG/PNG) | Have ✅ | Admin | Day 1 |
| Official contacts, address, P.O. Box, WhatsApp, socials, office hours | | Admin | Day 4 |
| NACTVET registration no. + accreditation wording | | Admin | Day 4 |
| Vision, mission, core values, history | Prospectus ✅ (update name to BPHIST) | Content | Day 2 |
| Principal's message + portrait | Prospectus (update) | Content | Day 7 |
| Leadership, board, tutors (names, titles, photos) | Prospectus | Content | Day 10 |
| Programme details: NTA 4/5/6 durations (40 weeks each), entry requirements, modules, careers | Prospectus ✅ | Admissions | Day 9 |
| Intake dates, how to apply, apply link, fees 2026/27 | | Admissions | Day 9 |
| Downloads: prospectus, almanac 2025/26, fee schedule, joining instructions, forms | Have (partly) | Content | Day 14 |
| 25–40 real photos (labs, classes, library, hostel, graduation, campus, Ititi new campus render) | | Content | Day 6 |
| 10 current notices, 3–5 news stories, 5–8 FAQs | | Content | Day 14 |
| Testimonials **with written consent** (optional) | | Content | Day 14 |
| Privacy text (simple) | Developer drafts | Admin approves | Day 17 |

## Risk and cut list
If a gate slips by more than one day, move items **in this order** to Week 5, after launch:
1. Testimonials section
2. Gallery albums (keep homepage strip with 6 images)
3. Scheduled publishing (manual publish still works)
4. Contact form (keep phone / WhatsApp / email links)
5. Leadership photos (names and titles only)

**Never cut:** two-role permissions, notices + downloads, admissions page, preview, revalidation, SEO basics, backups + restore test, Cloudflare Access on `/admin`.

| Risk | Likelihood | Mitigation |
|---|---|---|
| Content/photos late | High | Week-0 checklist; seed with prospectus text; launch with fewer photos rather than stock |
| Domain/DNS access unclear | Medium | Resolve in Week 0; staging on a temp subdomain until then |
| Unverified admissions facts | Medium | "Last verified" field; Admissions officer signs off on Day 9 |
| Payload/Next version issues | Low–Med | Pin versions Day 1; no major upgrades during build |
| Staff unfamiliar with CMS | Medium | 2 training sessions, editor guide with screenshots, Gate 3 tasks |
| Developer unavailable | Low | Code in college GitHub; RUNBOOK; Docker makes rebuild repeatable |

## Phase 2 (after launch, separate budget)
Full Swahili localisation · site search · online application integration (if no external system) · events calendar ·
alumni page · newsletter · student portal links/SSO · analytics dashboard for Admin.
