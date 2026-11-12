/**
 * Access rules, enforced on the server for the admin UI, REST, GraphQL and the Local API
 * (when called with `overrideAccess: false`). Hiding something in the UI is never enough.
 *
 * Use these in every collection and global. Do not write inline `({ req }) => ...` rules
 * in collection files: one place to read, one place to test (tests/int/access.int.spec.ts).
 */
import type { Access, FieldAccess, PayloadRequest } from 'payload'

import { ADMIN } from './roles'

type MaybeUser = { id: number | string; role?: string | null; active?: boolean | null } | null | undefined

/** Signed in and not disabled. */
export const isActive = (user: MaybeUser): boolean => Boolean(user && user.active !== false)
export const isAdminUser = (user: MaybeUser): boolean => isActive(user) && user?.role === ADMIN

export const anyone: Access = () => true

/**
 * Yes/no rules. Typed as plain booleans so they also fit places that refuse query results
 * (the admin-panel gate, job access).
 */
type BooleanAccess = (args: { req: PayloadRequest }) => boolean

/** Admin role only: accounts, site settings, navigation, hard delete. */
export const isAdmin: BooleanAccess = ({ req: { user } }) => isAdminUser(user)

/** Any active CMS user (admin or editor). */
export const isStaff: BooleanAccess = ({ req: { user } }) => isActive(user)

/** Staff see drafts; everyone else sees published documents only. */
export const publishedOrStaff: Access = ({ req: { user } }) =>
  isActive(user) ? true : { _status: { equals: 'published' } }

/** A user may read and edit their own account; admins may read and edit all. */
export const selfOrAdmin: Access = ({ req: { user } }) => {
  if (isAdminUser(user)) return true
  if (isActive(user)) return { id: { equals: user!.id } }
  return false
}

/** Field-level: only admins may set or change this field (for example `role`). */
export const adminField: FieldAccess = ({ req: { user } }) => isAdminUser(user)
