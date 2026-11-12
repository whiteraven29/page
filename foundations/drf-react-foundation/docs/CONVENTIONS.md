# Conventions

## API

| Rule | Example |
|---|---|
| Version every path | `/api/v1/notes/` |
| Plural nouns, no verbs | `/projects/`, `/projects/12/` |
| Actions that aren't CRUD | `POST /projects/12/archive/` |
| Methods | `GET` read, `POST` create or act, `PATCH` partial update, `DELETE` remove |
| Status codes | 200 OK, 201 created, 204 no body, 400 invalid, 401 not logged in, 403 not allowed, 404 not found or not yours, 429 too many requests |
| JSON field names | `snake_case`, matching Django |
| Timestamps | ISO 8601 with time zone: `2026-11-06T09:00:00+03:00` |
| Lists | Paginated: `{count, next, previous, results}`, with `?page=2&page_size=50` |
| Search and sort | `?search=word&ordering=-created_at` |

**Errors:** all errors have this shape:

```json
{"error": {"status": 400, "code": "invalid", "message": "Some fields need fixing.",
           "details": {"title": ["Title can't be blank."]}}}
```

**Other users' data:** return **404**, not 403, so the API doesn't reveal that the object exists.

## Backend code

- **Apps:** each one lives in `apps/<plural_noun>/` and owns its models, URLs and tests.
- **Views:** keep them thin, and put rules in `services.py` with keyword-only arguments: `create_note(*, owner, title)`.
- **Models:** inherit `TimeStampedModel`, and add `__str__`, `Meta.ordering` and indexes for common filters.
- **Migrations:** never edit one that's already merged. Add a new one instead.
- **Style:** Ruff formats and lints, with a 110 character line length.
- **Tests:** go in `apps/<name>/tests/test_*.py`, with one behaviour per test. Name them after what should happen: `test_users_cannot_see_each_others_notes`.

## Frontend code

- **Components:** `PascalCase.jsx`. Hooks and helpers use `camelCase.js`.
- **Feature folders:** `features/<name>/` holds `api.js`, `<Name>Page.jsx`, its components and tests.
- **API calls:** only through `api()` from `api/client.js`.
- **Every request** handles loading, empty and error states.
- **Forms:** show `error.details[field]` next to each field with `FieldError`.

## Git

- **Branches:** `feat/<name>`, `fix/<name>`, `docs/<name>` and `chore/<name>`, all from `main`.
- **Commits:** follow Conventional Commits: `feat(notes): pin notes to the top`.
- **Merging:** one pull request per issue, merged only when CI is green, using squash merge.
- **Releases:** tag with semantic versions: `v1.2.0`. Bump major for breaking changes, minor for features and patch for fixes.

## Testing targets

- **Backend:** coverage stays above 85%. Every endpoint has a test for login required and for ownership.
- **Frontend:** the API client and every form have tests.
- **Bugs:** a test that reproduces the bug comes first, then the fix.
