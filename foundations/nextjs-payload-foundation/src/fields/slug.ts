import type { Field } from 'payload'

import { isAdminUser } from '@/access'

import { slugify } from './validators'

/**
 * URL slug, filled from another field when left empty. Once a document has been published,
 * only an admin can change its slug, so shared links and search results keep working.
 */
export const slugField = (from = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Part of the web address. Filled in from the title if left empty.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc, req }) => {
        const previous = originalDoc?.slug as string | undefined
        const wasPublished = originalDoc?._status === 'published' || Boolean(originalDoc?.publishedAt && previous)
        if (previous && wasPublished && value !== previous && !isAdminUser(req.user)) return previous
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = data?.[from] ?? originalDoc?.[from]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})
