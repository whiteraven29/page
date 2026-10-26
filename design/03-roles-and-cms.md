# 03: Roles, Permissions and CMS Content Model

## 1. Two roles only

The college is small, so the CMS has **exactly two roles**. Multiple people may hold the same role.

| Role | Who (suggested) | In one sentence |
|---|---|---|
| **`admin`**, overall owner | ICT officer, or the Principal's delegate (1–2 people) | Can do everything in the CMS, including **people, site-wide settings, navigation and deleting things** |
| **`content`**, content manager | PRO / communications, admissions officer, registrar's office (1–3 people) | Creates, edits and **publishes** all public content (news, notices, programmes, admissions, pages, media, downloads, gallery) but **cannot** manage accounts, global settings or permanently delete |

**Not a CMS role:** the *developer* works through GitHub and the server. During the build the developer
uses an `admin` account; at handover the college's Admin either disables it or keeps it for support (written agreement).

> Removed from the original plan: separate *Admissions editor* and *Approver/publisher*.
> Their duties merge into **`content`**. Version history and Admin oversight replace the approval step.

## 2. Permission matrix

✅ allowed · 👁 read only · ❌ no access · 🗄 archive/unpublish only (no hard delete)

| Area | admin | content |
|---|:---:|:---:|
| **Users**: create, edit, disable, reset, change role | ✅ | ❌ (can edit own name/password only) |
| **Site Settings**: logo, contacts, socials, footer, regulator links, default SEO, analytics | ✅ | 👁 |
| **Navigation**: header menu, footer menus | ✅ | 👁 |
| **Redirects** (old URL → new URL) | ✅ | ❌ |
| **Homepage**: hero, alert bar, section visibility/order, numbers, featured items | ✅ | ✅ |
| **Admissions**: current intake, dates, requirements, fees, steps, apply link | ✅ | ✅ |
| **Pages**: About, Campus life, Privacy … (content fields) | ✅ | ✅ (slug locked after first publish; admin can change) |
| **News & Events** | ✅ | ✅ 🗄 |
| **Notices (Matangazo)** | ✅ | ✅ 🗄 |
| **Programmes** | ✅ | ✅ 🗄 |
| **Downloads** | ✅ | ✅ 🗄 |
| **People** (leadership, board, tutors) | ✅ | ✅ 🗄 |
| **Gallery albums, FAQs, Testimonials** | ✅ | ✅ 🗄 |
| **Media library**: upload, replace, alt text | ✅ | ✅ (delete only if unused) |
| **Enquiries** (contact form submissions) | ✅ | 👁 + mark handled |
| **Version history**: view / restore | ✅ | ✅ view & restore own collections |
| **Hard delete** any document | ✅ | ❌ |
| Server, code, database, backups, DNS | ❌ (developer + hosting owner) | ❌ |

### Why content can publish directly
With one or two content staff, a mandatory approver becomes a bottleneck and notices go out late.
Safety comes from: **preview before publish**, **required fields/validation**, **version history with one-click restore**,
**no hard delete**, and the Admin's weekly review of the "Recently changed" dashboard list.
If the college later wants approval for admissions content, add a `reviewStatus` field; no new role is needed.

## 3. Implementation sketch (Payload 3)

```ts
// src/access/index.ts
import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'
export const isStaff: Access = ({ req: { user } }) => Boolean(user)          // admin or content
export const publishedOrStaff: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }
export const adminField: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
export const selfOrAdmin: Access = ({ req: { user } }) =>
  user?.role === 'admin' ? true : user ? { id: { equals: user.id } } : false
```

```ts
// src/collections/Users.ts (excerpt)
export const Users: CollectionConfig = {
  slug: 'users',
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000, tokenExpiration: 8 * 60 * 60 },
  admin: { useAsTitle: 'name', hidden: ({ user }) => user?.role !== 'admin' },
  access: { read: selfOrAdmin, create: isAdmin, update: selfOrAdmin, delete: isAdmin },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select', required: true, defaultValue: 'content',
      options: [{ label: 'Admin', value: 'admin' }, { label: 'Content', value: 'content' }],
      access: { create: adminField, update: adminField } },        // no self-promotion
    { name: 'active', type: 'checkbox', defaultValue: true, access: { update: adminField } },
  ],
}
```

```ts
// typical content collection
access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isAdmin },
versions: { drafts: { autosave: { interval: 2000 }, schedulePublish: true }, maxPerDoc: 25 },
hooks: { afterChange: [revalidateNotices], afterDelete: [revalidateNotices] },
```

Globals: `SiteSettings` and `Navigation` → `update: isAdmin`; `Homepage` and `Admissions` → `update: isStaff`.
Write **vitest tests** that call the Local API as each role and as anonymous to prove the matrix (Week 1, Day 4).

## 4. Publishing workflow

```
 ┌───────┐  save   ┌───────┐ Preview ┌─────────┐ Publish now ┌───────────┐ edit ┌──────────┐
 │ New   │───────► │ Draft │───────► │ Preview │────────────►│ Published │─────►│ New draft│──┐
 └───────┘         └───────┘         └─────────┘ or Schedule └─────┬─────┘      └──────────┘  │
                                                                   │  Unpublish / expiry      │
                                                                   ▼                          │
                                                             ┌──────────┐  ◄── publish ───────┘
                                                             │ Archived │   (restore any version)
                                                             └──────────┘
```
- **Both roles** follow the same flow. Every publish stores a version (who and when).
- **Notices** have `expiresAt`. After it passes they leave the homepage and "Current" list but stay in the archive (stable URL).
- **Alert bar** (Homepage global) has `startsAt`/`endsAt` so "Applications close Friday" disappears on its own.

## 5. Content model

Legend: **R** required · *opt* optional. All publishable types share the **SEO group**
(`metaTitle ≤ 60`, `metaDescription ≤ 160`, `ogImage`) with auto-fallbacks.

### Collections
| Collection | Fields | Notes |
|---|---|---|
| **Users** | name R, email R, role R (`admin`/`content`), active | Auth collection. Admin-only management |
| **Media** | file R, alt R (for images), caption, credit, focal point | Sizes: thumb 400, card 800, hero 1600, og 1200×630; webp/avif. MIME allow-list; no SVG |
| **Pages** | title R, slug R, hero (image, intro), body (rich text + limited blocks: RichText, ImageText, CTA, FAQRef, DownloadList), SEO | For About, Campus life, Privacy, etc. Fixed templates, not a page builder |
| **News & Events** | title R, slug R, summary R (≤ 200), cover R + alt, body R, category (News/Event/Achievement/Graduation), eventDate/venue *opt*, publishedAt, author (auto), gallery *opt*, SEO | `/news/[slug]`; events show date badge |
| **Notices (Matangazo)** | title R (sentence case), slug, category R, summary, body *opt*, **attachment** (PDF/DOCX) *opt*, publishedAt, **expiresAt** *opt*, pinned, urgent, language (EN/SW) | Categories: Admissions · Selected applicants · Joining instructions · Examinations & results · Fees · Vacancies · Tenders · General. File size + type shown automatically |
| **Programmes** | name R, slug R, department/field, award, **NTA levels[]** (level, title, duration, entry requirements rich text, key modules[]), mode (full-time), intakes (Mar/Sep), overview R, careers, image, related downloads, SEO | Pharmaceutical Sciences first; ready for new programmes |
| **Downloads** | title R, file R, category R (Prospectus · Almanac · Fees · Joining instructions · Forms · Regulations · Reports), **academicYear** R, description, featured | Download Centre; older years auto-collapsed under "Archive" |
| **People** | name R, title/position R, group R (Leadership · Governing Board · Tutors), photo, short bio, order | `/about/leadership` |
| **Gallery** | title R, slug, date, cover, images[] (media + caption) | `/gallery` and homepage strip |
| **FAQs** | question R, answer R, category (Admissions · Fees · Campus · Exams), order, showOnHome | |
| **Testimonials** | quote R, name R, programme/year, photo *opt*, **consentConfirmed** R (checkbox) | Hidden unless consent ticked |
| **Enquiries** | name, phone, email, topic, message, handled, createdAt | From contact form; read-only for content except `handled` |
| **Redirects** (plugin) | from, to, type | Admin only; used for any old BPHACOH URLs |

### Globals
| Global | Edited by | Fields |
|---|---|---|
| **SiteSettings** | admin | official name, short name, motto, logo variants, registration (NACTVET reg. no.), address, P.O. Box, phones[], WhatsApp number, emails[], map link/coords, socials[], **regulator quick links[]** (NACTVET, MoH, Pharmacy Council, HESLB, Ajira, e-Mrejesho), office hours, default SEO, analytics ID |
| **Navigation** | admin | header items (label, labelSw, link → page/collection/URL, children ≤ 6), footer columns, utility bar links. **Max 7 top-level items (validated)** |
| **Homepage** | admin + content | alert bar (text, link, start/end, tone), hero (headline, sub, image, primary CTA, secondary CTA), quick-access cards[4], welcome message (person ref + excerpt), featured programme, numbers[] (label, value, as-of date), facilities[], section visibility toggles + order, featured gallery |
| **Admissions** | admin + content | academic year, intake(s) with open/close dates, how to apply steps[], **apply link** (NACTVET CAS / college form), entry requirements (from Programmes), fees table (or ref to Downloads), joining instructions ref, contact person, last verified date (shown on page) |

### Validation rules that prevent the problems seen elsewhere
- Link fields must point to a page/document **or** a full `https://` URL; empty or `#` is rejected.
- Notice titles: warning if > 60 % uppercase.
- Images: `alt` required unless "decorative" is ticked.
- Admissions global shows a **"Last verified"** date; the dashboard shows a warning if it is older than 90 days.
- Downloads: `academicYear` required, so the Download Centre can hide superseded years.
