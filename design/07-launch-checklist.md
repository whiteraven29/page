# 07: Launch Acceptance Checklist

Tick every item on **production** (not staging) before handover on Day 20.

## A. Two-role permissions (test with real accounts)
- [ ] Anonymous visitor cannot see drafts, `/api/users`, enquiries or unpublished documents (try direct API URLs).
- [ ] **Content** user can create, edit, preview, publish and unpublish News, Notices, Programmes, Downloads, Pages, People, Gallery, FAQs.
- [ ] **Content** user can edit Homepage and Admissions globals.
- [ ] **Content** user **cannot** open Users, change own role, edit SiteSettings/Navigation/Redirects, or hard-delete anything (check UI *and* API).
- [ ] **Admin** can create, disable and re-enable a user, reset a password, and restore an old version.
- [ ] Five wrong passwords lock the account for 15 minutes.
- [ ] `/admin` is gated by Cloudflare Access; a non-listed email cannot reach the login page.

## B. Editor tasks (Gate 3, repeated on prod)
- [ ] Publish a notice with a PDF; it appears on the homepage and `/notices` within 60 seconds.
- [ ] A notice with `expiresAt` in the past is gone from the homepage and the Current tab, and still reachable in the Archive.
- [ ] Publish news with a cover image and alt text.
- [ ] Replace the homepage hero image without code changes.
- [ ] Update intake dates; "Last verified" date updates.
- [ ] Hide/show a homepage section with the toggle.
- [ ] Alert bar appears and disappears according to its start/end dates.

## C. Quality
- [ ] Every sitemap page works at 360, 768, 1024 and 1440 px; no horizontal scroll.
- [ ] Android Chrome, iPhone Safari, desktop Chrome/Firefox/Edge checked.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 (home, programme, notice).
- [ ] Homepage ≤ 1 MB transferred; LCP ≤ 2.5 s on throttled 4G.
- [ ] Keyboard-only navigation through header, dropdowns, drawer, FAQ, form; focus always visible.
- [ ] axe: zero serious/critical issues.
- [ ] Link checker: zero broken internal links, no `#` placeholders.
- [ ] Numbers band shows real values with JavaScript disabled.
- [ ] Spelling and facts approved by the Principal/Admin (signed).

## D. SEO
- [ ] Unique title + meta description on every page; OG image renders in WhatsApp/Facebook preview.
- [ ] `/sitemap.xml` lists only published URLs; `/robots.txt` blocks `/admin`, `/api`, `/next`.
- [ ] Canonical tags correct; preview pages `noindex`.
- [ ] JSON-LD validates (Rich Results Test) for home, a programme and a news post.
- [ ] Search Console verified, sitemap submitted; Google Business Profile updated with the new URL.
- [ ] Old URLs (if any) 301-redirect to new pages.

## E. Security and operations
- [ ] HTTPS everywhere, HSTS on; SSL Labs grade A; complete certificate chain (avoid the IAA problem).
- [ ] Security headers present (CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors).
- [ ] Origin only accepts Cloudflare IPs; SSH key-only; firewall on; unattended upgrades on.
- [ ] Uploads: SVG and executable types rejected; oversize files rejected.
- [ ] Contact form: Turnstile works; rate limit returns 429 on abuse; notification email arrives (SPF/DKIM/DMARC pass).
- [ ] No secrets in Git (`gitleaks` scan clean); prod and staging secrets differ.
- [ ] Nightly DB backup and media backup ran **and a restore was tested** (time recorded in RUNBOOK).
- [ ] Uptime monitor alerts reach Admin and developer.
- [ ] Dependabot/Renovate enabled.

## F. Handover
- [ ] `docs/EDITOR-GUIDE.md` (with screenshots): log in, notices, news, homepage, admissions, media, versions.
- [ ] `docs/RUNBOOK.md`: deploy, rollback, restore, rotate secrets, add an admin, renew domain, who to call.
- [ ] All credentials in a college-owned password manager; domain, Cloudflare, VPS, bucket and email accounts owned by college emails.
- [ ] Developer account: disabled, or kept under a written support agreement.
- [ ] Hypercare dates and contact agreed.
