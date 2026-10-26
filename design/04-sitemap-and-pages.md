# 04: Sitemap, Navigation and Page Designs

## 1. Language decision (recommended)
- **English is the main site language.** The prospectus, NACTVET materials and programme names are in English.
- **Navigation labels are bilingual** (English with a Swahili subtitle in the mobile menu, e.g. *Admissions · Udahili*), helping parents and Form IV/VI leavers.
- **Notices may be written in Swahili or English** (language tag shown as a small badge), which matches how MUST/UDSM publish.
- Full bilingual content (Payload localisation `en`/`sw`) is **Phase 2**. Field names are prepared for it but the toggle is off in v1.
- **URLs in English** and stable: `/admissions`, `/programmes/pharmaceutical-sciences`, `/notices/selected-applicants-march-2027`.

## 2. Sitemap

```
/                                Home
├─ /about                        About BPHIST (history BPHACOH → BPHIST, vision, mission, core values, accreditation)
│  └─ /about/leadership          Principal, Governing Board, Management, Tutors
├─ /programmes                   All programmes (cards)
│  └─ /programmes/[slug]         e.g. pharmaceutical-sciences (NTA 4 → 5 → 6 pathway)
├─ /admissions                   How to apply · requirements · intake dates · fees · joining instructions · FAQ
├─ /notices                      Notices (Matangazo): filter by category, "Current" / "Archive"
│  └─ /notices/[slug]
├─ /news                         News & Events
│  └─ /news/[slug]
├─ /downloads                    Download Centre: by category and academic year
├─ /campus-life                  Facilities, labs, library, accommodation, health insurance, students' association, sports, worship
│  └─ /gallery  · /gallery/[slug]
├─ /contact                      Contact details, map, enquiry form, office hours
├─ /privacy                      Privacy & data use
└─ (system) /sitemap.xml · /robots.txt · /admin · 404
```
About **12 templates** in total, small enough for a one-month build.

## 3. Navigation

**Utility bar** (desktop, navy): `☎ phone` · `✉ email` · `WhatsApp` | `Notices` · `Downloads` · `Student Portal*` | socials
(*only if a portal exists; otherwise hidden. Never a `#` link.)

**Main header** (white, sticky on scroll, 72 px → 60 px):

| Label (EN · SW) | Children (≤ 6) |
|---|---|
| Home · *Mwanzo* | n/a |
| About · *Kuhusu Sisi* | Overview · Leadership · Accreditation · Campus life · Gallery |
| Programmes · *Kozi* | (one link per programme) · All programmes |
| Admissions · *Udahili* | How to apply · Entry requirements · Fees · Intake dates · Joining instructions · FAQ |
| News & Notices · *Habari na Matangazo* | Notices · News & Events · Downloads |
| Contact · *Mawasiliano* | n/a |
| **[ Apply Now ]** (amber button) | → Admissions global `applyLink` |

**Mobile**: logo + "Apply" + ☰. Drawer shows full nav with Swahili subtitles, then contacts.
**Mobile sticky action bar** (bottom, 56 px): `📞 Call` · `💬 WhatsApp` · `📝 Apply`. Hidden on `/admin` and when the keyboard is open.

## 4. Homepage wireframe (desktop)

The working version of this layout is in [homepage-mockup.html](homepage-mockup.html).

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ ☎ +255 … | ✉ info@… | WhatsApp          Notices · Downloads          f  ig  x  yt    │ navy utility bar
├──────────────────────────────────────────────────────────────────────────────────────┤
│ (seal) BPHIST                Home About Programmes Admissions News&Notices Contact [Apply Now]│
│        Blue Pharma Institute of Science & Technology                                  │ white header
├──────────────────────────────────────────────────────────────────────────────────────┤
│ ⚑ Applications for the March 2027 intake are open, deadline 15 Feb 2027 → How to apply ×│ alert bar (CMS, auto-expires)
├──────────────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────┐   ┌───────────────────────────┐               │
│  │ SINGIDA · NACTVET REGISTERED       │   │      [ authentic photo:    │               │
│  │ Train as a Pharmaceutical          │   │  students in compounding   │  HERO          │
│  │ Sciences professional              │   │        laboratory ]        │  (static, no   │
│  │ Practical, CBET-based NTA 4–6 …    │   │  ┌──────────────────────┐  │   carousel)    │
│  │ [Apply Now]  [Explore Programmes]  │   │  │ Next intake: Mar 2027│  │               │
│  └───────────────────────────────────┘   │  └──────────────────────┘  │               │
│                                           └───────────────────────────┘               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ [🎓 Apply & Admissions] [📢 Notices] [📄 Downloads] [📞 Contact & Visit]               │ quick-access cards
├──────────────────────────────────────────────────────────────────────────────────────┤
│ (photo) Principal's welcome: "Karibu BPHIST…" 3–4 lines  [Read the full message →]   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ OUR PROGRAMME: Pharmaceutical Sciences                                                │
│  ( NTA 4 )───────►( NTA 5 )───────►( NTA 6 )                                          │ pathway diagram
│  Basic Technician  Technician Cert.  Ordinary Diploma                                 │
│  40 weeks          40 weeks          40 weeks        [View programme →]               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ HOW TO APPLY  ① Check requirements ② Apply (CAS/form) ③ Pay fee ④ Selection ⑤ Join     │
│ Key requirements box                       Intake dates box        [Apply Now]       │
├────────────────────────────────────────────┬─────────────────────────────────────────┤
│ NOTICES · MATANGAZO          [View all →]  │ NEWS & EVENTS                [View all →]│
│ 📌 Selected applicants – March… PDF 220KB  │ ┌────────┐ ┌────────┐ ┌────────┐         │
│ ●  Joining instructions 2026/27  PDF       │ │ image  │ │ image  │ │ image  │         │
│ ●  Exam timetable Sem II         PDF       │ │ title  │ │ title  │ │ title  │         │
│ ●  Tangazo la nafasi za kazi  SW PDF       │ │ date   │ │ date   │ │ date   │         │
│ ●  Fee payment schedule          PDF       │ └────────┘ └────────┘ └────────┘         │
├────────────────────────────────────────────┴─────────────────────────────────────────┤
│ WHY BPHIST: Practical labs · Field practice · Experienced tutors · Library · Hostel   │ 4–6 facility tiles
├──────────────────────────────────────────────────────────────────────────────────────┤
│ BPHIST IN NUMBERS (blue band, server-rendered, "as of" date)                         │
│   [graduates]   [students]   [tutors]   [NTA levels]                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ CAMPUS LIFE gallery strip (6 photos) [Open gallery →]                                 │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ Testimonials (only if consented)  ·  FAQ accordion (5)                               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ VISIT / CONTACT: address, phones, email, hours  │  map (click-to-load)               │
├──────────────────────────────────────────────────────────────────────────────────────┤
│ FOOTER (navy): logo+motto · Quick links · Admissions · Regulators (NACTVET, MoH,     │
│ Pharmacy Council, HESLB, Ajira, e-Mrejesho) · Contacts · © 2026 BPHIST · Privacy     │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Every section after the hero** has a visibility toggle and order field in the Homepage global, so the content role
can hide Testimonials until real ones exist, without touching code.

### Mobile order (≤ 640 px)
Header → alert → hero (text first, image below, CTAs full-width) → quick-access 2×2 → **Notices** (moved up: most-used on phones) → programme pathway (vertical) → how to apply → news (horizontal scroll cards) → numbers 2×2 → gallery (scroll) → FAQ → contact → footer → sticky action bar.

## 5. Page templates

| Template | Layout essentials |
|---|---|
| **Programme detail** | Hero (name, award, duration, intake badges) → overview → **level tabs NTA 4 / 5 / 6** (entry requirements, modules, duration) → careers → fees summary + link → related downloads → CTA "Apply for this programme" → FAQ |
| **Admissions** | Sticky in-page nav (How to apply · Requirements · Dates · Fees · Joining · FAQ) → steps → requirements per level → intake table → fees table → downloads → contact person → "Last verified: dd Mmm yyyy" |
| **Notices list** | Title + search box → category chips → tabs "Current / Archive" → list rows: date · title · category badge · language badge · file type/size · pinned first → pagination (20) |
| **Notice detail** | Breadcrumb → title → date + category → body → **large download button** (PDF inline preview on desktop) → share (WhatsApp, copy link) → related notices |
| **News list / detail** | Card grid (3/2/1 cols) → filter by category → detail: cover, date, body, gallery, share, related |
| **Downloads** | Grouped by category; current academic year expanded, older years under "Archive"; each row shows size + type |
| **About** | Intro + photo → vision/mission/values cards → history timeline (BPHACOH founding → first graduation 22 Dec 2023 → BPHIST → new Ititi campus) → accreditation → leadership teaser |
| **Leadership** | Grouped cards (Principal / Management / Governing Board / Tutors) with photo, name, position |
| **Campus life** | Section blocks: facilities, library (hours), accommodation, health insurance, students' association, sports, worship, counselling & mentorship → gallery strip |
| **Contact** | Contact cards (tap-to-call, WhatsApp, email) → office hours → enquiry form (Turnstile) → map (click-to-load to save data) → directions from Singida bus stand |
| **404** | Friendly message + search + links to Admissions, Notices, Contact |

## 6. SEO essentials (carried over from original, made concrete)
- `generateMetadata` per route; title pattern `{Page} | BPHIST Singida`.
- `sitemap.ts` lists all published pages, programmes, news and notices (with `lastModified`); `robots.ts` disallows `/admin`, `/api`, `/next`.
- JSON-LD: `CollegeOrUniversity` (site-wide, with address, logo, sameAs socials), `Course` (programmes), `NewsArticle` (news), `BreadcrumbList`.
- Canonical URLs; preview pages `noindex`.
- Google Business Profile for "BPHIST Singida" (directions and phone in Maps), managed by Admin.
- Search Console verification at launch; submit sitemap.
