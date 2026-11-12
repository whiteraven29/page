# DRF React Foundation

A starter for every new project: **Django REST Framework** API, **React** (Vite) frontend, login already working, tests, CI, and deployment files for a Linux server.

Use it as the first commit of each project, then follow [docs/ROADMAP.md](docs/ROADMAP.md) from idea to production.

## What's already done

| Area | Included |
|---|---|
| Backend | Django 5.2, DRF, split settings (dev, test, prod), `.env` config, PostgreSQL or SQLite |
| Auth | Email login, JWT access token in memory, refresh token in an httpOnly cookie, token rotation and logout revocation |
| API | Versioned under `/api/v1/`, one error format, pagination, search, ordering, throttling, OpenAPI docs at `/api/v1/docs/` |
| Example | A `notes` feature in backend and frontend showing the pattern to copy |
| Frontend | React 18, React Router, API client with automatic token refresh, protected routes |
| Quality | pytest with coverage, Vitest, Ruff, ESLint, pre-commit hooks, GitHub Actions |
| Ops | Docker Compose for PostgreSQL, Nginx and systemd files, a deploy script, a health endpoint |
| Tooling | VS Code settings, debug configs, a `make` command for every task, a Django app template |

## Quick start

Needs Python 3.12+, Node 20+ and `make`. On Windows, use WSL.

```bash
git clone <your-repo-url> myproject && cd myproject
make setup          # venv, packages, .env, database
make backend        # terminal 1: Django on :8000
make frontend       # terminal 2: React on :5173
```

Open **http://localhost:5173**, register, and try Notes. API docs: http://localhost:5173/api/v1/docs/

```bash
make superuser      # login for http://localhost:5173/admin/
make test           # all tests
make check          # everything CI runs
make help           # list every command
```

### Using PostgreSQL locally

SQLite works out of the box. To match production, use PostgreSQL:

```bash
make db
echo "DATABASE_URL=postgres://app:app@localhost:5432/app" >> backend/.env
make migrate
```

## Project layout

```text
.
├── backend/                     Django + DRF
│   ├── config/
│   │   ├── settings/            base.py, dev.py, test.py, prod.py
│   │   ├── urls.py              /admin/ and /api/v1/
│   │   └── api_v1.py            mounts each app's urls
│   ├── apps/
│   │   ├── core/                shared base model, errors, pagination, permissions, health
│   │   ├── accounts/            custom user, register, login, refresh, logout, me
│   │   └── notes/               example feature (copy the shape, then delete)
│   ├── templates/app_template/  used by `make app name=...`
│   ├── requirements/            base.txt, dev.txt, prod.txt
│   └── conftest.py              shared test fixtures
├── frontend/                    React + Vite
│   └── src/
│       ├── api/client.js        the only code that calls the API
│       ├── app/App.jsx          all routes
│       ├── features/<name>/     api.js + pages + components per feature
│       ├── components/          shared UI
│       └── pages/               pages that aren't a feature
├── docs/                        roadmap, architecture, conventions, decisions
├── deploy/                      nginx, systemd, deploy.sh
├── .github/                     CI, PR and issue templates
├── .vscode/                     editor settings and debug configs
├── CLAUDE.md                    instructions for Claude Code
└── Makefile
```

## Adding a feature

```bash
make app name=projects
```

1. Add `"apps.projects"` to `LOCAL_APPS` in `backend/config/settings/base.py`.
2. Add `path("projects/", include("apps.projects.urls"))` to `backend/config/api_v1.py`.
3. Shape `models.py`, then run `make migrations migrate test`.
4. On the frontend, copy `src/features/notes/` to `src/features/projects/` and add its route in `src/app/App.jsx`.

## Starting a new project from this

1. On GitHub, open this repository's **Settings** and tick **Template repository**.
2. For each new project, click **Use this template**.
3. Rename it: change `APP_NAME` in `backend/.env.example` and the `<title>` in `frontend/index.html`.
4. Delete `notes` once you have your own first feature.
5. Write `docs/REQUIREMENTS.md` before building anything else, as described in the roadmap.

## Documents

- [docs/ROADMAP.md](docs/ROADMAP.md): the SDLC steps for every project
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the pieces fit and why
- [docs/CONVENTIONS.md](docs/CONVENTIONS.md): API, code, git and testing rules
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): putting it on a Linux server
- [docs/adr/](docs/adr/): decisions and the reasons for them
