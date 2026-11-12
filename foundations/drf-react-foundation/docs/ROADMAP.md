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

- **Data model:** entities, fields and relationships. Draw it with Mermaid, which GitHub renders.
- **API:** list each endpoint with its method, path, who can call it, request and response, following `CONVENTIONS.md`.
- **Screens:** list the pages and what each one shows. Sketches on paper are fine.
- **Apps:** which Django apps exist and what each one owns.
- **Decisions:** each important choice goes in `docs/adr/`.

**Done when** someone else could build version 1 from the document.

## Phase 4: Build

**Goal:** working features merged in small steps.

**For each issue:**
1. `git switch -c feat/<short-name>`
2. Backend: run `make app name=...` if it's a new area. Then build the model, migration, service, serializer, view and URL, with tests alongside.
3. Frontend: add `features/<name>/api.js`, then the page, then the route.
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
| Unit | pytest, Vitest | Services, serializers and helpers do the right thing |
| API | pytest + DRF `APIClient` | Endpoints, permissions and error shapes |
| UI | Vitest + Testing Library | Components handle loading, errors and input |
| End to end | Playwright (add when needed) | A real user flow works in a browser |
| Security | `manage.py check --deploy`, `pip-audit`, `npm audit` | Settings and dependencies are safe |
| Manual | You, with the acceptance criteria | It actually solves the problem |

**Before a release:** run `make check`, try every v1 story by hand, and test on a phone screen.

## Phase 6: Deploy

Follow [DEPLOYMENT.md](DEPLOYMENT.md). In short:

1. On the server, install Python, Node, PostgreSQL and Nginx, and create the database.
2. Clone to `/srv/<app>`, then create `backend/.env` with real secrets.
3. Install the systemd service and the Nginx site, then get HTTPS with certbot.
4. Run `APP=<app> ./deploy/deploy.sh` for every release.
5. Tag the release: `git tag v1.0.0 && git push --tags`.

**Done when** `https://<domain>/api/v1/health/` returns `"status": "ok"`.

## Phase 7: Maintain

- **Monitoring:** point an uptime checker at `/api/v1/health/`, and read `journalctl -u <app>` when something breaks.
- **Backups:** run `pg_dump` nightly and keep copies off the server. Test a restore once.
- **Updates:** update dependencies monthly with `pip list --outdated` and `npm outdated`, then run tests and deploy.
- **Feedback:** turn user reports into issues, which start the loop again at Phase 2.
- **Changelog:** keep `CHANGELOG.md` with each release's changes.

## Growing the foundation

Add these only when a project needs them, and record each one in an ADR:

| Need | Add |
|---|---|
| Slow work: emails, reports, scans | Celery + Redis worker |
| Repeated expensive reads | Redis cache |
| Live updates | Django Channels or server-sent events |
| File uploads at scale | S3-compatible storage (MinIO, Backblaze) |
| More data fetching on the frontend | TanStack Query |
| Bigger frontend | TypeScript |
| Same-shape deploys everywhere | Dockerfiles for backend and frontend |
| Errors in production | Sentry |
| Metrics | Prometheus + Grafana |
