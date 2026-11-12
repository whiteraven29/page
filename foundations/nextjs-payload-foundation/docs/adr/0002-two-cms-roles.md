# 0002: Exactly two CMS roles, enforced in access functions

- **Status:** accepted
- **Date:** 2026-11-12

## Context
Small organisations have one or two people who own the site and a few who publish. Approval chains with more roles
slow publishing down and are hard to train.

## Decision
`users.role` is `admin` or `editor` (projects may rename `editor`, for example to `content`).
- **admin:** everything, including accounts, site settings, navigation and hard delete.
- **editor:** creates, edits, previews and publishes content; can unpublish but not hard-delete; edits only their own account.
Rules live in `src/access/` and are enforced on the server for every API. The role field can be set only by an admin.
The first account ever created is made an admin automatically.

## Consequences
- Safety comes from preview, validation, version history (restore) and no hard delete, not from an approver.
- Every collection and global must use the shared helpers, and `tests/int/access.int.spec.ts` proves the matrix.
- If a project later needs approval, add a `reviewStatus` field and a rule: no third role.

## Alternatives considered
- Payload's open default (any signed-in user can do anything): too risky once several people have accounts.
- Many fine-grained roles: more flexible, but more mistakes and more tests for a small team.
