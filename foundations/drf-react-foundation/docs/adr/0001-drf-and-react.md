# 0001: Django REST Framework API with a separate React app

- **Status:** accepted
- **Date:** 2026-11-06

## Context
Projects need a reliable admin and data layer, and an interactive UI that can grow into a mobile app later.

## Decision
Django + DRF serve a versioned JSON API. React (Vite) is built to static files. Nginx serves both from one domain.

## Consequences
- The Django admin, ORM, migrations and auth come for free.
- The UI is fully interactive, and any client can use the same API.
- There are two toolchains (pip and npm) and two test suites.
- Same-origin hosting means no CORS setup.

## Alternatives considered
- Django templates with HTMX: simpler, but no React practice and harder to reuse for mobile.
- Next.js: adds a Node server and duplicates the backend's job.
