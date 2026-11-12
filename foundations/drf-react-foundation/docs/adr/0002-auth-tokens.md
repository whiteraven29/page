# 0002: JWT access token in memory, refresh token in an httpOnly cookie

- **Status:** accepted
- **Date:** 2026-11-06

## Context
A single-page app needs to stay logged in across reloads without exposing long-lived credentials to JavaScript.

## Decision
- Access token: 15 minutes, returned in the JSON body, kept only in a JavaScript variable.
- Refresh token: 7 days, set as an `httpOnly`, `SameSite=Lax`, `Secure` (in production) cookie scoped to `/api/v1/auth/`. It is rotated on every refresh and blacklisted on logout.

## Consequences
- Injected scripts can't steal a long-lived token from storage.
- A reload costs one refresh request.
- The refresh endpoint uses a cookie, so it must stay same-origin. SameSite=Lax blocks cross-site POSTs. The response body (the new access token) can't be read cross-origin, because there's no CORS.
- Mobile clients would need a variant that returns the refresh token in the body. Add it as `/api/v1/auth/mobile/...` when needed.

## Alternatives considered
- Both tokens in localStorage: simplest, but readable by any injected script.
- Django session cookies with CSRF: secure and simple for web, but less practice with tokens and awkward for mobile.
