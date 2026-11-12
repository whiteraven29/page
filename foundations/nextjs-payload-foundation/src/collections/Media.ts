import path from 'path'
import { fileURLToPath } from 'url'

import { APIError, type CollectionConfig } from 'payload'

import { anyone, isAdmin, isStaff } from '@/access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const MB = 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
]
// SVG is deliberately absent: it can carry scripts (stored XSS).
export const ALLOWED_MIME_TYPES = [...IMAGE_TYPES, ...DOCUMENT_TYPES]
export const MAX_IMAGE_BYTES = 10 * MB
export const MAX_DOCUMENT_BYTES = 20 * MB

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content', defaultColumns: ['filename', 'alt', 'mimeType', 'filesize', 'updatedAt'] },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ALLOWED_MIME_TYPES,
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 400 },
      { name: 'card', width: 800 },
      { name: 'hero', width: 1600 },
      // Social previews always need 1200×630, so this one size may upscale a smaller photo.
      { name: 'og', width: 1200, height: 630, position: 'centre', withoutEnlargement: false },
    ],
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
  hooks: {
    beforeValidate: [
      ({ req }) => {
        const file = req.file
        if (!file) return
        const limit = IMAGE_TYPES.includes(file.mimetype) ? MAX_IMAGE_BYTES : MAX_DOCUMENT_BYTES
        if (file.size > limit) {
          throw new APIError(`File is too large. The limit is ${limit / MB} MB.`, 400, null, true)
        }
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Describe the image for people who cannot see it. Required for images.' },
      validate: (value: unknown, { data }: { data: Partial<{ mimeType: string; decorative: boolean }> }) => {
        const isImage = typeof data?.mimeType === 'string' && data.mimeType.startsWith('image/')
        if (isImage && !data?.decorative && !String(value ?? '').trim()) {
          return 'Alt text is required for images (or tick "Decorative").'
        }
        return true
      },
    },
    {
      name: 'decorative',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Tick only if the image adds nothing for a screen-reader user.' },
    },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
  ],
}
