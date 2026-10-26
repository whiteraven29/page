# 05: Design System

The direction combines **reference A** (strong photo hero, accent-coloured Apply button, utility strip) with
**reference B** (soft blue cards, "View all" sections, numbers band, audience cards), on top of the BPHIST seal blue.

## 1. Brand rules
- Use the official seal (`assets/logo.png`; the master is `../../Blue_Pharma_Institute_Logo_VECTOR.svg`) unchanged. Min size 48 px (header 56 px).
- Header lock-up: seal + "BPHIST" (bold) + "Blue Pharma Institute of Science and Technology" (small) on a second line.
- Motto *Self-Control, Conscientiousness & Excellence* in the footer and on the About page.
- Photography: **real** BPHIST students, labs, compounding practicals, graduation, Singida campus. No stock photos of foreign campuses.

## 2. Colour tokens

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--blue-700` **primary** | `#0646B5` | Logo blue; links, primary buttons, headings accents | 8.2 : 1 on white ✅ |
| `--blue-900` navy | `#0A2A66` | Utility bar, footer, numbers band | 13.7 : 1 with white ✅ |
| `--blue-600` hover | `#0A55D6` | Hover/active | |
| `--blue-100` | `#DCE7FB` | Chips, selected states | |
| `--blue-50` tint | `#EFF4FD` | Section backgrounds, cards (ref. B softness) | |
| `--amber-400` **action** | `#F6B511` | **Apply Now** only, alert-bar icon, key highlights | use **navy text** on amber (7.5 : 1) ✅ |
| `--green-600` | `#16803C` | "Open/current" badges, success | |
| `--red-600` | `#C62828` | "Urgent" notices, errors | |
| `--ink-900` | `#0F172A` | Body text | |
| `--ink-600` | `#475569` | Secondary text, dates | 7.6 : 1 ✅ |
| `--line` | `#E2E8F0` | Borders | |
| `--white` | `#FFFFFF` | Page background | |

Rules: amber is reserved for *apply/act*. If everything is amber, nothing stands out. Blue carries the brand.
Dark mode is **not** in v1 (institutional site; halves QA effort).

## 3. Typography
- **Headings:** *Poppins* 600/700 (the geometric face in reference B; friendly and legible).
- **Body/UI:** *Inter* 400/500/600.
- Self-hosted via `next/font` (no Google Fonts request at runtime); `font-display: swap`; Latin subset only.

| Style | Mobile | Desktop | Line height |
|---|---|---|---|
| Display (hero) | 32 px | 52 px | 1.1 |
| H1 | 28 | 40 | 1.2 |
| H2 (section) | 24 | 32 | 1.25 |
| H3 (card) | 18 | 20 | 1.35 |
| Body | 16 | 17 | 1.6 |
| Small / meta | 14 | 14 | 1.5 |
| Eyebrow (section label) | 12, uppercase, +0.08em, blue-700 | | |

Max line length 70 characters. Sentence case everywhere (no ALL-CAPS titles).

## 4. Layout and spacing
- Container 1200 px max; gutters 16 px (mobile) / 24 px (tablet) / 32 px (desktop).
- 4-px spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. Section padding 48 px mobile / 96 px desktop.
- Grid: 4 / 8 / 12 columns. Breakpoints `sm 640`, `md 768`, `lg 1024`, `xl 1280`.
- Radius: 8 px controls, 14 px cards, 999 px chips/pills. Shadow: one soft level `0 6px 20px rgb(10 42 102 / .08)`.

## 5. Components (build in this order)

| Component | Spec |
|---|---|
| **Button** | Primary (blue bg, white), Action (amber, navy text), Secondary (outline blue), Ghost. Height 44 px (touch target), icon optional, focus ring 3 px `--blue-100` + 2 px offset |
| **UtilityBar** | Navy, 36 px, hidden < 768 px (contents move to drawer + action bar) |
| **Header / MegaNav** | Sticky, simple dropdowns (no mega-menus), keyboard and Esc support, current page underlined |
| **AlertBar** | Tone info (blue-50) / urgent (amber-50 + red icon), dismissible per session, link required |
| **Hero** | 2-col (text / image) on desktop, stacked on mobile; one `<h1>`; badge chips above headline; floating "Next intake" card |
| **QuickAccessCard** | Icon (blue-50 circle), title, one-line description, whole-card link |
| **SectionHeader** | Eyebrow + H2 + "View all →" pill (ref. B) |
| **ProgrammePathway** | 3 connected nodes (NTA 4 → 5 → 6) horizontal ≥ 768 px, vertical below |
| **Steps** | Numbered circles + short text; 5 steps max |
| **NoticeRow** | Date block (day/month), title, badges (category, SW/EN, Pinned, Urgent), file type + size, download icon |
| **NewsCard** | 16:10 image, category, date, title (2 lines clamp), summary (2 lines) |
| **StatTile** | Big number (text, not JS counter), label, "as of" note |
| **FacilityTile** | Icon + title + one sentence |
| **GalleryStrip** | Horizontal scroll-snap on mobile, 6-up grid desktop, lightbox |
| **FAQ** | `<details>`/`<summary>` accordion (works without JS) |
| **ContactCard** | Tap-to-call, WhatsApp, email, map (click-to-load) |
| **Footer** | Navy, 4 columns → accordion on mobile, regulator links, legal row |
| **MobileActionBar** | Fixed bottom, 3 equal buttons, safe-area inset padding |
| **Badge / Chip / Breadcrumbs / Pagination / FileLink** | Utility UI |

Icons: **Lucide** (tree-shaken SVG). No icon fonts.

## 6. Accessibility (WCAG 2.2 AA target)
- Skip link, landmarks (`header`, `nav`, `main`, `footer`), one H1 per page, logical heading order.
- All interactive elements keyboard-reachable with a visible focus ring; dropdowns open on Enter/Space, close on Esc.
- Colour contrast as in the table; never rely on colour alone (urgent notices also show an icon and word "Urgent").
- Images have alt text (enforced in CMS); decorative images `alt=""`.
- `prefers-reduced-motion` respected; no autoplay video or carousels.
- Forms: visible labels, inline errors, `autocomplete` attributes.

## 7. Performance budget (mid-range Android, 4G)
| Metric | Budget |
|---|---|
| Homepage transfer size | ≤ 1 MB (≤ 500 KB before hero image) |
| JS (first load, gzip) | ≤ 150 KB |
| LCP | ≤ 2.5 s |
| CLS | ≤ 0.05 |
| INP | ≤ 200 ms |
| Lighthouse (mobile) | Performance ≥ 90, Accessibility ≥ 95, SEO 100 |

How: `next/image` with AVIF/WebP and `sizes`, hero `priority` and ≤ 180 KB, everything else lazy;
Server Components by default, client JS only for nav, lightbox and form; map and video **click-to-load**;
fonts self-hosted and subset; Cloudflare caching for media.

## 8. Voice and content style
- Clear, warm, factual. Address the applicant: "You need four CSEE passes, including Chemistry and Biology."
- Dates as `15 Feb 2027`; phone numbers in `+255 7XX XXX XXX` format; currency `TZS 1,200,000`.
- Every requirement, fee or date shows a **"Last verified"** date on Admissions pages.
- No unverifiable superlatives ("best college in Tanzania").
