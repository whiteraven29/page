import type { Field } from 'payload'

/**
 * Shared SEO group for every publishable collection. Empty values fall back to the
 * document's own title/summary/cover in `src/lib/seo.ts`.
 */
export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { description: 'Optional. Leave empty to use the title, summary and cover image.' },
  fields: [
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}
