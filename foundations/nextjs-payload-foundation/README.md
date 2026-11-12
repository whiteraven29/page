# Next.js + Payload Foundation

A starter for **content websites**: Next.js App Router renders the public pages, **Payload CMS 3** gives staff an admin
with drafts, preview, versions and scheduled publishing, all in one app. Two CMS roles, tests, CI and Docker
deployment are already done.

The sibling `drf-react-foundation` is for API-first apps. Use this one when non-technical people publish the content
(ADR 0001 explains the choice).

## What's already done

| Area | Included |
|---|---|
| App | Next.js 16 (App Router, TypeScript strict), Payload 3.93 inside it: admin at `/admin`, REST and GraphQL at `/api` |
| Database | PostgreSQL (production, CI) or SQLite (local), chosen by `DATABASE_URL`; migrations applied on start-up |
| Roles | Exactly two, `admin` and `editor`, enforced on the server; first account becomes admin; lockout after 5 failures; disable accounts |
| Content | `posts` example: drafts, 25 versions, scheduled publish, stable slug, SEO group, preview, sentence-case rule |
| Media | Image sizes (thumb, card, hero, og) as WebP, focal point, alt text required, MIME allow-list (no SVG), size limits |
| Pages | Layout, home, list with pagination, detail with metadata, 404, `sitemap.xml`, `robots.txt`, preview bar |
| Quality | Vitest access-matrix tests on the Local API, validator unit tests, Playwright smoke tests, ESLint, TypeScript, GitHub Actions |
| Ops | Dockerfile (standalone), Compose with PostgreSQL + Caddy, deploy and backup scripts, `/api/health` |

## Quick start

Needs Node 22.23.4+ (`nvm install` reads `.nvmrc`) and `make`. On Windows, use WSL.

```bash
git clone <your-repo-url> mysite && cd mysite
make setup          # packages, .env with a random PAYLOAD_SECRET
make dev            # http://localhost:3000
```

Open **http://localhost:3000/admin** and create the first account: it becomes the admin.
Or seed one: `SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD=... make seed`.

```bash
make test           # access matrix + unit tests on a fresh SQLite database
make check          # everything CI runs, except the build
make build          # production build, no database needed
make help           # every command
```

### Using PostgreSQL locally

SQLite works out of the box. To match production, and to generate migrations:

```bash
make db
sed -i 's#^DATABASE_URL=.*#DATABASE_URL=postgres://app:app@localhost:5432/app#' .env
make dev
```

## Project layout

```text
.
├── src/
│   ├── access/            the two roles and every access rule
│   ├── collections/       Users, Media, Posts (example: copy its shape, then delete)
│   ├── fields/            seo, slug, validators (no # links, sentence case)
│   ├── endpoints/         /api/health
│   ├── lib/               payload client, preview, queries (all public reads), seo, site helpers
│   ├── components/        shared UI
│   ├── migrations/        PostgreSQL migrations
│   ├── app/(frontend)/    public pages, preview routes, sitemap
│   ├── app/(payload)/     generated admin and API routes (do not edit)
│   └── payload.config.ts
├── tests/int/             Vitest + Payload Local API
├── tests/e2e/             Playwright
├── scripts/seed.ts        first admin + sample content
├── docker/                compose.prod.yml, Caddyfile, deploy.sh, backup.sh
├── docs/                  roadmap, architecture, conventions, deployment, ADRs
├── .github/               CI, PR and issue templates
└── Makefile
```

## Starting a new project from this

1. Copy this folder (or use it as a GitHub template repository) to a new folder **outside** this repository,
   next to the `page/` folder (for example `BPHACOH/<project-name>/`), then run `git init` there. Each project is its own repository.
2. Rename: `name` in `package.json`, `NEXT_PUBLIC_SITE_NAME` in `.env.example`, and the editor role label if needed (`src/access/roles.ts`).
3. Write `docs/REQUIREMENTS.md` and `docs/DESIGN.md` before building, as described in the roadmap.
4. Add your collections with the recipe in `docs/CONVENTIONS.md`, then delete `posts`.

## Documents

- [docs/ROADMAP.md](docs/ROADMAP.md): the SDLC steps for every project
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the pieces fit, the role matrix, databases
- [docs/CONVENTIONS.md](docs/CONVENTIONS.md): the "add a collection" recipe and code rules
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): one server with Docker behind Cloudflare
- [docs/adr/](docs/adr/): decisions and the reasons for them
