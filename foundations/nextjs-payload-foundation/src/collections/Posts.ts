import type { CollectionConfig } from 'payload'

import { isAdmin, isStaff, publishedOrStaff } from '@/access'
import { seoField } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { validateSentenceCase } from '@/fields/validators'
import { previewPath } from '@/lib/preview'

/**
 * Example collection: copy its shape for every publishable content type, then delete it.
 * Drafts, versions, scheduled publishing, slug, SEO group, preview and published-only access.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
    preview: (doc) => previewPath(`/posts/${doc.slug as string}`),
  },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isAdmin, // editors unpublish instead of deleting
  },
  versions: {
    drafts: { autosave: { interval: 2000 }, schedulePublish: true },
    maxPerDoc: 25,
  },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', type: 'text', required: true, validate: validateSentenceCase },
    { name: 'summary', type: 'textarea', required: true, maxLength: 200 },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'body', type: 'richText' },
    slugField('title'),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value ?? (siblingData?._status === 'published' ? new Date().toISOString() : value),
        ],
      },
    },
    seoField,
  ],
}
