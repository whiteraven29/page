# CLAUDE.md

Instructions for Claude Code working in this repository.

## Project
Django REST Framework API in `backend/`, React (Vite, JavaScript) app in `frontend/`.
Read `docs/ARCHITECTURE.md` and `docs/CONVENTIONS.md` before larger changes.
If `docs/DESIGN.md` exists, it describes the product. Follow it, and ask before changing its decisions.

## Commands
- `make setup`: first-time install
- `make backend` / `make frontend`: run the servers. Open http://localhost:5173.
- `make test`, `make lint`, `make check`: run `make check` before saying work is done
- `make app name=<name>`: new backend app from `backend/templates/app_template`
- `make migrations migrate`: after model changes

## Backend rules
- Each feature is an app in `backend/apps/<name>/` with models, serializers, services, views, urls, admin and tests.
- Put business logic in `services.py` and keep views thin. Queries that decide what a user may see live in a selector function there.
- Every endpoint needs login by default. Use `AllowAny` only on purpose, with a comment.
- Always filter querysets by the current user for owned data, and add a test that another user gets 404.
- Errors must use the shape from `apps/core/exceptions.py`. Raise DRF exceptions rather than building error responses by hand.
- Mount new apps in `config/api_v1.py`. Never break `/api/v1/`. Breaking changes go in `/api/v2/`.
- New models inherit `apps.core.models.TimeStampedModel`. Include migrations in the same change.
- Secrets come from the environment through `django-environ`. Never hard-code them.
- Tests use pytest with the fixtures in `backend/conftest.py`. Add tests with every change.

## Frontend rules
- Only `src/api/client.js` calls `fetch`. Each feature has `src/features/<name>/api.js`.
- Never put tokens in localStorage or sessionStorage.
- Routes live in `src/app/App.jsx`. Wrap logged-in pages in `<RequireAuth />`.
- Show loading, empty and error states for every list.
- Tests use Vitest and Testing Library next to the file: `Thing.test.jsx`.

## Working style
- Make small changes, each with tests, and run `make check`.
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.
- Record decisions that are hard to reverse as a new ADR in `docs/adr/`.
