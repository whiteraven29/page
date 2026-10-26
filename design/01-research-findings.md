# 01: Research Findings

Reviewed on 26 Oct 2026. Sources: the original BPHIST plan (PDF), two reference designs in `../resources/`,
five Tanzanian institution websites, and the BPHACOH Prospectus 2024/25–2025/26.

> **Method note.** UDSM, UDOM and KU homepages were fetched and analysed directly. MUST was downloaded
> and its HTML structure extracted. **IAA (iaa.ac.tz and its campus subdomains) could not be fetched** because
> its server failed TLS certificate verification. IAA findings below come from search-indexed pages only and
> are marked *(indexed)*. Colours and mobile behaviour could not be measured from the fetched text, so
> check them by hand in a browser before relying on them.

---

## 1. Reference designs (resources folder)

### A. "LearaPress Education Center" template (`9198f745….avif`)
- Yellow utility strip (phone · email · social), white header, centred nav, **outlined "Apply Now" button** on the right.
- Full-bleed photo hero with dark overlay, two-line headline, one paragraph, **two CTAs** (solid + outline).
- Uses carousel arrows (‹ ›). **We drop the carousel**: it hides messages and costs mobile data.
- Take: utility strip, strong single hero, solid+outline CTA pair, accent colour for action buttons only.

### B. "IMSciences University" concept (`original-c40c5….webp`)
- **Two-tier navigation**: light utility links (Noticeboard, News, Events, Apply Now, Alumni, Contacts, Search) above a coloured primary bar.
- Centred "Welcome to …" hero with Learn More / Virtual Tour buttons and a large media block.
- **Audience cards** (Faculty / Students / Alumni / Resources).
- **Research & Projects** card rows with "View all" pill buttons, and a **"…in Numbers"** stats band on a blue panel.
- Soft blue/grey palette, rounded cards, generous white space.
- Take: audience/quick-access cards, "View all" section pattern, numbers band, soft card style.
  **Simplify** the two-tier nav: BPHIST is one institute, not a university with 30 units.

---

## 2. Tanzanian institution websites

| | **UDSM** udsm.ac.tz | **IAA** iaa.ac.tz *(indexed)* | **UDOM** udom.ac.tz | **KU** (Kairuki Univ.) ku.ac.tz → web.ku.ac.tz | **MUST** must.ac.tz |
|---|---|---|---|---|---|
| Utility bar | Admissions, Timetable, Students, Staff, Alumni, plus a 2nd row (Library, Health, e-Services) | Online application portal (oas.iaa.ac.tz) | Phone, address, email, Staff Portal, Blog, Contact | Experience, Alumni, Prospectus PDF, Media, Library, Almanac PDF, Contact | Phone, P.O. Box, email, **Online Application**, SIMS, Staff Portal |
| Main nav | Home, Admission, Explore Us, Academic Disciplines (~30 units), Offices (~25), Research, Projects: **~60 leaf links** | Programmes catalogue per campus, with fee and intake shown per programme | Home, About, Academic Units, Admission, Directorates, Research, Journals, Conferences, ICT, Campus, Gallery | Home, About, Programs, Research, Admissions, **Online Application**, Administration | Home, About, Academics, Admission, Library, Directorates, Research, Campus Life, ICT Services |
| Hero | 5-slide carousel + Apply Now | n/a | Image strip, **no headline or CTA** | Banner "ADMISSIONS … OPEN" | Title + **"What do you want to learn?" programme finder** |
| Homepage order | Hero → Apply CTA → VC message → Find programme → Announcements → Events → News → Figures → Videos → Footer | Notices of intakes (e.g. Sept 2026/27 invitation PDF) | Programme search → VC welcome → About → Announcements → News → **Documents** → Numbers → Management → Gallery | Banner → News → Announcements → Events → "Our Success" counters → Newsletter → Quick links | Programme finder → VC welcome → News (3) → **Announcements with date + Download** → Publications → Grants → **Download Centre** → Numbers → Footer |
| Notices / downloads | Long dated list; vacancies, tenders, scholarships, interview calls; EN + SW | Intake invitations and joining instructions as PDFs | Announcements with PDFs; policy documents | Announcements incl. vacancies, RFPs, selected applicants | Selected applicants, joining instructions, fee structure, almanac, prospectus, forms |
| Language | No toggle; EN/SW mixed | EN | No toggle; EN pages, SW news | EN only | No toggle; some SW items ("Jinsi ya Kuomba Malazi") |
| Footer | Contacts, socials, quick links, gov links (HESLB, TCU) | n/a | Contacts, **unlabelled** social icons, gov links (Ministry, TCU, HESLB, NACTE) | Contacts, gov links (NACTE, MoH, HESLB, Ajira), newsletter | Contacts, socials, gov links (COSTECH, HESLB, MoEST, NACTE, Ajira, TCU, **e-Mrejesho**) + floating Apply Now |
| Problems seen | Oversized menu, all-caps notice titles, no filters, autoplay carousel | Certificate chain error blocks some clients and crawlers | **Admission links go to `#`**, typo "Learn Mores", crowded | **Dead `#` links**, **stale 2023/24 prospectus**, announcements a year old, **counters show 0** without JS, typo "Almuni" | Counters show **0** without JS; very long menus; publications/grants dominate the page |

### Patterns every site shares (so users expect them)
1. **Dated announcements with PDF downloads** (selected applicants, joining instructions, results, vacancies). This is the single most-used feature.
2. **Online application link** in the top bar *and* main menu *and* a floating/hero CTA.
3. **Head of institution's welcome message** high on the homepage.
4. **Download Centre**: prospectus, almanac, fee structure, joining instructions, forms.
5. **"In numbers" band**.
6. **Footer quick links to regulators**: NACTVET (formerly NACTE), Ministry, HESLB, Ajira, e-Mrejesho.
7. Swahili and English mixed in content, **with no language switcher**.

### Mistakes to design out
| Mistake seen | Our rule |
|---|---|
| `#` placeholder links in menus (UDOM, KU) | Navigation items must reference a real page/URL; CI link-checker fails the build on broken internal links |
| Stale prospectus/notices (KU) | Downloads carry an **academic year**; notices carry an **expiry date** and drop off the homepage automatically |
| Counters showing "0" (KU, MUST) | Numbers are **server-rendered** text; any animation is progressive enhancement only |
| Mega-menus with 60 links (UDSM, MUST) | Max **7 top-level items**, max 6 children each |
| Carousel hero with no message (UDOM, UDSM) | One static hero, one headline, two CTAs |
| All-caps, unfiltered notice lists (UDSM) | Sentence-case titles (validated), **category filter chips**, date + file type/size shown |
| Unlabelled social icons (UDOM) | Icons carry accessible names |
| TLS/cert misconfiguration (IAA) | Cloudflare-managed certificates + SSL Labs check in launch checklist |

---

## 3. What the prospectus tells us about content

- **Programme today:** Pharmaceutical Sciences Technician (PST), CBET, in three NTA levels:
  Basic Technician Certificate (NTA 4) → Technician Certificate (NTA 5) → Ordinary Diploma (NTA 6). Also a pre-NTA 4 course and post-NTA 6 course.
  The new name "Institute of Science and Technology" suggests more programmes later, so **Programmes must be a collection, not a fixed page**.
- Existing copy ready to reuse: Principal's message, Vision/Mission/Core values, governance and board, tutors, library hours, campus life (students' association, health insurance, accommodation, counselling, mentorship, sports, worship), exams and regulations, GPA classification, fees and payment modes, career opportunities.
- Photo-worthy stories: first graduation (22 Dec 2023), compounding practicals, Mei Mosi 2025, planned new campus at Ititi (Singida Municipal).
- **Brand:** logo primary blue `#0646B5` on white; circular seal with mortarboard, flask, atom, gear and microscope.

## 4. What BPHIST's site will do differently

- **Small and focused:** about 12 page templates. No directorates, no research portal.
- **Built for applicants first:** "Apply", "Requirements", "Fees", "Intake dates" reachable in one tap from any page.
- **Notices as a first-class feature:** categories, PDF attachment, expiry date, pinned and urgent flags, alert bar.
- **Two CMS roles only**, so the college can actually keep it current.
- **Lightweight on mobile data**, accessible, and fast.
