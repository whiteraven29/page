# Project Roadmap (SDLC)

Every project built on this foundation goes through the same seven phases. Each phase ends with something written down or merged, so you always know where a project stands.

```text
1 Plan -> 2 Requirements -> 3 Design -> 4 Build -> 5 Test -> 6 Deploy -> 7 Maintain
                                          ^__________________________________|
                                          each new feature loops back through 2 to 6
```

## Phase 1: Plan

**Goal:** decide whether the project is worth building and what version 1 is.

**Write:** `docs/PLAN.md`, one page with:
- **Problem:** one or two sentences on what hurts today.
- **Users:** who uses it, such as students, ICT staff or SMEs.
- **Version 1:** at most five things it must do, and anything else is out of scope.
- **Success:** how you'll know it works, such as "10 real users in a month".
- **Risks:** what could sink it, such as data privacy, hosting cost or your time.

**Done when** you can explain version 1 in 30 seconds.

## Phase 2: Requirements

**Goal:** turn the plan into testable work.

**Write:** `docs/REQUIREMENTS.md`, plus one GitHub issue per user story using the Feature template.

- **User stories:** "As a `<user>`, I want `<goal>` so that `<reason>`."
- **Acceptance criteria:** for each story, write "Given ..., when ..., then ...". These become your tests.
- **Non-functional requirements:** speed, availability, security, privacy and supported devices.
- **Milestone:** label issues `v1`, `v1.1` or `later`.

**Done when** every v1 story has acceptance criteria.

## Phase 3: Design

**Goal:** decide how it works before writing code.

**Write:** `docs/DESIGN.md`.

- **Content model:** collections, globals and fields, with who may read and write each one (fill the role matrix in `ARCHITECTURE.md`).
- **Pages:** the sitemap and what each template shows. Sketches on paper are fine.
- **Editor workflow:** draft, preview, publish, schedule, expire.
- **Custom endpoints:** only for things Payload does not already give you (forms, webhooks).
- **Decisions:** each important choice goes in `docs/adr/`.

**Done when** someone else could build version 1 from the document.

## Phase 4: Build

**Goal:** working features merged in small steps.

**For each issue:**
1. `git switch -c feat/<short-name>`
2. Content: add the collection or global (see "Add a collection" in `CONVENTIONS.md`), run `make types`, and add its access test.
3. Pages: add the query to `src/lib/queries.ts`, then the route under `src/app/(frontend)/`.
4. Run `make check`.
5. Open a pull request, fill in the checklist, and wait for CI to pass.
6. Merge to `main` and close the issue.

**Rules:**
- `main` must always work.
- Keep pull requests small, ideally under about 400 changed lines.
- No feature merges without tests.

## Phase 5: Test

Testing runs during Build, and this phase adds the release-level checks.

| Level | Tool | What it proves |
|---|---|---|
| Unit | Vitest | Validators and helpers do the right thing |
| Access | Vitest + Payload Local API | The role matrix holds for anonymous, editor and admin |
| End to end | Playwright | Pages render on desktop and phone, the admin loads |
| Performance | Lighthouse (mobile) | The budgets in the design are met |
| Security | `npm audit`, header check, SSL Labs | Dependencies, headers and TLS are safe |
| Manual | You, with the acceptance criteria | It actually solves the problem |

**Before a release:** run `make check`, try every v1 story by hand, and test on a phone screen.

## Phase 6: Deploy

Follow [DEPLOYMENT.md](DEPLOYMENT.md). In short:

1. On the server, install Docker, and point DNS (through Cloudflare) at it.
2. Create `/srv/<app>/.env` with real secrets.
3. Run `APP_IMAGE=<image:tag> ./docker/deploy.sh` for every release. Migrations run on start-up.
4. Tag the release: `git tag v1.0.0 && git push --tags`.

**Done when** `https://<domain>/api/health` returns `"status": "ok"`.

## Phase 7: Maintain

- **Monitoring:** point an uptime checker at `/api/health`, and read `docker compose logs app` when something breaks.
- **Backups:** `docker/backup.sh` nightly, with an off-site copy. Test a restore once.
- **Updates:** update dependencies monthly with `npm outdated`. Upgrade Payload packages together, all to the same version, then run tests and deploy.
- **Feedback:** turn user reports into issues, which start the loop again at Phase 2.
- **Changelog:** keep `CHANGELOG.md` with each release's changes.

## Growing the foundation

Add these only when a project needs them, and record each one in an ADR:

| Need | Add |
|---|---|
| Media on object storage | `@payloadcms/storage-s3` (works with Cloudflare R2) |
| Old URLs to redirect | `@payloadcms/plugin-redirects` |
| Site search | `@payloadcms/plugin-search` |
| Bot protection on forms | Cloudflare Turnstile, checked in the endpoint |
| Email (password reset, notifications) | `@payloadcms/email-nodemailer` or `@payloadcms/email-resend` |
| Measured slow pages | Page caching: see `docs/adr/0003-render-on-request.md` |
| Errors in production | Sentry |
| Two languages | Payload `localization` (`en`, `sw` …) |
