/**
 * The CMS has exactly two roles. Rename `editor` per project (BPHIST calls it `content`),
 * but keep the shape: one role that owns accounts and settings, one that publishes content.
 */
export const ROLES = ['admin', 'editor'] as const
export type Role = (typeof ROLES)[number]

export const ADMIN: Role = 'admin'
export const EDITOR: Role = 'editor'

export const ROLE_OPTIONS = [
  { label: 'Admin', value: ADMIN },
  { label: 'Editor', value: EDITOR },
]
